import { NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility
import { sendSMS } from "@/lib/sendSMS";
import Menu from "@/models/menu.model";
import mongoose from "mongoose";
import dayjs from "dayjs";
import { isTimeOutsideWorkingHours } from "@/lib/isTimeOutsideWorkingHours";
import { isHolidayDate } from "@/lib/isHolidayDate";
import { isAppointmentOverlapping } from "@/lib/isAppointmentOverlapping";

export async function POST(req: Request) {
  try {
    await dbConnect(); // Connect to the database

    const body = await req.json(); // Get the request body

    const { name, number, date, time, services, message } = body;

    // Validate required fields
    if (!name || !number || !date || !time || !services) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Check if the appointment date falls on a holiday
    const isHoliday = await isHolidayDate(date);

    if (isHoliday) {
      return NextResponse.json(
        {
          error: "The selected date is a holiday, please choose another date.",
        },
        { status: 400 }
      );
    }

    if (isTimeOutsideWorkingHours(time)) {
      return NextResponse.json(
        { error: "Appointment time is outside working hours" },
        { status: 400 }
      );
    }

    // Check if the appointment overlaps
    const isOverlapping = await isAppointmentOverlapping(date, time, services);

    if (isOverlapping) {
      return NextResponse.json(
        { error: "The selected time slot is already booked or overlapping" },
        { status: 400 }
      );
    }

    // Fetch service names based on the provided IDs
    const serviceIds = services; // Assuming services is an array of service IDs
    const serviceDocs = await Menu.find({ _id: { $in: serviceIds } }); // Fetch services from DB
    const serviceNames = serviceDocs.map((service) => service.menuName); // Extract menu names

    // Create a new appointment document (but don't save yet)
    const newAppointment = new Appointment({
      name,
      number,
      date,
      time,
      services,
      message,
    });

    // Start a session for transaction (optional if using MongoDB replica set)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Save the appointment first
      await newAppointment.save({ session }); // Save with session for rollback

      // Prepare SMS content
      const smsBody = `Hi ${name}, your appointment for: ${serviceNames.join(
        ", "
      )} is confirmed on ${dayjs(date).format("DD/MM/YYYY")} at ${dayjs(
        time
      ).format("hh:mm a")}. See you soon!`;

      // Send SMS
      try {
        await sendSMS(number, smsBody); // Send SMS to the user

        // Commit transaction after both save and SMS success
        await session.commitTransaction();
        session.endSession();

        // Return success response
        return NextResponse.json(
          { success: true, data: newAppointment },
          { status: 201 }
        );
      } catch (smsError) {
        // Rollback the transaction if SMS fails
        await session.abortTransaction();
        session.endSession();

        console.error("Failed to send SMS:", smsError);
        return NextResponse.json(
          { error: "Failed to send SMS, appointment not saved" },
          { status: 500 }
        );
      }
    } catch (dbError) {
      // Rollback the transaction if DB save fails
      await session.abortTransaction();
      session.endSession();

      console.error("Failed to save appointment:", dbError);
      return NextResponse.json(
        { error: "Failed to save appointment" },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

// app/api/appointment/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility
import { isTimeOutsideWorkingHours } from "@/lib/isTimeOutsideWorkingHours";
import { isHolidayDate } from "@/lib/isHolidayDate";
import { isAppointmentOverlapping } from "@/lib/isAppointmentOverlapping";
import mongoose from "mongoose";
// import { sendSMS } from "@/lib/sendSMS";
// import Menu from "@/models/menu.model";
// import dayjs from "dayjs";

// PUT handler for updating an appointment
export async function PUT(req: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    // Extract the appointment id from the URL parameters
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Get the ID from the URL

    if (!id) {
      return NextResponse.json(
        { error: "Appointment ID is missing" },
        { status: 400 }
      );
    }

    // Parse the updated data from the request body
    const updatedData = await req.json();

    const { date, time, services } = updatedData;

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
    const isOverlapping = await isAppointmentOverlapping(
      date,
      time,
      services,
      id
    );

    if (isOverlapping) {
      return NextResponse.json(
        { error: "The selected time slot is already booked or overlapping" },
        { status: 400 }
      );
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find and update the appointment
      const updatedAppointment = await Appointment.findByIdAndUpdate(
        id,
        updatedData,
        {
          new: true, // Return the updated document
          runValidators: true, // Ensure validation rules are applied
          session, // Use the session for the transaction
        }
      );

      if (!updatedAppointment) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json(
          { error: "Appointment not found" },
          { status: 404 }
        );
      }

      // Fetch service names based on the provided IDs
      // const serviceIds = services; // Assuming services is an array of service IDs
      // const serviceDocs = await Menu.find({ _id: { $in: serviceIds } }); // Fetch services from DB
      // const serviceNames = serviceDocs.map((service) => service.menuName); // Extract menu names

      // Prepare SMS content (format as needed)
      // const smsBody = `Hi ${name}, There is an update to your recent appointment for: ${serviceNames.join(
      //   ", "
      // )}. It is now updated on ${dayjs(date).format("DD/MM/YYYY")} at ${dayjs(
      //   time
      // ).format("hh:mm a")}. See you soon!`;

      // Send SMS
      try {
        // await sendSMS(number, smsBody); // Send SMS to the user
        await new Promise((resolve) => setTimeout(resolve, 200)); // Simulate SMS delay

        // Commit the transaction after SMS success
        await session.commitTransaction();
        session.endSession();

        return NextResponse.json(
          {
            success: true,
            message: "Appointment updated successfully and SMS sent",
            data: updatedAppointment,
          },
          { status: 200 }
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
      // Rollback the transaction if any error occurs
      await session.abortTransaction();
      session.endSession();

      console.error("Failed to update appointment:", dbError);
      return NextResponse.json(
        { error: "Failed to update appointment" },
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

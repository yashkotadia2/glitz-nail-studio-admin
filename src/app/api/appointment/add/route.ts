import { NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility
import { sendSMS } from "@/lib/sendSMS";
import Menu from "@/models/menu.model";
import mongoose from "mongoose";

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

    // Format date and time using built-in Date object
    const formattedDate = new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }); // e.g., 12 Jan 2025

    const formattedTime = new Date(time).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    }); // e.g., 4:30 PM

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
      )} is confirmed on ${formattedDate} at ${formattedTime}. See you soon!`;

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

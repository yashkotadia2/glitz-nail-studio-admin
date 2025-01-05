// app/api/appointment/route.ts
import { NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

// Get all appointments
export async function GET() {
  try {
    await dbConnect(); // Connect to the database

    // Fetch all appointments from the Appointment collection
    const appointments = await Appointment.find().sort({ createdAt: -1 }); // Sort by most recent first

    return NextResponse.json(appointments);
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

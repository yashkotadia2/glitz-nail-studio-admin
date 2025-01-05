// app/api/appointment/route.ts
import { NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

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

    // Create a new appointment document
    const newAppointment = new Appointment({
      name,
      number,
      date,
      time,
      services,
      message,
    });

    await newAppointment.save(); // Save to the database

    return NextResponse.json(
      { success: true, data: newAppointment },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

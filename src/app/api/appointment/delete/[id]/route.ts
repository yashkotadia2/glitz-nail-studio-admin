// app/api/appointment/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

// DELETE handler for deleting an appointment
export async function DELETE(req: NextRequest) {
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

    // Find and delete the appointment by id
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment deleted successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

// app/api/appointment/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import Appointment from "@/models/appointment.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility
import { isTimeOutsideWorkingHours } from "@/lib/isTimeOutsideWorkingHours";
import { isHolidayDate } from "@/lib/isHolidayDate";
import { isAppointmentOverlapping } from "@/lib/isAppointmentOverlapping";

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

    // Find and update the appointment by id
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      updatedData,
      {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      }
    );

    if (!updatedAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Appointment updated successfully",
        data: updatedAppointment,
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

import { NextRequest, NextResponse } from "next/server";
import Holiday from "@/models/holiday.model"; // Adjust path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

// PUT handler for updating a holiday
export async function PUT(req: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    // Extract the holiday ID from the URL parameters
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Get the ID from the URL

    if (!id) {
      return NextResponse.json(
        { error: "Holiday ID is missing" },
        { status: 400 }
      );
    }

    // Parse the updated data from the request body
    const updatedData = await req.json();

    // Find and update the holiday by id
    const updatedHoliday = await Holiday.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedHoliday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    return NextResponse.json(updatedHoliday, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

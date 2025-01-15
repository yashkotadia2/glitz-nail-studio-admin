import { NextResponse } from "next/server";
import Holiday from "@/models/holiday.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

export async function POST(req: Request) {
  try {
    // Connect to the database
    await dbConnect();

    // Parse the request body
    const body = await req.json();
    const { holidayName, holidayDate, description } = body;

    // Validate required fields
    if (!holidayName || !holidayDate) {
      return NextResponse.json(
        { error: "Holiday name and holiday date are required." },
        { status: 400 }
      );
    }

    // Create a new holiday document with the order set to the current count
    const newHoliday = new Holiday({
      holidayName,
      holidayDate: new Date(holidayDate), // Ensure date is in the correct format
      description,
    });

    // Save the holiday to the database
    await newHoliday.save();

    // Return a success response with the created holiday
    return NextResponse.json(newHoliday, { status: 201 });
  } catch (error: unknown) {
    // Handle errors
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

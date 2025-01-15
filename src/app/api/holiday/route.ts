import dbConnect from "@/lib/dbConnect";
import Holiday from "@/models/holiday.model"; // Adjust path based on your project structure
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Fetch all holidays and sort them by the `holidayDate` field in ascending order
    const holidays = await Holiday.find({}).sort({ holidayDate: 1 });

    // Return the list of holidays
    return NextResponse.json(holidays);
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

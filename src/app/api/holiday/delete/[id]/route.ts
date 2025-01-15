import { NextRequest, NextResponse } from "next/server";
import Holiday from "@/models/holiday.model"; // Adjust path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

// DELETE handler for deleting a holiday
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    // Extract the holiday id from the URL parameters
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Get the ID from the URL

    if (!id) {
      return NextResponse.json(
        { error: "Holiday ID is missing" },
        { status: 400 }
      );
    }

    // Find and delete the holiday by id
    const deletedHoliday = await Holiday.findByIdAndDelete(id);

    if (!deletedHoliday) {
      return NextResponse.json({ error: "Holiday not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Holiday deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

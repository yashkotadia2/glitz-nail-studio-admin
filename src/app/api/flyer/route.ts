import { NextResponse } from "next/server";
import Flyer from "@/models/flyer.model"; // MongoDB Flyer model
import dbConnect from "@/lib/dbConnect"; // Ensure database connection

export async function GET() {
  try {
    // Ensure MongoDB is connected
    await dbConnect();

    // Fetch all flyers from the MongoDB Flyer collection
    const flyers = await Flyer.find().sort({ uploadDate: -1 }); // Optional: Sort by uploadDate descending

    // Return the list of flyers as JSON
    return NextResponse.json(flyers);
  } catch (error) {
    console.error("Error fetching flyers:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

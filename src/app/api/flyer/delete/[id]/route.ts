import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server"; // Server-side Uploadthing function
import Flyer from "@/models/flyer.model"; // MongoDB Flyer model
import dbConnect from "@/lib/dbConnect"; // Ensure database connection

// Initialize UTApi with your Uploadthing API token
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

export async function DELETE(req: NextRequest) {
  try {
    // Ensure MongoDB is connected
    await dbConnect();

    // Extract the menu id from the URL parameters
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Get the ID from the URL

    // Validate the provided MongoDB ID
    if (!id) {
      return NextResponse.json({ error: "No ID provided" }, { status: 400 });
    }

    // Find the flyer document by its MongoDB ID
    const flyer = await Flyer.findById(id);

    if (!flyer) {
      return NextResponse.json({ error: "Flyer not found" }, { status: 404 });
    }

    // Extract fileKey from the found flyer
    const { fileKey } = flyer;

    // Use Uploadthing to delete the file (passing an array of keys)
    const deleteResponse = await utapi.deleteFiles([fileKey]);

    if (!deleteResponse?.success || deleteResponse?.deletedCount === 0) {
      return NextResponse.json(
        { error: "Failed to delete file from Uploadthing" },
        { status: 500 }
      );
    }

    // Once the file is deleted from Uploadthing, delete the flyer from MongoDB
    await Flyer.deleteOne({ _id: id });

    // Return a successful response
    return NextResponse.json({
      success: true,
      message: "Flyer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting flyer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

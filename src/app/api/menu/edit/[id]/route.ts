import { NextRequest, NextResponse } from "next/server";
import Menu from "@/models/menu.model"; // Adjust path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

// PUT handler for updating a menu item
export async function PUT(req: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    // Extract the menu id from the URL parameters
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Get the ID from the URL

    if (!id) {
      return NextResponse.json(
        { error: "Menu ID is missing" },
        { status: 400 }
      );
    }

    // Parse the updated data from the request body
    const updatedData = await req.json();

    // Find and update the menu item by id
    const updatedMenu = await Menu.findByIdAndUpdate(id, updatedData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure validation rules are applied
    });

    if (!updatedMenu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Menu updated successfully",
        data: updatedMenu,
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

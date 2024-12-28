import { NextResponse } from "next/server";
import Menu from "@/models/menu.model"; // Adjust path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect(); // Connect to the database

    const { id } = params; // Extract the menu id from the route

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

import { NextRequest, NextResponse } from "next/server";
import Menu from "@/models/menu.model"; // Adjust path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

// DELETE handler for deleting a menu item
export async function DELETE(req: NextRequest) {
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

    // Find and delete the menu item by id
    const deletedMenu = await Menu.findByIdAndDelete(id);

    if (!deletedMenu) {
      return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, message: "Menu deleted successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

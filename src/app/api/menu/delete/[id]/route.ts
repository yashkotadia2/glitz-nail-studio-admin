// app/api/menu/[id]/route.ts
import { NextResponse } from "next/server";
import Menu from "@/models/menu.model"; // Adjust path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect(); // Connect to the database

    const { id } = params; // Extract the menu id from the route

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

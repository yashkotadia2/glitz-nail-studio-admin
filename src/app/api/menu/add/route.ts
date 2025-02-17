import { NextResponse } from "next/server";
import Menu from "@/models/menu.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

export async function POST(req: Request) {
  try {
    await dbConnect(); // Connect to the database

    const body = await req.json(); // Get the request body

    const { menuName, menuPrice, menuCategory, menuDescription, duration } =
      body;

    // Validate required fields
    if (!menuName || !menuPrice || !menuCategory || !duration) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Count the current number of documents in the Menu collection
    const currentCount = await Menu.countDocuments();

    // Create a new menu document with the order set to the current count
    const newMenu = new Menu({
      menuName,
      menuPrice,
      menuCategory,
      menuDescription,
      order: currentCount, // Set order to the count of existing rows
      duration,
    });

    // Save to the database
    await newMenu.save();

    // Return the response with the newly created menu item
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

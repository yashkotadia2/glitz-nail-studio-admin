// app/api/menu/route.ts
import { NextResponse } from "next/server";
import Menu from "@/models/menu.model"; // Adjust the path based on your project structure
import dbConnect from "@/lib/dbConnect"; // Assuming you have a DB connection utility

export async function POST(req: Request) {
  try {
    await dbConnect(); // Connect to the database

    const body = await req.json(); // Get the request body

    const { menuName, menuPrice, menuCategory, menuDescription } = body;

    // Validate required fields
    if (!menuName || !menuPrice || !menuCategory) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Create a new menu document
    const newMenu = new Menu({
      menuName,
      menuPrice,
      menuCategory,
      menuDescription,
    });

    await newMenu.save(); // Save to the database

    return NextResponse.json({ success: true, data: newMenu }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}

import dbConnect from "@/lib/dbConnect";
import Menu from "@/models/menu.model";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  await dbConnect();

  try {
    // Parse the incoming request payload (new order of menu items)
    const { newOrder } = await req.json();

    // Validate the newOrder payload (should be a non-empty array of IDs)
    if (!Array.isArray(newOrder) || newOrder.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload. 'newOrder' must be a non-empty array." },
        { status: 400 }
      );
    }

    // Use Promise.all to update the `order` field concurrently
    await Promise.all(
      newOrder.map((menuItemId: string, index: number) =>
        Menu.findByIdAndUpdate(menuItemId, { order: index }, { new: true })
      )
    );

    // Return a success response (no need to return menu items here)
    return NextResponse.json({
      message: "Menu reordered successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      },
      { status: 500 }
    );
  }
}

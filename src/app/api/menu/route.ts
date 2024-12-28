import dbConnect from "@/lib/dbConnect";
import Menu from "@/models/menu.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    const menuItems = await Menu.find({});
    return NextResponse.json(menuItems);
  } catch (error: unknown) {
    return NextResponse.json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
}
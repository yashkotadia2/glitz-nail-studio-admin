import { NextResponse } from "next/server";

// GET handler to return start and end times from environment variables
export async function GET() {
  const startTime = process.env.START_TIME || "12:00";
  const endTime = process.env.END_TIME || "5:00";

  return NextResponse.json({ startTime, endTime });
}

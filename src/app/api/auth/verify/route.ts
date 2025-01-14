import { NextResponse } from "next/server";

// Get the stored code from environment variables
const storedCode = process.env.ACCESS_CODE;

export async function POST(req: Request) {
  try {
    // Parse the request body to get the code
    const { code } = await req.json();

    // Validate that the code is present
    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    // Verify the code with the stored environment variable code
    if (code.toString() === storedCode) {
      // If the code matches, return authenticated response
      return NextResponse.json({ authenticated: true }, { status: 200 });
    } else {
      // If the code does not match, return unauthorized response
      return NextResponse.json(
        { authenticated: false, error: "Invalid code" },
        { status: 401 }
      );
    }
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}

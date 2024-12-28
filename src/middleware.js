import { NextResponse } from "next/server";

export function middleware(req) {
  const res = NextResponse.next();

  res.headers.set("Access-Control-Allow-Origin", "*"); // or specific origin

  // Handle OPTIONS method (preflight request)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204 });
  }

  return res;
}

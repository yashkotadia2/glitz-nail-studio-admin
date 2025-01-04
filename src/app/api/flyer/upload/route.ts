import { NextRequest, NextResponse } from "next/server";
import { UTApi, UTFile } from "uploadthing/server"; // Server-side uploadthing function
import Flyer from "@/models/flyer.model"; // MongoDB Flyer model
import { v4 as uuidv4 } from "uuid";
import dbConnect from "@/lib/dbConnect";

// Initialize UTApi with your Uploadthing API token
const utapi = new UTApi({ token: process.env.UPLOADTHING_TOKEN });

console.log("UPLOADTHING_TOKEN:", process.env.UPLOADTHING_TOKEN);

export async function PUT(req: NextRequest) {
  try {
    await dbConnect(); // Connect to the database

    // Extract form data from the request
    const data = await req.formData();
    const file = data.get("file"); // Get the file from the formData

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Convert Blob to ArrayBuffer for Uploadthing upload
    const buffer = await file.arrayBuffer();
    const fileName = `${uuidv4()}_${file.name}`;

    // Create a UTFile instance with the file buffer
    const utFile = new UTFile([Buffer.from(buffer)], fileName);

    // Upload to Uploadthing
    const uploadResult = await utapi.uploadFiles([utFile]);

    if (uploadResult?.length && uploadResult[0].data) {
      const uploadedFileUrl = uploadResult[0].data?.url;
      const uploadedFileKey = uploadResult[0].data?.key;

      const newFlyer = new Flyer({
        fileName: file.name,
        fileUrl: uploadedFileUrl,
        fileKey: uploadedFileKey,
        uploadDate: new Date(),
      });

      await newFlyer.save();

      // Return a successful response with the file URL
      return NextResponse.json({ success: true, url: uploadedFileUrl });
    }

    // If the upload fails, return an error response
    return NextResponse.json({ error: "File upload failed" }, { status: 500 });
  } catch (error) {
    console.error("File upload error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

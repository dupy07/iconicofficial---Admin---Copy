// pages/api/uploadImages.ts

import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Files } from "formidable";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }

  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = "./public/uploads"; // Specify the directory to save uploaded files
    form.keepExtensions = true; // Keep file extensions

    form.parse(
      req,
      async (err: any, fields: formidable.Fields, files: Files) => {
        if (err) {
          throw err;
        }

        // Get the paths of the uploaded images
        const imagePaths = Object.values(files).map((file) => file.path);

        // Send the image paths back to the client
        res.status(200).json({ imagePaths });
      }
    );
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

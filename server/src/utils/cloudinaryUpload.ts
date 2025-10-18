import type { UploadApiResponse } from "cloudinary";
import fs from "fs";
import path from "path";
import { cloudinary } from "../config/cloudinary.js";

const uploadToCloudinary = async (
  filePath: string
): Promise<UploadApiResponse | null> => {
  try {
    if (!filePath) return null;

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      filePath,
      {
        folder: "assets", // Optional folder
        resource_type: "auto", // Automatically detect type
      }
    );

    return result; // ✅ return the full object, not just URL
  } catch (error) {
    throw error;
  }
};

const deleteFile = (filePath: string): void => {
  if (!filePath) return;

  fs.unlink(path.resolve(filePath), (err) => {
    if (err) console.error("Failed to delete file:", err);
  });
};

export { uploadToCloudinary, deleteFile };

import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  api_key: process.env.CLOUDINARY_API_KEY || "",
  api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

/**
 * Uploads a local file to Cloudinary.
 * Returns the secure HTTPS URL, or null if Cloudinary is not configured or upload fails.
 */
export const uploadImage = async (filePath, folder = "hadoti_farms") => {
  try {
    const isConfigured = 
      process.env.CLOUDINARY_CLOUD_NAME && 
      process.env.CLOUDINARY_API_KEY && 
      process.env.CLOUDINARY_API_SECRET;

    if (!isConfigured) {
      console.warn(`⚠️ Cloudinary is not configured. Skipping upload for: ${filePath}`);
      return null;
    }

    console.log(`☁️ Uploading to Cloudinary: ${filePath}...`);
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: true,
    });
    
    console.log(`✅ Uploaded successfully: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Cloudinary upload error for ${filePath}: ${error.message}`);
    return null;
  }
};

export default cloudinary;

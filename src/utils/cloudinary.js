import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
}) // Configure cloudinary with the credentials from the .env file 

const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
      // upload the file on cloudinary
      const response = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto"
      })
      // file uploaded successfully
      // console.log('File uploaded successfully', response.url);
      fs.unlinkSync(localFilePath); // Delete the file from the local storage as it was uploaded to cloudinary
      return response.url;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Delete the file from the local storage as it was not uploaded to cloudinary
    console.error('Error uploading file to cloudinary', error);
    return null;
  }
}

export { uploadToCloudinary };
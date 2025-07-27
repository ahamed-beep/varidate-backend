import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';
import fs from 'fs';
import path from 'path';

cloudinary.config({
    cloud_name:"ddhxxqkpc",
    api_key:"348865793139396",
    api_secret:"dejjibdMXTj3HaT5jmFCm3f2spc"
});


const uploadFromBuffer = (buffer, folder, resourceType = 'auto') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder,
        resource_type: resourceType,
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (result) {
          resolve({
            url: result.secure_url,
            public_id: result.public_id
          });
        } else {
          reject(error);
        }
      }
    );
    
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const uploadToCloudinary = async (filePath, folder) => {
  try {
    if (!filePath) {
      throw new Error('No file path provided');
    }

    // Read the file into a buffer
    const buffer = fs.readFileSync(filePath);
    
    // Determine resource type based on file extension
    const extension = path.extname(filePath).toLowerCase();
    let resourceType = 'auto';
    
    if (['.pdf'].includes(extension)) {
      resourceType = 'raw';
    } else if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      resourceType = 'image';
    }

    // Upload to Cloudinary
    const result = await uploadFromBuffer(buffer, folder, resourceType);
    
    // Clean up the temporary file
    fs.unlinkSync(filePath);
    
    return result.url;
  } catch (error) {
    // Clean up the temporary file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

export default uploadToCloudinary;
// Import Cloudinary and Cloudinary storage module for Multer
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// Configure Cloudinary with credentials from environment variables
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

// Set up Cloudinary storage with Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wanderlust_DEV',// Folder in Cloudinary where files will be stored
      allowerdFormats: ["png",'jpg',"jpeg"],// Allowed file formats
    },
  });

// Export Cloudinary and storage configurations
module.exports = {
    cloudinary,
    storage,
};
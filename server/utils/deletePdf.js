const cloudinary = require('cloudinary').v2;

// Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
  });


// Delete image from cloudinary
const deletePdf = async (imageId) => {
    await cloudinary.uploader.destroy(imageId);
    return true;
}

module.exports = deletePdf;





const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const getSignature = async (req, res) => {
    console.log("get sign in api");
    const timestamp = Math.round(new Date().getTime() / 1000);
    const signature = cloudinary.utils.api_sign_request({ timestamp }, process.env.API_SECRET);
    console.log("get sign in api --");
    console.log(signature,timestamp)
    res.status(200).json({ signature, timestamp})
};

module.exports = getSignature;
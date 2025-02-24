
const cloudinary = require('cloudinary').v2;    // require cloudinary for data store in cloud
const { CloudinaryStorage } = require('multer-storage-cloudinary');


// set the secret key for our coludenry 
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,        // from .env fils set the cloude_name
    api_key: process.env.CLOUD_API_KEY,         
    api_secret: process.env.CLOUD_API_SECRET,
});


// this code take from npm 'multer-storage-cloudinary' ( usges )
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'wanderlust_DEV',
      allowerdFormats: ["png","jpg", "jpeg"],   // name of this file we wand to store like ( jpg, pdf, jpeg, video etc) on cloudinary 
 
    },
});



module.exports = {
    cloudinary,
    storage,
}
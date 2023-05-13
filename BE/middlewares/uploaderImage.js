const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage_brand = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'sneakerapp/brand'
    }
});

const storage_employee = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'sneakerapp/employee'
    }
});

const storage_product = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'sneakerapp/product'
    }
});

const storage_delivery_proof = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'sneakerapp/deliveryProof'
    }
});

const storage_review = new CloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ['jpg', 'png'],
    params: {
        folder: 'sneakerapp/review'
    }
});

exports.uploadCloudBrand = multer({ storage: storage_brand });
exports.uploadCloudEmployee = multer({ storage: storage_employee });
exports.uploadCloudProduct = multer({ storage: storage_product });
exports.uploadCloudDeliveryProof = multer({ storage: storage_delivery_proof });
exports.uploadCloudReview = multer({ storage: storage_review });
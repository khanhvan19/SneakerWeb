const mongoose = require('mongoose');

const productVersionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    images: [{
        field: {
            type: String,
            required: true,
        },
        link: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        }
    }],
    sizes: [{
        sku: { 
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            require: true,
        }
    }],
    status: {
        type: Boolean,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        require: true,
    }
}, { timestamps: true })

const ProductVersion = mongoose.model('ProductVersions', productVersionSchema)

module.exports = ProductVersion;
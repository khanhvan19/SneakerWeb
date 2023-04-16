const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    colorName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    sold: {
        type: Number,
        required: true
    },
    star: {
        type: Number,
        required: true
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
        code: {
            type: Number,
            required: true,
        },
        label: {
            type: String,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }],
    status: {
        type: Boolean,
        required: true,
    },
    sample: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductSamples'
    },
    isDeleted: {
        type: Boolean,
        require: true,
    }
}, { timestamps: true })

const Product = mongoose.model('Products', productSchema)

module.exports = Product;
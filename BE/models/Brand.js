const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    logo: {
        link: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        }
    },
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    slug: {
        type: String,
        required: true,
        maxlength: 50,
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

const Brand = mongoose.model('Brands', brandSchema)

module.exports = Brand;
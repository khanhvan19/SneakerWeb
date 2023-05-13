const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Products'
    },
    version: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductVersions'
    },
    size: {
        type: Number,
        require: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Orders'
    },
    rating: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        trim: true,
    },
    status: {
        type: String,
        required: true,
    },
    images: [{
        link: String,
        path:  String,
    }],
}, { timestamps: true })

const Review = mongoose.model('Reviews', reviewSchema)

module.exports = Review;
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CustomerAddress'
    },
    deliveryMethodId: {
        type: Number,
        required: true
    },
    deliveryMethod: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true
    },
    products: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        version: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProductVersions'
        },
        size: Number,
        quantity: Number,
        price: Number,
        discount: Number,
    }],
    total: {
        type: Number,
        required: true,
    },
    shippingFee: {
        type: Number,
        required: true,
    },
    estimatedTime: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    shipper: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees'
    },
    itinerary: [{
        title: {
            type: String,
            required: true,
        },
        time: {
            type: Date,
            required: true
        },
        caption:  String
    }],
    successProof: String
}, { timestamps: true })

const Order = mongoose.model('Orders', orderSchema)

module.exports = Order;
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
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
        size: {
            type: Number,
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
        }
    }]
}, { timestamps: true })

const Cart = mongoose.model('Carts', cartSchema)

module.exports = Cart;
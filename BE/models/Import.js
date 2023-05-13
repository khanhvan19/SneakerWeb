const mongoose = require('mongoose');

const importSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    warehouse: {
        type: String,
        required: true,
    },
    supplier: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employees'
    },
    total: {
        type: Number,
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        price: {
            type: Number,
            require: true
        },
        detail: [{
            version: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'ProductVersions',
            },
            size: {
                type: Number,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        }],
    }]
}, { timestamps: true })

const Import = mongoose.model('Imports', importSchema)

module.exports = Import;
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands'
    },
    category: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorys'
    }],
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
    sizeMin: {
        type: Number,
        required: true
    },
    sizeMax: {
        type: Number,
        required: true
    },
    gender: Array,
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        require: true,
    }
}, { 
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true},  
})

productSchema.virtual('versions', {
    ref: 'ProductVersions',
    localField: '_id',
    foreignField: 'product',
    match: { archived: false }
})

const Product = mongoose.model('Products', productSchema)

module.exports = Product;
const mongoose = require('mongoose');

const productSampleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands'
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categorys'
        }
    ],
    gender: Array,
    isDeleted: {
        type: Boolean,
        require: true,
    },
}, { 
    timestamps: true,
    toJSON: {virtuals: true},
    toObject: {virtuals: true}, 
})

productSampleSchema.virtual('products', {
    ref: 'Products',
    localField: '_id',
    foreignField: 'sample',
});

const productSample = mongoose.model('ProductSamples', productSampleSchema)

module.exports = productSample;
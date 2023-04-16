const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        require: true,
    },
    discountRate: {
        type: Number,
        min: 1,
        max: 100,
    },
    discountPrice: {
        type: Number,
        min: 1
    },
    minPriceCondition: Number,
    brandCondition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Brands'
    },
    description: {
        type: String,
        trim: true,
    },
    status: {
        type: Boolean,
        required: true,
    },
}, { timestamps: true })

const Voucher = mongoose.model('Vouchers', voucherSchema)

module.exports = Voucher;
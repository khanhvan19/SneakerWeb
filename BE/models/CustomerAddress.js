const mongoose = require('mongoose');

const customerAddressSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers'
    },
    name: {
        type: String,
        trim: true,
    },
    phone: {
        type: String,
        maxlength: 12,
    },
    province: {
        type: Number,
        required: true
    },
    district: {
        type: Number,
        required: true
    },
    ward: {
        type: String,
        required: true
    },
    addressDetail: {
        type: String,
        required: true
    },
    addressString: {
        type: String,
        required: true
    },
    isPrimary: {
        type: Boolean,
        required: true,
    },
    isDeleted: Boolean
}, { timestamps: true })

const CustomerAddress = mongoose.model('CustomerAddress', customerAddressSchema)

module.exports = CustomerAddress;
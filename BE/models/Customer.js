const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

const customerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        trim: true,
    },
    avatar: {
        link: String,
        path: String,
    },
    phone: {
        type: String,
        maxlength: 12,
    },
    sex: {
        type: String,
        maxlength: 5,
    },
    birthday: Date,
    status: {
        type: Boolean,
        required: true
    },
    favorites: Array
}, { timestamps: true })

customerSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if(err) return next(err);
        else {
            this.password = hash;
            next();
        } 
    });
})

const Customer = mongoose.model('Customers', customerSchema)

module.exports = Customer;
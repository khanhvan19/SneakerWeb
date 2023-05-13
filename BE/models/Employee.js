const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const { type } = require('express/lib/response');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
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
    avatar: {
        link: String,
        path: String,
    },
    phone: {
        type: String,
        required: true,
        maxlength: 12,
    },
    sex: {
        type: String,
        required: true,
        maxlength: 5,
    },
    birthday: {
        type: Date,
        required: true,
    },
    address: {
        province: {
            type: String,
            required: true,
        },
        district: {
            type: String,
            required: true,
        },
        ward: {
            type: String,
            required: true,
        },
        addressDetail: {
            type: String,
            required: true,
        },
        addressString: String,
    },
    role: {
        type: String,
        required: true,
    },
    permissions: Object,
    status: {
        type: Boolean,
        required: true
    },
    // shipping: Boolean
}, { timestamps: true }, 
// { minimize: false },
)

employeeSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if(err) return next(err);
        else {
            this.password = hash;
            next();
        } 
    });
})

const Employee = mongoose.model('Employees', employeeSchema)

module.exports = Employee;
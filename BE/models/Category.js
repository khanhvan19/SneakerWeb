const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50,
    },
    slug: {
        type: String,
        required: true,
        maxlength: 50,
    },
    status: {
        type: Boolean,
        required: true
    }
}, { timestamps: true })

const Category = mongoose.model('Categorys', categorySchema)

module.exports = Category;
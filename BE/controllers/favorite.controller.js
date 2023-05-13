const { Types } = require("mongoose");
const Customer = require("../models/Customer");
const { count } = require("../models/Review");
const Product = require("../models/Product");

exports.toggleAddFavorite = async (req, res, next) => {
    try {
        var message = '', result = {};
        const customer = await Customer.findById(req.body.customer)
        const favorites = customer.favorites;
        if(favorites == null || !favorites.includes(req.body.product)) {
            result = await Customer.findOneAndUpdate(
                { _id: Types.ObjectId(req.body.customer)},
                { $push: {
                    favorites: req.body.product
                }},
                { new: true }
            )
            message = 'Thêm thành công sản phẩm vào Danh sách yêu thích!'
        } else {
            result = await Customer.findOneAndUpdate(
                { _id: Types.ObjectId(req.body.customer)},
                { $pull: {
                    favorites: req.body.product
                }},
                { new: true }
            )
            message = 'Xóa thành công sản phẩm khỏi Danh sách yêu thích!'
        }

        res.status(200).json({
            message: message,
            favorites: result.favorites
        })
    } catch (error) {
        next(new Error())
    }
}

exports.removeProductFavorite = async (req, res, next) => {
    try {
        
    } catch (error) {
        next(new Error())
    }
}

exports.getAllByCustomer = async (req, res, next) => {
    try {
        var result = [];
        const customer = await Customer.findById(req.query.customer)
        for (var item of customer.favorites) {
            var product = await Product.findOne({
                _id: item,
                status: true,
                isDeleted: null,
            })
            .populate({ 
                path: 'versions',  
                match: { status: true, isDeleted: null }, 
                select: 'images name', 
            })
            .populate({ path: 'brand', select: 'name' })
            .populate({ path: 'category', select: 'name' });
        
            result.push(product)
        }

        res.status(200).send(result)
    } catch (error) {
        next(new Error())
    }
}


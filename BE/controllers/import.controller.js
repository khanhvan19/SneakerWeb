const { Types } = require('mongoose');
const Import = require('../models/Import')
const Product = require('../models/Product')

exports.create = async (req, res, next) => {

    try {
        const total = req.body.products.reduce((result, product) => 
            result + (product.price * product.sizes.reduce((count, size) => 
                count + size.quantity, 0))
        , 0)
        await Import.create({ ...req.body, total: total })

        req.body.products.forEach( async (item) => {
            await Product.findByIdAndUpdate(
                item.product,
                { price: item.price },
                { new: true }
            );
            var productAggregate = await Product
                .aggregate([{ $match: { _id: Types.ObjectId(item.product) } }])
                .unwind('sizes');
            item.sizes.forEach( async (size) => {
                var productWithSize = productAggregate.find(e => e.sizes.code === size.code)
                var newQuantity = parseInt(size.quantity) + parseInt(productWithSize.sizes.quantity)
                await Product.findByIdAndUpdate(
                    item.product, 
                    { '$set': { ['sizes.$[element].quantity']: newQuantity } },
                    { 'arrayFilters': [{ 'element.code': size.code }] }
                )
            });  
        });
        res.status(200).json({
            message: "Thêm phiếu nhập hàng thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const imports = await Import.find({})
            .populate('employee')
            .populate({
                path: 'products',
                populate: {path: 'product'}
            })
        res.status(200).send(imports)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneImport = async (req, res, next) => {
    try {
        const result = await Import.findById(req.params.id)
            .populate('employee')
            .populate({
                path: 'products',
                populate: {
                    path: 'product',
                    populate: {path: 'sample'}
                }
            })
        res.status(200).json(result)
    } catch (err) {
        next(new Error())
    }
}



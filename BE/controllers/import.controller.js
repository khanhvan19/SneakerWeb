const { Types } = require('mongoose');
const Import = require('../models/Import')
const Product = require('../models/Product')
const Version = require('../models/ProductVersion')

exports.create = async (req, res, next) => {
    try {
        var total = req.body.products.reduce(
            (result, product) => result + (product.price * product.detail.reduce(
                (count, item) => count + item.quantity, 0)
            ), 0);

        await Import.create({ ...req.body, total: total })

        req.body.products.forEach( async (element) => {
            await Product.findByIdAndUpdate(
                element.product,
                { price: element.price },
                { new: true }
            );
            element.detail.forEach( async (item) => {
                var versionAggregate = await Version
                    .aggregate([{ $match: { _id: Types.ObjectId(item.version) } }])
                    .unwind('sizes');
                var versionWithSize = versionAggregate.find(e => e.sizes.sku === item.size)
                var newQuantity = parseInt(item.quantity) + parseInt(versionWithSize.sizes.quantity)
                await Version.findByIdAndUpdate(
                    item.version, 
                    { '$set': { ['sizes.$[element].quantity']: newQuantity } },
                    { 'arrayFilters': [{ 'element.sku': item.size }] }
                )
            })
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
        const imports = await Import.find({}).populate('employee')
        res.status(200).send(imports)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneImport = async (req, res, next) => {
    try {
        const result = await Import.findById(req.params.id)
            .populate({ path: 'employee',  select: 'name role' })
            .populate({ 
                path: 'products', 
                populate: { path: 'product', select: 'name' } 
            })
            .populate({
                path: 'products', 
                populate: {
                    path: 'detail', 
                    populate: { path: 'version', select: 'name' }
                } 
            })
        res.status(200).json(result)
    } catch (err) {
        next(new Error())
    }
}



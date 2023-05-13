const { Types } = require('mongoose');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const ProductVersion = require('../models/ProductVersion');
const Product = require('../models/Product');
const Employee = require('../models/Employee');
const NotFoundError = require('../error/NotFoundError');
const Review = require('../models/Review');

exports.createOneOrder = async (req, res, next) => {
    try {
        var message = "";
        const cart = await Cart.findOne({ 
            customer: req.body.customer 
        })
        .populate({ 
            path: 'products', 
            populate: { path: '_id', select: 'price discount sold' } 
        })
        .populate({ 
            path: 'products', 
            populate: { path: 'version', select: 'sizes' } 
        });

        if(cart.products.length != 0) {
            const order = await Order.create({
                ...req.body,
                products: [],
                itinerary: [{
                    title: "Đặt hàng thành công",
                    time: new Date(),
                    caption: "Đơn hàng đã được đặt thành công và chuyển cho bộ phận xác nhận đơn"
                }]
            });

            for (const element of cart.products)  {
                var inventoryQuantity = element.version.sizes.find(
                    (size) => size.sku === element.size
                ).quantity;

                if(inventoryQuantity > 0) {
                    await Order.findOneAndUpdate({
                        _id: order._id
                    }, {
                        $push: {
                            products: {
                                _id: element._id,
                                version: element.version,
                                size: element.size,
                                quantity: element.quantity,
                                price: element._id.price,
                                discount: element._id.discount,
                            }
                        }
                    });

                    await Cart.findOneAndUpdate({
                        customer: req.body.customer
                    }, {
                        $pull: { 
                            products: {
                                _id: element._id,
                                version: element.version,
                                size: element.size,
                            }
                        }
                    });

                    const versionBySize = await ProductVersion.aggregate([{
                        $match: { 
                            _id : Types.ObjectId(element.version) 
                        }
                    }]).unwind('sizes')
                    const currentSize = versionBySize.filter(
                        e => e.sizes.sku === element.size
                    )[0];
                    const newCount = parseInt(currentSize.sizes.quantity) - parseInt(element.quantity);
                
                    await ProductVersion.findByIdAndUpdate(element.version._id, {
                        "$set": {
                            ["sizes.$[item].quantity"]: newCount
                        }
                    }, {
                        "arrayFilters": [{
                            "item.sku": element.size
                        }]
                    })
                    const newSold = parseInt(element._id.sold) + parseInt(element.quantity);
                    await Product.findByIdAndUpdate(element._id._id, {sold: newSold})
                }
            }
            
            message = "Thêm đơn hàng thành công!"
        } else {
            req.status(200).json({ 
                warning: "Rất tiếc, Không thể thêm đơn hàng!"
            })
            return;
        }

        res.status(200).json({ 
            message: message,
        });
    } catch (err) {
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('customer')
            .populate('address')
            .populate({ 
                path: 'products', 
                populate: { path: '_id', select: 'name' } 
            })
            .populate({ 
                path: 'products', 
                populate: { path: 'version', select: 'name' } 
            })

        res.status(200).send(orders)
    } catch (err) {
        next(new Error())
    }
}

exports.getOrderByCustomer = async (req, res, next) => {
    try {
        const orders = await Order.find({
            customer: Types.ObjectId(req.query.customer)
        })
        .populate({ 
            path: 'products', 
            populate: { path: '_id', select: 'name price discount status isDeleted' } 
        })
        .populate({ 
            path: 'products', 
            populate: { path: 'version', select: 'name images sizes status isDeleted' } 
        })
        .sort({ createdAt: 'desc' })

        res.status(200).send(orders)
    } catch (error) {
        next(new Error())
    }   
}

exports.getDeliveryOrderByShipper = async (req, res, next) => {
    try {
        const orders = await Order.aggregate([
            {$match: { 
                $and: [
                    { shipper: { $eq: Types.ObjectId(req.query.shipper) } },
                    { status: { $eq: 'delivery' } },
                    { successProof : { $in: [null, ''] } }
                ]   
            }},
            {$lookup: {
                from: 'customeraddresses',
                localField: 'address',
                foreignField: '_id',
                as: 'address'
            }},
            {$sort: { 
                "createdAt": -1,
            }}
        ]).unwind('address')

        res.status(200).send(orders)
    } catch (error) {
        next(new Error())
    }   
}

exports.getSuccessOrderByShipper = async (req, res, next) => {
    try {
        const orders = await Order.aggregate([
            {$match: { 
                $and: [
                    { shipper: { $eq: Types.ObjectId(req.query.shipper) } },
                    { status: { $in: ['delivery', 'success'] } },
                    { successProof : { $nin: [null, ''] } }
                ]   
            }},
            {$lookup: {
                from: 'customeraddresses',
                localField: 'address',
                foreignField: '_id',
                as: 'address'
            }},
            {$addFields: {
                "successTime": { $last: "$itinerary.time" }
            }},
            {$sort: { 
                "successTime": -1,
            }}
        ]).unwind('address');

        res.status(200).send(orders)
    } catch (error) {
        next(new Error())
    }   
}

exports.getOneOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('customer')
            .populate('address')
            .populate('shipper')
            .populate({ 
                path: 'products', 
                populate: { path: '_id',  select: 'name price discount status isDeleted' } 
            })
            .populate({ 
                path: 'products', 
                populate: { path: 'version', select: 'name images sizes status isDeleted' } 
            });
        
        var products = [];
        for (let i = 0; i < order.products.length; i++) {
            var item = order.products[i]
            var reviewData = await Review.findOne({
                product: Types.ObjectId(item._id._id),
                customer: Types.ObjectId(order.customer._id),
                order: Types.ObjectId(order._id),
                version: Types.ObjectId(item.version._id),
                size: item.size,
            }) 

            products[i] = {...item._doc, review: reviewData};
        }

        const result = {...order._doc, products: products}
        res.status(200).send(result);
        
    } catch (error) {
        next(new Error())
    }
}

exports.updateStatusOrder = async (req, res, next) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json({
            message: 'Xác nhận đã xử lý đơn hàng thành công!'
        })
    } catch (err) {
        next(new Error())
    }
}

exports.comfirmSuccessOrder = async (req, res, next) => {
    try {
        await Order.findByIdAndUpdate(req.params.id, {status: 'success'})
        res.status(200).json({
            message: 'Thành công! Đơn hàng đã hoàn tất.'
        })
    } catch (err) {
        next(new Error())
    }
}

exports.confirmOneOrder = async (req, res, next) => {
    try {
        await Order.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                status: 'delivery',
                shipper: req.body.shipper,
            },
            $push: {
                itinerary: {
                    title: "Hoàn tất đóng gói",
                    time: new Date(),
                    caption: 'Kiện hàng đã hoàn tất đóng gói và sẵn sàng cho quá trình vận chuyển'
                }
            }
        })
        
        res.status(200).json({
            message: 'Xác nhận đã xử lý đơn hàng thành công!'
        })
    } catch (err) {
        next(new Error())
    }
}

exports.cancelOneOrder = async (req, res, next) => {
    try {
        const order = await Order.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                status: 'cancel',
            },
            $push: {
                itinerary: {
                    title: "Đơn hàng đã bị hủy",
                    time: new Date(),
                    caption: `Lý do hủy: ${req.body.partian} - ${req.body.reason}`
                }
            }
        }, {
            new: true
        })

        for (const element of order.products) {
            const versionsBySize = await ProductVersion.aggregate([{
                $match: {
                    _id : Types.ObjectId(element.version)
                }
            }]).unwind('sizes')
            const currentSize = versionsBySize.filter(
                e => e.sizes.sku === element.size
            )[0]
            const newCount = parseInt(currentSize.sizes.quantity) + parseInt(element.quantity);
            await ProductVersion.findByIdAndUpdate(element.version, {
                "$set": {
                    ["sizes.$[item].quantity"]: newCount
                }
            }, {
                "arrayFilters": [{
                    "item.sku": element.size
                }]
            })

            const currentProduct = await Product.findById(element._id).select('sold')
            const newSold = parseInt(currentProduct.sold) - parseInt(element.quantity)
            await Product.findByIdAndUpdate(element._id, { sold: newSold })
        }

        res.status(200).json({
            message: 'Hoàn tất! Đơn hàng đã bị hủy'
        })
    } catch (error) {
        next(new Error())
    }
}

exports.updateItineraryOrder = async (req, res, next) => {
    const fileData = req.file;

    try {
        if(req.body.title === 'Giao hàng thành công' && fileData === undefined) {
            return next(new NotFoundError("Vui lòng cung cấp hình ảnh bằng chứng giao hàng thành công!"));
        } else {
            req.body.proof = fileData?.path;
        }

        await Order.findOneAndUpdate({
            _id: req.params.id
        }, {
            $set: {
                successProof: req.body.proof || '',
            },
            $push: {
                itinerary: {
                    title: req.body.title,
                    time: new Date(),
                    caption: req.body.caption
                }
            }
        })

        res.status(200).json({
            message: 'Cập nhật hành trình thành công!'
        })
    } catch (error) {
        next(new Error('Cập nhật hành trình thất bại!'))
    }
}
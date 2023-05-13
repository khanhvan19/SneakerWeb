const { Types } = require('mongoose')
const Cart = require('../models/Cart')
const Version = require('../models/ProductVersion')


exports.addToCart = async (req, res, next) => {
    try {
        const cartOfCustomer = await Cart.findOne({
            customer: req.body.customer,
        })
        if(cartOfCustomer == null) {
            await Cart.create({
                customer: req.body.customer,
                products: [{
                    _id: req.body.product,
                    version: req.body.version,
                    size: req.body.size,
                    quantity: req.body.quantity,
                }]
            })
        } else {
            const productOfCart = await Cart.aggregate([
                {$unwind: '$products'},
                {$match: { 
                    $expr: {
                        $and: [
                            { $eq:["$customer", Types.ObjectId(req.body.customer)] },
                            { $eq:["$products._id", Types.ObjectId(req.body.product)] },
                            { $eq:["$products.version", Types.ObjectId(req.body.version)] },
                            { $eq:["$products.size", req.body.size] },
                        ]
                    }
                }}
            ]);

            if(productOfCart.length == 0) {
                await Cart.findOneAndUpdate(
                    { customer: req.body.customer },
                    { $push: {
                        products: {
                            _id: req.body.product,
                            version: req.body.version,
                            size: req.body.size,
                            quantity: req.body.quantity
                        }
                    }}
                )
            } else {
                const productCurrent = productOfCart.filter(element => 
                    element.products._id == req.body.product
                    && element.products.version == req.body.version
                    && element.products.size == req.body.size
                )[0]

                const count = parseInt(req.body.quantity) + parseInt(productCurrent.products.quantity);

                const version = await Version.aggregate([{
                    $match: { _id: Types.ObjectId(req.body.version) }
                }]).unwind('sizes');
                const currentVersion = version.find(element => element.sizes.sku == req.body.size)
                
                if( count > currentVersion.sizes.quantity) {
                    res.status(200).json({
                        warning: `Rất tiếc! Bạn chỉ có thể đặt mua tối đa ${currentVersion.sizes.quantity} sản phẩm`
                    })
                    return;
                }
                //  else if(count <= 0) {
                //     this.RemoveFromCart(req, res, next)
                // }

                await Cart.findOneAndUpdate({
                    customer: Types.ObjectId(req.body.customer)
                }, {
                    "$set": {
                        ["products.$[element].quantity"] : count
                    }
                }, {
                    "arrayFilters": [{
                        "element._id": Types.ObjectId(req.body.product),
                        "element.version": Types.ObjectId(req.body.version),
                        "element.size": req.body.size,
                    }]
                })
            }
        }

        const cart = await Cart.findOne({ customer: req.body.customer });
        const countProductOfCart = cart.products.reduce(
            (count, product) => count + product.quantity, 0
        );

        res.status(200).json({
            count: countProductOfCart,
            message: 'Thêm giỏ hàng thành công!'
        })
    } catch (error) {
        next(new Error())
    }
}

exports.updateQuantity = async (req, res, next) => {
    try {
        await Cart.findOneAndUpdate({
            customer: Types.ObjectId(req.body.customer)
        }, {
            "$set": {
                ["products.$[element].quantity"] : req.body.quantity
            }
        }, {
            "arrayFilters": [{
                "element._id": Types.ObjectId(req.body.product),
                "element.version": Types.ObjectId(req.body.version),
                "element.size": req.body.size,
            }]
        })

        res.status(200).json({
            message: 'Cập nhật giỏ hàng thành công!'
        })
    } catch (error) {
        next(new Error())
    }
}

exports.getCartByUser = async (req, res, next) => {
    try {
        var total = 0;
        var inventory = [];
        var inventoryCount = 0
        var soldout = [];

        const cart = await Cart.findOne({
            customer: Types.ObjectId(req.query.customer)
        })
        .populate('customer')
        .populate({ 
            path: 'products', 
            populate: { path: '_id', select: 'name price discount' } 
        })
        .populate({ 
            path: 'products', 
            populate: { path: 'version', select: 'name images sizes' } 
        })

        const count = cart.products.reduce(
            (count, product) => count + product.quantity, 0
        );

        cart.products.forEach(product => {
            var inventoryQuantity = product.version.sizes.find(
                (size) => size.sku === product.size
            ).quantity;
            if(inventoryQuantity > 0) {
                inventory.push({
                    ...product._doc, 
                    inventoryQuantity: inventoryQuantity
                })
            } else {
                soldout.push(product)
            } 
        })

        inventory.forEach(product => {
            var discountPrice = product._id.price - 
                (product._id.price * (product._id.discount / 100));

            total += discountPrice * product.quantity;
            inventoryCount += product.quantity;
        })

        res.status(200).json({ 
            count: count,
            total: total,
            inventory: inventory,
            inventoryCount: inventoryCount,
            soldout: soldout, 
        })
    } catch (error) {
        next(new Error());
    }
}

exports.deleteProduct = async (req, res, next) => {
    try {
        const rs = await Cart.findOneAndUpdate({
            customer: Types.ObjectId(req.body.customer)
        }, {
            $pull: {
                products: {
                    _id: Types.ObjectId(req.body.product),
                    version: Types.ObjectId(req.body.version),
                    size: req.body.size,
                }
            }
        })
        
        const cart = await Cart.findOne({ customer: req.body.customer });
        const countProductOfCart = cart.products.reduce(
            (count, product) => count + product.quantity, 0
        );

        res.status(200).json({
            count: countProductOfCart,
            message: 'Xóa sản phẩm khỏi giỏ hàng thành công!'
        })
    } catch (error) {
        next(new Error())
    }
}


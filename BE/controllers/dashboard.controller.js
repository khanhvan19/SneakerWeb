const Customer = require("../models/Customer")
const Import = require("../models/Import")
const Order = require("../models/Order")
const Product = require("../models/Product")

const time = 1000 * 60 * 60 * 24 * 7
const oneDate = 1000 * 60 * 60 * 24

exports.getCountProduct = async (req, res, next) => {
    try {
        const count = await Product.find({ isDeleted: null }).count()
        const countInWeek = await Order.aggregate([
            {
                $match: {
                    $and: [
                        { createdAt: { $gte: new Date(new Date() - time) } },
                        { status: { $ne: 'cancel' } },
                    ]
                }
            },
            { $project: { products: 1, createdAt: 1 } },
            { $unwind: '$products' },
            {
                $group: {
                    _id: '$quantity',
                    count: { $sum: 1 }
                }
            }
        ])

        res.status(200).json({
            total: count,
            inWeek: countInWeek[0].count
        })
    } catch (error) {
        next(new Error())
    }
}

exports.getCountCustomer = async (req, res, next) => {
    try {
        const count = await Customer.find({}).count()
        const countInWeek = await Customer.find({
            createdAt: { $gte: new Date(new Date() - time) }
        }).count()
        res.status(200).json({
            total: count,
            inWeek: countInWeek
        })
    } catch (error) {
        next(new Error())
    }
}

exports.getCountOrder = async (req, res, next) => {
    try {
        const count = await Order.find({}).count()
        const countInWeek = await Order.find({
            createdAt: { $gte: new Date(new Date() - time) }
        }).count()

        const totalReveneu = await Order.aggregate([
            { $match: { status: 'success' } },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$total" }
                }
            },
        ])

        const totalWaitRevenue = await Order.aggregate([
            {
                $match: {
                    $and: [
                        { status: { $eq: 'delivery' } },
                        { successProof: { $nin: [null, ''] } }
                    ]
                }
            },
            {
                $group: {
                    _id: null,
                    count: { $sum: "$total" }
                }
            },
        ])

        res.status(200).json({
            count: { total: count, inWeek: countInWeek },
            revenue: totalReveneu[0]?.count || 0,
            waitRevenue: totalWaitRevenue[0]?.count || 0
        })
    } catch (error) {
        next(new Error())
    }
}

exports.countProductByBrand = async (req, res, next) => {
    try {
        const result = await Product.aggregate([
            { $match: { isDeleted: null } },
            {
                $group: {
                    _id: "$brand",
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'brands',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'brand'
                }
            },
            { $unwind: '$brand' },
            { $addFields: { "brandName": "$brand.name" } },
            { $project: { "brandName": 1, count: 1 } },
            { $sort: { count: -1 } }
        ])

        res.status(200).json(result)
    } catch (error) {
        next(new Error())
    }
}

exports.statisticImport = async (req, res, next) => {
    try {
        const countQuantity = await Import.aggregate([
            { $unwind: "$products" },
            {
                $addFields: {
                    "detail": "$products.detail",
                }
            },
            { $project: { "detail": 1, "createdAt": 1, "total": 1 } },
            { $unwind: "$detail" },
            {
                $group: {
                    _id: '$createdAt',
                    quantity: { $sum: "$detail.quantity" },
                    totalMoney: { $first: "$total" }
                }
            },
            {
                $project: {
                    date: { $dateToString: { date: "$_id" } },
                    quantity: 1,
                    totalMoney: 1,
                    _id: 0
                }
            },
            { $limit: 10 }
        ])

        res.status(200).send(countQuantity)
    } catch (error) {
        next(new Error())
    }
}

exports.countOrderByDate = async (req, res, next) => {
    try {
        const start = new Date(req.body.start)
        const end = new Date(req.body.end)
        let boundaries = [start]
        while (boundaries.slice(-1)[0] <= end) {
            boundaries.push(
                new Date(
                    new Date(
                        boundaries.slice(-1)[0]).getTime() 
                        + (1000 * 60 * 60 * 24 * req.body.step)
                    )
            )
        }

        const result = await Order.aggregate([
            {
                $match: {
                    $and: [
                        { status: { $ne: 'cancel' } },
                        { createdAt: { $gte: start, $lte: end } }
                    ]
                }
            },
            {
                $bucket: {
                    boundaries: boundaries,
                    groupBy: "$createdAt",
                    output: {
                        count: { $sum: 1 },
                        amount: { $sum: "$total" },
                    }
                }
            },
            {
                $densify: {
                    field: "_id",
                    range: {
                        step: req.body.step,
                        unit: "day",
                        bounds: [start, end],
                    }
                }
            },
            {
                $project: {
                    date: { $dateToString: { date: "$_id" } },
                    count: { $ifNull: ["$count", 0] },
                    totalMoney: { $ifNull: ["$amount", 0] },
                    _id: 0,
                }
            },
        ])

        res.status(200).send(result)
    } catch (error) {
        next(new Error())
    }
}

exports.potentialCustomer = async (req, res, next) => {
    try {
        const result = await Order.aggregate([
            { $match: { status: { $ne: 'cancel' } } },
            {
                $group: {
                    _id: "$customer",
                    countOrder: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'customers',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'customer' 
                }
            },
            { $unwind: "$customer" },
            { $project: { _id : 0 } }

        ])

        res.status(200).send(result)
    } catch (error) {
        next(new Error())
    }
}

exports.bestSellerProduct = async (req, res, next) => {
    try {
        const result = await Product.find({ isDeleted: null })
            .populate({ 
                path: 'versions',  
                match: { isDeleted: null }, 
                select: 'images name', 
            })
            .populate({ path: 'brand', select: 'name' })
            .sort({ sold: 'desc' })
            .limit(req.body.limit);

        res.status(200).send(result)
    } catch (error) {
        next(new Error())
    }
} 
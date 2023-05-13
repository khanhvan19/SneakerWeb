const Product = require('../models/Product')
const Brand = require('../models/Brand')
const Category = require('../models/Category')
const { Types } = require('mongoose')

exports.create = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            status: true,
            sold: 0,
            star: 0,
        }

        const result = await Product.create(data)
        res.status(200).json({
            data: result,
            message: "Thêm sản phẩm mới thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const products = await Product.find({ isDeleted: null })
            .populate({ path: 'versions', match: { isDeleted: null } })
            .populate({ path: 'brand', select: 'name' })
            .populate({ path: 'category', select: 'name' })
        res.status(200).send(products)
    } catch (err) {
        next(new Error())
    }
}

exports.getAllName = async (req, res, next) => {
    try {
        const products = await Product.find({ isDeleted: null })
            .select('name');
        res.status(200).send(products)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (err) {
        next(new Error())
    }
}

exports.updateOneProduct = async (req, res, next) => {
    try {
        await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).json({
            message: "Chỉnh sửa sản phẩm thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.deleteOneProduct = async (req, res, next) => {
    try {
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true }, 
            { new: true }
        );
        // result.images.forEach((image) => {
        //     cloudinary.uploader.destroy(image.path);
        // })
        res.status(200).json({
            message: "Xóa thành công một sản phẩm!"
        });
    } catch (error) {
        next(new Error())
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Product.findById(req.params.id)
        const result = await Product.findByIdAndUpdate(
            req.params.id,
            { status: !current.status },
            { new: true }
        )
        res.status(200).json({
            message: `Thành công! Sản phẩm đã ${(result.status === true) ? "được hiển thị" : "bị ẩn"}`
        })
    } catch (error) {
        next(new Error())
    }
}

exports.search = async (req, res, next) => {
    try {
        var result = [];
        if (req.query.q) {
            result = await Product.aggregate()
                .search({
                    index: 'productSearch',
                    compound: {
                        must: [{
                            text: {
                                query: req.query.q,
                                path: ['name', 'gender', 'brand'],
                                fuzzy: { maxEdits: 1 },
                            },
                        }],
                    },
                })
                .match({ isDeleted: null, status: true })
                .lookup({
                    from: 'brands',
                    localField: 'brand',
                    foreignField: '_id',
                    as: 'brand',
                    pipeline: [{
                        $project: { 'name': 1 }
                    }]
                })
                .lookup({
                    from: 'productversions',
                    localField: '_id',
                    foreignField: 'product',
                    as: 'versions',
                    pipeline: [{
                        $project: { 'images': 1, 'name': 1 }
                    }]
                })
        }
        res.status(200).send(result)
    } catch (err) {
        next(new Error())
    }
}

exports.getOnePage = async (req, res, next) => {
    try {
        var sort = req.body.sort.split(":");
        var skip = (req.body.page - 1) * req.body.limit;

        const params = {...req.body, status: true, isDeleted: null}
        
        if(params.star) params.star = { $gte: params.star }
        if(params.size) {
            params.sizeMin = { $lte: params.size }
            params.sizeMax = { $gte: params.size }
        } 
        if(params.priceMin && params.priceMax) {
            params.price = { $gte: params.priceMin, $lte: params.priceMax };
        }

        const totalResult = await Product.find(params).count();
        const results = await Product.find(params)
            .populate({ 
                path: 'versions',  
                match: { status: true, isDeleted: null }, 
                select: 'images name', 
            })
            .populate({ path: 'brand', select: 'name' })
            .populate({ path: 'category', select: 'name' })
            .sort([sort])
            .skip(skip)
            .limit(req.body.limit);
            
        const brand = (params.brand) 
            ? await Brand.findById(params.brand).select('name -_id')
            : null;
        const category = (params.category)
            ? await Category.findById(params.category).select('name -_id')
            : null; 

        res.status(200).json({
            data: results,
            pagination: {
                page: req.body.page,
                limit: req.body.limit,
                total: totalResult,
            },
            category: category?.name,
            brand: brand?.name,
        });
    } catch {
        next(new Error());
    }
}

exports.getSimilarByBrand = async (req, res, next) => {
    try {
        const similar = await Product.find({ 
            status: true,
            isDeleted: null,
            brand: Types.ObjectId(req.query.brand),
            _id : { $ne: Types.ObjectId(req.query.product)}
        })
        .populate({ 
            path: 'versions',  
            match: { status: true, isDeleted: null }, 
            select: 'images name', 
        })
        .populate({ path: 'brand', select: 'name' })
        .populate({ path: 'category', select: 'name' })
        .sort({ createdAt: 'desc' })
        .limit(12);

        res.status(200).send(similar)
    } catch (error) {
        next(new Error())
    }
}

exports.getBestSeller = async (req, res, next) => {
    try {
        const similar = await Product.find({ 
            status: true,
            isDeleted: null,
            _id : { $ne: Types.ObjectId(req.query.product)}
        })
        .populate({ 
            path: 'versions',  
            match: { status: true, isDeleted: null }, 
            select: 'images name', 
        })
        .populate({ path: 'brand', select: 'name' })
        .populate({ path: 'category', select: 'name' })
        .sort({ sold: 'desc' })
        .limit(12);

        res.status(200).send(similar)
    } catch (error) {
        next(new Error())
    }
}

exports.distributeByBrand = async(req, res, next) => {
    try {
        const result = await Product.aggregate([
            {$match: {
                $and: [
                    { isDeleted: null },
                    { status: true }
                ]
            }},
            {$sort: { sold: -1 }},
            {$lookup: {
                from: 'productversions',
                localField: '_id',
                foreignField: 'product',
                as: 'versions'
            }},
            {$group: {
                _id: "$brand",
                products: {
                    $push: "$$ROOT"
                },
            }},
            {$lookup: {
                from: 'brands',
                localField: '_id',
                foreignField: '_id',
                as: 'brand'
            }},
            {$unwind: "$brand"},
            {$addFields : {"brandName": "$brand.name"}},
            {$project: { 
                brandName: 1, 
                products: { $slice: [ "$products", 10 ] }, 
                _id: 0
            }}
        ])
        
        res.status(200).send(result)
    } catch (error) {
        next(new Error());
    }
}
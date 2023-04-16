const { pipeline } = require('nodemailer/lib/xoauth2');
const Sample = require('../models/ProductSample')
const cloudinary = require('cloudinary').v2;

exports.create = async (req, res, next) => {
    try {
        await Sample.create({
            ...req.body,
            status: true,
        })
        res.status(200).json({
            message: "Thêm mẫu sản phẩm thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const samples = await Sample.find({ isDeleted: null })
            .populate({
                path: 'products', 
                match: { isDeleted: null } 
            })
            .populate({ path: 'brand', select: 'name' })
            .populate({ path: 'category', select: 'name' });

        res.status(200).send(samples)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneSample = async (req, res, next) => {
    try {
        const sample = await Sample.findById(req.params.id)
        res.status(200).send(sample)
    } catch (err) {
        next(new Error())
    }
}

exports.updateOneSample = async (req, res, next) => {
    try {
        await Sample.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        )
        res.status(200).json({
            message: "Chỉnh sửa mẩu sản phẩm thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.deleteOneSample = async (req, res, next) => {
    try {
        await Sample.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true },
            { new: true }
        );
        res.status(200).json({
            message: "Xóa thành công một mẩu sản phẩm!"
        });
    } catch (error) {
        next(new Error())
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Sample.findById(req.params.id)
        const result = await Sample.findByIdAndUpdate(
            req.params.id,
            { status: !current.status },
            { new: true }
        )
        res.status(200).json({
            message: `Thành công! mẩu sản phẩm đã ${(result.status === true) ? "được hiển thị" : "bị ẩn"}`
        })
    } catch (error) {
        next(new Error())
    }
}

exports.search = async (req, res, next) => {
    try {
        var result = [];
        if (req.query.q) {
            result = await Sample.aggregate()
                .search({
                    index: 'customerSearchProducts',
                    compound: {
                        must: [{
                            text: {
                                query: req.query.q,
                                path: ['name', 'gender'],
                                fuzzy: { maxEdits: 1 },
                            },
                        }],
                    }
                })
                .match({ isDeleted: null })
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
                    from: 'products',
                    localField: '_id',
                    foreignField: 'sample',
                    as: 'products',
                    pipeline: [{
                        $project: { 'images': 1, 'colorName': 1 }
                    }]
                })
        }
        var newResult = [];
        result.forEach((sample) => {
            var images = [];
            if(sample.products) {
                sample.products.forEach((product, i) => {
                    images.push(product.images[0].link)
                })
            }
            newResult.push({...sample, images: images})
        })
        res.status(200).send(newResult)
    } catch (err) {
        next(new Error())
    }
}

exports.getOnePage = async (req, res, next) => {
    try {
        var skip = (req.body.page - 1) * req.body.limit;
        const params = {...req.body, status: true, isDeleted: null}
        
        const totalResult = await Sample.find(params).count();
        const results = await Sample.find(params)
            .populate({
                path: 'products', 
                match: { status: true, isDeleted: null },
            })
            .populate({ path: 'brand', select: 'name' })
            .populate({ path: 'category', select: 'name' })
            .skip(skip)
            .limit(req.body.limit);

        res.status(200).json({
            data: results,
            pagination: {
                page: req.body.page,
                limit: req.body.limit,
                total: totalResult,
            },
        });
    } catch {
        next(new Error());
    }
}
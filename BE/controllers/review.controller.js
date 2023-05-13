const { Types } = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const cloudinary = require('cloudinary').v2;

exports.create = async (req, res, next) => {
    const fileData = req.files;
    try {
        var images = [];
        if (fileData !== undefined) {
            for (let file of fileData) {
                images.push({
                    link: file.path,
                    path: file.filename,
                })
            }
        };

        await Review.create({ ...req.body, images: images, status: 'new' })
        res.status(200).json({ message: 'Gửi đánh giá thành công!' })

    } catch (err) {
        if (fileData !== undefined) {
            for (let file of fileData) {
                await cloudinary.uploader.destroy(file.filename);
            }
        };
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const reviews = await Review.find({})
            .populate({ path: 'product', select: 'name' })
            .populate({ path: 'version', select: 'images name' })
            .populate({ path: 'customer', select: 'name email' })
        res.status(200).send(reviews);
    } catch (err) {
        next(new Error())
    }
}

exports.getOverviewByProduct = async (req, res, next) => {
    try {
        const levels = [5, 4, 3, 2, 1];
        const params = {
            product: Types.ObjectId(req.params.id), 
            status: 'allow'
        }

        const total = await Review.find(params).count();
        const totalByLevels = await Review.aggregate([
            {$match: {
                $and: [
                    { status: 'allow' },
                    { product: Types.ObjectId(req.params.id) } 
                ]  
            }},
            {$group: {
                _id: "$rating",
                count: { $sum: 1 }
            }},
            {$sort: { _id: 1 }}
        ]);

        for (let level = 1; level <= 5; level++) {
            const isExist = totalByLevels.find(e => e._id === level);
            if(!isExist) totalByLevels.splice(level - 1, 0, { _id: level, count: 0 }); 
        }

        res.status(200).json({
            total: total,
            totalByLevels: totalByLevels.reverse()
        })
    } catch (error) {
        next(new Error())
    }
}

exports.getReviewsByProduct = async (req, res, next) => {
    try {
        var skip = (req.body.page - 1) * req.body.limit;

        const params = {
            ...req.body, 
            product: Types.ObjectId(req.params.id), 
            status: 'allow'
        }

        if(params.content) params.content = { $nin: [null, ''] }
        if(params.images) params.images = { $exists: true, $type: 'array', $ne: [] }
        if(params.star.length != 0) params.rating = { $in: params.star };
        else delete params.star;
 
        const totalResult = await Review.find(params).count();
        const result = await Review.find(params)
            .populate({ path: 'customer', select: 'name avatar' })
            .populate({ path: 'version', select: 'name' })
            .sort('-createdAt')
            .skip(skip)
            .limit(req.body.limit);

        res.status(200).json({
            data: result,
            pagination: {
                page: req.body.page,
                limit: req.body.limit,
                total: totalResult,
            }
        })
    } catch (error) {
        next(new Error())
    }
}

exports.getReviewsByCustomer = async (req, res, next) => {
    const fileData = req.file;

    try {

    } catch (err) {
        if (fileData) cloudinary.uploader.destroy(fileData?.filename);
        next(new Error())
    }
}

exports.changeStatus = async (req, res, next) => {
    try {
        const review = await Review.findByIdAndUpdate(req.params.id, {
            status: req.body.status
        }, { new: true })

        const avgRating = await Review.aggregate([
            {$match: {
                $and: [
                    { status: 'allow' },
                    { product: Types.ObjectId(review.product) } 
                ]  
            }},
            {$group: {
                _id: "$product",
                avg: { $avg: "$rating" }
            }},
        ])

        if(avgRating.length != 0) {
            await Product.findByIdAndUpdate(
                review.product,
                { star: parseFloat(avgRating[0].avg.toFixed(1)) }
            )
        } else {
            await Product.findByIdAndUpdate(
                review.product,
                { star: 0 }
            )
        }

        res.status(200).json({ message: 'Cập nhật thành công' })
    } catch (error) {
        next(new Error())
    }
}
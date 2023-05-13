const { Types } = require('mongoose');
const Product = require('../models/Product')
const Version = require('../models/ProductVersion')
const cloudinary = require('cloudinary').v2;

exports.create = async (req, res, next) => {
    const fileDatas = req.files;

    try {
        var images = [], sizes = [];
        if(fileDatas !== undefined) {
            for (const key in fileDatas) {
                images.push({
                    field: fileDatas[key][0]?.fieldname,
                    link: fileDatas[key][0]?.path,
                    path: fileDatas[key][0]?.filename
                })
            }
        }
        const sizeRange = await Product.findById(req.body.product)
            .select('sizeMin sizeMax');
        for (let i = sizeRange.sizeMin; i <= sizeRange.sizeMax; i++) {
            sizes.push({ sku: parseInt(i), quantity: 0 })
        } 
        const data = {
            ...req.body,
            images: images,
            sizes: sizes,
            status: true,
        }

        await Version.create(data)
        res.status(200).json({
            message: "Thêm phiên bản mới thành công!"
        });
    } catch (err) {
        if(fileDatas) {
            for (const key in fileDatas) {
                cloudinary.uploader.destroy(fileDatas[key][0]?.filename);
            }
        }
        next(new Error())
    }
}

// exports.getAll = async (req, res, next) => {
//     try {
//         const products = await Product.find({ isDeleted: null })
//             .populate({ path: 'brand', select: 'name' })
//             .populate({ path: 'category', select: 'name' })
//         res.status(200).send(products)
//     } catch (err) {
//         next(new Error())
//     }
// }

exports.getOneVersion = async (req, res, next) => {
    try {
        var objImage = {}
        const version = await Version.findById(req.params.id);
        version.images.forEach(image => { objImage[image.field] = image });

        res.status(200).json({ ...version._doc, ...objImage })
    } catch (err) {
        next(new Error())
    }
}

exports.updateOneVersion = async (req, res, next) => {
    const fileDatas = req.files;
    try {
        const imagesKey = Object.keys(fileDatas);
        const current = await Version.findById(req.params.id);
        imagesKey.forEach(key => {
            var image = current.images.find((image) => image.field === key);
            cloudinary.uploader.destroy(image.path);
            var idx = current.images.findIndex((image) => image.field === key);
            current.images[idx].link = fileDatas[key][0]?.path;
            current.images[idx].path = fileDatas[key][0]?.filename;
        }) 

        const data = {
            ...req.body,
            images: current.images,
        }

        await Version.findByIdAndUpdate(req.params.id, data, { new: true })
        res.status(200).json({
            message: "Chỉnh sửa phiên bản thành công!"
        });
    } catch (err) {
        if(fileDatas) {
            for (const key in fileDatas) {
                cloudinary.uploader.destroy(fileDatas[key][0]?.filename);
            }
        }
        next(new Error())
    }
}

exports.deleteOneVersion = async (req, res, next) => {
    try {
        const result = await Version.findByIdAndUpdate(
            req.params.id,
            { isDeleted: true }, 
            { new: true }
        );
        // result.images.forEach((image) => {
        //     cloudinary.uploader.destroy(image.path);
        // })
        res.status(200).json({
            message: "Xóa thành công một phiên bản!"
        });
    } catch (error) {
        next(new Error())
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Version.findById(req.params.id)
        const result = await Version.findByIdAndUpdate(
            req.params.id,
            { status: !current.status },
            { new: true }
        )
        res.status(200).json({
            message: `Thành công! Phiên bản đã ${(result.status === true) ? "được hiển thị" : "bị ẩn"}`
        })
    } catch (error) {
        next(new Error())
    }
}

exports.getVersionsByProduct = async (req, res, next) => {
    try {
        const versions = await Version.find({
            product: Types.ObjectId(req.query.product), 
            isDeleted: null,
            status: true,
        })
        .populate({ path: 'product' })
        .populate({ 
            path: 'product', 
            populate: { path: 'brand', select: 'name' }
        });
        
        res.status(200).send(versions)
    } catch (err) {
        next(new Error())
    }
}

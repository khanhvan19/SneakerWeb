const Product = require('../models/Product')
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
        for (let i = req.body.sizeMin; i <= req.body.sizeMax; i++) {
            sizes.push({ code: parseInt(i) , quantity: 0, label: `Size ${i} EU` })
        } 
        const data = {
            ...req.body,
            colorName: req.body.name,
            images: images,
            sizes: sizes,
            status: true,
            sold: 0,
            star: 0,
        }

        await Product.create(data)
        res.status(200).json({
            message: "Thêm sản phẩm mới thành công!"
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

exports.getAll = async (req, res, next) => {
    try {
        const products = await Product.find({ isDeleted: null })
            .populate({ path: 'sample', select: 'name' })
        res.status(200).send(products)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
        
        var objImage = {}
        product.images.forEach(image => { objImage[image.field] = image });

        const result = {
            ...product._doc,
            ...objImage,
            sizeMin: product.sizes[0].code,
            sizeMax: product.sizes[product.sizes.length - 1].code
        }

        res.status(200).json(result)
    } catch (err) {
        next(new Error())
    }
}

exports.updateOneProduct = async (req, res, next) => {
    const fileDatas = req.files;

    try {
        const imagesKey = Object.keys(fileDatas);
        const current = await Product.findById(req.params.id);
        imagesKey.forEach(key => {
            var image = current.images.find((image) => image.field === key);
            var idx = current.images.findIndex((image) => image.field === key);
            cloudinary.uploader.destroy(image.path);
            current.images[idx].link = fileDatas[key][0]?.path;
            current.images[idx].path = fileDatas[key][0]?.filename
        })
        
        var sizes = [];
        for (let i = req.body.sizeMin; i <= req.body.sizeMax; i++) {
            sizes.push({ code: parseInt(i) , quantity: 0, label: `Size ${i} EU` })
        } 
        const data = {
            ...req.body,
            colorName: req.body.name,
            images: current.images,
            sizes: sizes,
        }

        await Product.findByIdAndUpdate(req.params.id, data, { new: true })
        res.status(200).json({
            message: "Chỉnh sửa sản phẩm thành công!"
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
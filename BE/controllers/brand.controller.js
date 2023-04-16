const Brand = require('../models/Brand')
const cloudinary = require('cloudinary').v2;

exports.create = async (req, res, next) => {
    const fileData = req.file;

    try {
        const data = await Brand.create({
            ...req.body, 
            logo: {
                link: fileData?.path,
                path: fileData?.filename,
            },
            status: true
        });
        res.status(200).json({
            message: "Thêm thương hiệu thành công!"
        });
    } catch (err) {
        if(fileData) cloudinary.uploader.destroy(fileData?.filename);
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const brands = await Brand.find({});
        res.status(200).send(brands);
    } catch (err) {
        next(new Error())
    }
}

exports.getOneBySlug = async (req, res, next) => {
    try {
        const brand = await Brand.findOne({ slug: req.params.slug });
        res.status(200).send(brand);
    } catch (error) {
        next(new Error())
    }   
}

exports.updateOneBrand = async (req, res, next) => {
    const fileData = req.file;

    try {
        if(fileData !== undefined) {
            const current = await Brand.findById(req.params.id);
            if(current) { cloudinary.uploader.destroy(current?.logoPath) };
            req.body.logo = {
                link: fileData?.path,
                path: fileData?.filename,
            }
        } else {
            delete req.body.logo;
        }
        const data = await Brand.findByIdAndUpdate(
            req.params.id,
            { ...req.body }, 
            { new: true }
        );
        res.status(200).json({
            message: "Chỉnh sửa thương hiệu thành công!"
        });
    } catch (err) {
        if(fileData) cloudinary.uploader.destroy(fileData?.filename);
        next(new Error())
    }
}

exports.deleteOneBrand = async (req, res, next) => {
    try {
        const current = await Brand.findById(req.params.id)
        if(current) { cloudinary.uploader.destroy(current?.logoPath) };
        await Brand.findByIdAndDelete(req.params.id, {new: true});
        res.status(200).json({
            message: "Xóa thành công một thương hiệu!"
        });
    } catch (error) {
        next(new Error())
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Brand.findById(req.params.id);
        const result = await Brand.findByIdAndUpdate(
            req.params.id, 
            { status: !current.status },
            { new: true }
        )
        res.status(200).json({
            message: `Thành công! thương hiệu đã ${(result.status === true) ? "được hiển thị" : "bị ẩn"}`
        })
    } catch (error) {
        next(new Error())
    }
}
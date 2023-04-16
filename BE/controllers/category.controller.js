const Category = require('../models/Category')

exports.create = async (req, res, next) => {
    try {
        await Category.create({
            ...req.body,
            status: true,
        })
        res.status(200).json({
            message: "Thêm danh mục thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const categorys = await Category.find({});
        res.status(200).send(categorys)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneBySlug = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug });
        res.status(200).send(category);
    } catch (error) {
        next(new Error())
    }   
}

exports.updateOneCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndUpdate(
            req.params.id,
            { ...req.body },
            { new: true }
        )
        res.status(200).json({
            message: "Chỉnh sửa danh mục thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.deleteOneCategory = async (req, res, next) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Xóa thành công một danh mục!"
        });
    } catch (error) {
        next(new Error())
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Category.findById(req.params.id)
        const result = await Category.findByIdAndUpdate(
            req.params.id,
            { status: !current.status },
            {new: true}
        )
        res.status(200).json({
            message: `Thành công! danh mục đã ${(result.status === true) ? "được hiển thị" : "bị ẩn"}`
        })
    } catch (error) {
        next(new Error())
    }
}
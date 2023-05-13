const { Types } = require('mongoose');
const Voucher = require('../models/Voucher')
const cloudinary = require('cloudinary').v2;

exports.create = async (req, res, next) => {
    try {
        const data = {
            ...req.body,
            status: true,
        }
        await Voucher.create(data);
        res.status(200).json({
            message: "Thêm phiếu giảm giá thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.getAll = async (req, res, next) => {
    try {
        const vouchers = await Voucher.find({})
            .populate('brandCondition') 
        res.status(200).send(vouchers)
    } catch (err) {
        next(new Error())
    }
}

exports.getOneVoucher = async (req, res, next) => {
    try {
        const voucher = await Voucher.findById(req.params.id)
        res.status(200).send(voucher)
    } catch (err) {
        next(new Error())
    }
}

exports.updateOneVoucher = async (req, res, next) => {
    try {
        await Voucher.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true })
        res.status(200).json({
            message: "Chỉnh sửa phiếu giảm giá thành công!"
        });
    } catch (err) {
        next(new Error())
    }
}

exports.deleteOneVoucher = async (req, res, next) => {
    try {
        await Voucher.findByIdAndDelete(req.params.id, { new: true });
        res.status(200).json({
            message: "Xóa thành công một phiếu giảm giá!"
        });
    } catch (error) {
        next(new Error())
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Voucher.findById(req.params.id)
        const result = await Voucher.findByIdAndUpdate(
            req.params.id,
            { status: !current.status },
            { new: true }
        )
        res.status(200).json({
            message: `Thành công! Phiếu giảm giá đã ${(result.status === true) ? "được hiển thị" : "bị ẩn"}`
        })
    } catch (error) {
        next(new Error())
    }
}
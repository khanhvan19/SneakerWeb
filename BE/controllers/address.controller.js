const { Types } = require('mongoose');
const Address = require('../models/CustomerAddress')
const regionName = require("../utils/regionName");

exports.create = async (req, res, next) => {
    try {
        const provinceName = await regionName
            .findGHNProvinceName(req.body.province);
        const districtName = await regionName
            .findGHNDistrictName(req.body.province, req.body.district);
        const wardName = await regionName
            .findGHNWardName(req.body.district, req.body.ward);

        var data = {
            ...req.body,
            isPrimary: false,
            addressString: req.body.addressDetail 
                + ', ' + wardName 
                + ', ' + districtName 
                + ', ' + provinceName
        }

        const address = await Address.find({ customer: req.body.customer })
        if(address.length == 0) data.isPrimary = true;

        await Address.create(data)
        res.status(200).json({
            message: 'Thêm mới địa chỉ thành công!'
        })
        
    } catch (err) {
        next(new Error())
    }
}

exports.getAllByCustomer = async (req, res, next) => {
    try {
        const address = await Address.find({
            customer: Types.ObjectId(req.query.customer),
            isDeleted: null,
        })
        res.status(200).send(address);
    } catch (err) {
        next(new Error())
    }
}

exports.updateOneAddress = async (req, res, next) => {
    try {
        const provinceName = await regionName
            .findGHNProvinceName(req.body.province);
        const districtName = await regionName
            .findGHNDistrictName(req.body.province, req.body.district);
        const wardName = await regionName
            .findGHNWardName(req.body.district, req.body.ward);

        var data = {
            ...req.body,
            addressString: req.body.addressDetail 
                + ', ' + wardName 
                + ', ' + districtName 
                + ', ' + provinceName
        }

        await Address.findByIdAndUpdate(req.params.id, data, { new: true })

        res.status(200).json({ 
            message: 'Cập nhật địa chỉ thành công' 
        })
    } catch (err) {
        next(new Error())
    }
}

exports.deleteOneAddress = async (req, res, next) => {
    try {
        await Address.findByIdAndUpdate(
            req.params.id, 
            { isDeleted: true },
            { new: true }
        );

        res.status(200).json({ 
            message: 'Thành công! Địa chỉ vừa chọn đã bị xóa.' 
        })
    } catch (error) {
        next(new Error())
    }
}

exports.changeDefaultAddress = async (req, res, next) => {
    try {
        await Address.findOneAndUpdate(
            {
                customer: Types.ObjectId(req.body.customer),
                isPrimary: true,
            }, 
            { isPrimary: false },
            { new: true }
        )

        await Address.findByIdAndUpdate(
            req.params.id,
            { isPrimary: true },
            { new: true }
        )

        res.status(200).json({ 
            message: 'Thiết lập địa chỉ mặc định thành công!.' 
        })
    } catch (error) {
        next(new Error())
    }
}

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary').v2;

const Employee = require('../models/Employee');
const jwtMiddleware = require('../middlewares/jwt-verify')
const { transporter } = require('../utils/createMailTransport')
const regionName = require("../utils/regionName");

const NotFoundError = require('../error/NotFoundError');
const ForbibdenError = require('../error/ForbiddenError');
const DuplicationError = require("../error/DuplicationError");

exports.create = async (req, res, next) => {
    const fileData = req.file

    try {
        const isExist = await Employee.findOne({ email: req.body.email });
        if (isExist) {
            if(fileData) cloudinary.uploader.destroy(fileData?.filename);
            return next(new DuplicationError("Email đã đăng ký tài khoản trên hệ thống!"));
        } 

        if(fileData) {
            req.body.avatar = {
                link: fileData?.path,
                path: fileData?.filename
            }
        } else {
            delete req.body.avatar
        }
        
        const provinceName = await regionName
        .findProvinceName(req.body.province);
        const districtName = await regionName
        .findDistrictName(req.body.province, req.body.district);
        const wardName = await regionName
        .findWardName(req.body.district, req.body.ward);
        
        data = {
            ...req.body, 
            address: {
                province: req.body.province,
                district: req.body.district,
                ward: req.body.ward,
                addressDetail: req.body.addressDetail,
                addressString: req.body.addressDetail 
                    + ', ' + wardName 
                    + ', ' + districtName 
                    + ', ' + provinceName
                },
                status: true,
        };
        ["ward", "district", "province", "addressDetail"].forEach((f) => delete data[f]);
        
        const result = await Employee.create(data);
        res.status(200).json({
            data: result,
            message: "Thêm nhân viên thành công!"
        });
    } catch (err) {
        if(fileData) cloudinary.uploader.destroy(fileData?.filename);
        next(new Error());
    }
}

exports.login = async (req, res, next) => {
    try {
        const employee = await Employee.findOne({ email: req.body.email });
        if (!employee) {
            return next(new NotFoundError("Không tìm thấy tài khoản của bạn!"));
        }
        const validPassword = await bcrypt.compareSync(req.body.password, employee.password);
        if (!validPassword) {
            return next(new NotFoundError("Mật khẩu bạn nhập không chính xác!"));
        }
        if (employee && validPassword) {
            const accessToken = jwtMiddleware.generateAccessToken(employee);
            const refreshToken = jwtMiddleware.generateRefreshToken(employee);
            res.cookie('refreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: "strict",
            });
            const { password, ...others } = employee._doc;
            res.status(200).json({ ...others, accessToken });
        }
    } catch (err) {
        next(new Error());
    }
}

exports.logout =  async (req, res, next) => {
    try {
        res.clearCookie('refreshToken', {path: '/'});
        res.status(200).send("Đăng xuất thành công!" );
    } catch (err) {
        next(new Error("Đăng xuất thất bại!"))
    }
}

exports.sendMailVerifyResetPassword = async (req, res, next) => {
    try {
        const employee = await Employee.findOne(req.body);
        if(!employee) {
            return next(new NotFoundError("Không tìm thấy tài khoản của bạn!"));
        }
        const secret = process.env.JWT_MAIL_SECRET_KEY + employee.password;
        const token = jwtMiddleware.generateMailVerifyToken(employee, secret)
        
        const contentMail = 
            `<h2>Sneaker Shop xin chào bạn</h2>
            <p>Bạn vừa gửi yêu cầu thay đổi mật khẩu đăng nhập cho tài khoản của bạn.</p>
            <p>Vì lý do bảo mật, vui lòng nhấn xác minh để chứng minh là chính bạn trước khi thay đổi mật khẩu.</p>
            <p>Link xác minh này chỉ có hiệu lực trong <b>15 phút</b> từ khi bạn gửi yêu cầu</p>
            <a 
                href=${process.env.URL_FRONTEND_SERVER}/admin/reset_password/${employee._id}/${token}
                style="display: inline-block; padding: 12px 48px; background-color: blue; color: white; text-decoration: none; font-weight: bold;"
            >XÁC MINH NGAY</a>`
        
        const mailOption = {
            from: '"Sneaker Shop" <no-reply@sneakershop.com>',
            to: employee.email,
            subject: "Verify Email",
            html: contentMail,
        }

        await transporter.sendMail(mailOption, (err, info) => {
            if(err) {
                return next(new Error());
            } else {
                res.status(200).send(info.response);
            }
        })

    } catch (error) {
        next(new Error())
    }
}

exports.verifyTokenResetPassword = async (req, res, next) => {
    const { id, token } = req.params;
    const employee = await Employee.findById(id);
    if(!employee) {
        return next(new NotFoundError("Không tìm thấy tài khoản của bạn!"));
    }
    const secret = process.env.JWT_MAIL_SECRET_KEY + employee.password;
    try {
        const verify = jwt.verify(token, secret);
        res.status(200).json({status: 'success', message: "Xác minh hoàn tất!"});
    } catch (error) {
        next(new ForbibdenError("Mail xác thực của bạn đã hết hạn!"));
    }
}

exports.resetPassword = async (req, res, next) => {
    const { id } = req.params;
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        await Employee.findByIdAndUpdate(id, {password: hashPassword}, {new: true});
        res.status(200).json({status: 'success', message: "Đổi mật khẩu thành công!"});
    } catch (error) {
        next(new Error())
    }
}

exports.changePassword = async (req, res, next) => {
    try { 
        const employee = await Employee.findById(req.params.id);
        console.log(employee);
        const validPassword = await bcrypt.compareSync(req.body.currentPassword, employee.password);
        console.log(validPassword);
        if (!validPassword) {
            return next(new NotFoundError("Nhập mật khẩu hiện tại không chính xác!"));
        }

        const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
        await Employee.findByIdAndUpdate(req.params.id, {password: hashPassword}, {new: true});
        res.status(200).json({message: "Đổi mật khẩu thành công!"});
    } catch (error) {
        
    }
}

exports.getAllEmployees = async (req, res, next) => {
    const newResult =[];
    try {
        const result = await Employee.find();
        result.forEach((item) => {
            newResult.push({
                ...item._doc,
                ...item.address,
            })
        });
        res.status(200).send(newResult);
    } catch(err) {
        next(new Error());
    }
}

exports.getOneEmployee = async (req, res, next) => {
    try {
        const result = await Employee.findById(req.params.id);
        const newResult = {
            ...result._doc,
            ...result.address,
            birthday: result.birthday.toISOString().slice(0, 10),
        }
        res.status(200).send(newResult);
    } catch (err) {
        next(new NotFoundError("Không tìm thấy tài nguyên!"));
    }
}

exports.updateInfoEmployee = async (req, res, next) => {
    const fileData = req.file;
    try{
        console.log(req.body);
        if(fileData !== undefined) {
            const current = await Employee.findById(req.params.id);
            if(current) { cloudinary.uploader.destroy(current?.avatarPath) };
            req.body.avatar = {
                link: fileData?.path,
                path: fileData?.filename,
            };
        } else {
            delete req.body.avatar
        }
       
        const provinceName = await regionName
            .findProvinceName(req.body.province);
        const districtName = await regionName
            .findDistrictName(req.body.province, req.body.district);
        const wardName = await regionName
            .findWardName(req.body.district, req.body.ward);

        data = {
            ...req.body, 
            address: {
                province: req.body.province,
                district: req.body.district,
                ward: req.body.ward,
                addressDetail: req.body.addressDetail,
                addressString: req.body.addressDetail 
                    + ', ' + wardName 
                    + ', ' + districtName 
                    + ', ' + provinceName
            },
        };
        ["ward", "district", "province", "addressDetail"].forEach((f) => delete data[f]);
        
        await Employee.findByIdAndUpdate(req.params.id, data , { new: true });
        res.status(200).json({
            message: "Đã cập nhật thành công"
        })
    } catch(err) {
        next(new Error());
    }
}

exports.deleteEmployee = async (req, res, next) => {
    try {
        await Employee.findByIdAndDelete(req.params.id, {new: true});
        res.status(200).json({
            message: "Xóa thành công một nhân viên"
        })
    } catch (error) {
        next(new Error());
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Employee.findById(req.params.id);
        const result = await Employee.findByIdAndUpdate(
            req.params.id, 
            { status: !current.status },
            { new: true }
        )
        console.log(result);
        res.status(200).json({
            message: `${(result.status === true) ? "Mở khóa tài khoản" : "Khóa tài khoản"} thành công`
        })
    } catch (error) {
        next(new Error())
    }
}

exports.updatePermission = async (req, res, next) => {
    try {
        console.log(req.body, req.params.id);
        await Employee.findByIdAndUpdate(
            req.params.id, 
            { permissions: req.body },
            { new: true }
        )
        res.status(200).json({
            message: "Chỉnh sửa quyền nhân viên thành công!"
        })
    } catch (error) {
        next(new Error())
    }
}
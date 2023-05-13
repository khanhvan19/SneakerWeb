const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cloudinary = require('cloudinary').v2;

const Customer = require('../models/Customer');
const jwtMiddleware = require('../middlewares/jwt-verify')
const { transporter } = require('../utils/createMailTransport')
const regionName = require("../utils/regionName");

const NotFoundError = require('../error/NotFoundError');
const ForbibdenError = require('../error/ForbiddenError');
const DuplicationError = require("../error/DuplicationError");
const Cart = require("../models/Cart");

exports.register = async (req, res, next) => {
    try {
        const isExist = await Customer.findOne({ email: req.body.email });
        if (isExist) {
            return next(new DuplicationError("Email đã đăng ký tài khoản trên hệ thống!"));
        }
        await Customer.create({ ...req.body, status: true });
        res.status(200).json({
            message: "Đăng ký tài khoản thành công!"
        });    
    } catch (error) {
        next(new Error())
    }
}

exports.login = async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ email: req.body.email })
        if (!customer) {
            return next(new NotFoundError("Không tìm thấy tài khoản của bạn!"));
        }
        const validPassword = await bcrypt.compareSync(req.body.password, customer.password);
        if (!validPassword) {
            return next(new NotFoundError("Mật khẩu bạn nhập không chính xác!"));
        }
        if (customer && validPassword) {
            console.log(req.body.email);
            const accessToken = jwtMiddleware.generateAccessToken(customer);
            const refreshToken = jwtMiddleware.generateRefreshToken(customer);
            res.cookie('customerRefreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: false,
                path: '/',
                sameSite: "strict",
            });
            const { password, ...others } = customer._doc;

            const cart = await Cart.findOne({ customer: customer._id });    
            const countProductOfCart = (cart != null)
                ? cart.products.reduce(
                    (count, product) => count + product.quantity, 0
                )
                : 0

            res.status(200).json({
                ...others, 
                accessToken,
                totalCart: countProductOfCart,
                message: "Đăng nhập thành công!"
            });
        }
    } catch (err) {
        next(new Error());
    }
}

exports.logout =  async (req, res, next) => {
    try {
        res.clearCookie('customerRefreshToken', {path: '/'});
        res.status(200).send("Đăng xuất thành công!" );
    } catch (err) {
        next(new Error("Đăng xuất thất bại!"))
    }
}
//
exports.sendMailVerifyResetPassword = async (req, res, next) => {
    try {
        const customer = await Customer.findOne(req.body);
        if(!customer) {
            return next(new NotFoundError("Không tìm thấy tài khoản của bạn!"));
        }
        const secret = process.env.JWT_MAIL_SECRET_KEY + customer.password;
        const token = jwtMiddleware.generateMailVerifyToken(customer, secret)
        
        const contentMail = 
            `<h2>Sneaker Shop xin chào bạn</h2>
            <p>Bạn vừa gửi yêu cầu thay đổi mật khẩu đăng nhập cho tài khoản của bạn.</p>
            <p>Vì lý do bảo mật, vui lòng nhấn xác minh để chứng minh là chính bạn trước khi thay đổi mật khẩu.</p>
            <p>Link xác minh này chỉ có hiệu lực trong <b>15 phút</b> từ khi bạn gửi yêu cầu</p>
            <a 
                href=${process.env.URL_FRONTEND_SERVER}/admin/reset_password/${customer._id}/${token}
                style="display: inline-block; padding: 12px 48px; background-color: blue; color: white; text-decoration: none; font-weight: bold;"
            >XÁC MINH NGAY</a>`
        
        const mailOption = {
            from: '"Sneaker Shop" <no-reply@sneakershop.com>',
            to: customer.email,
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
//
exports.verifyTokenResetPassword = async (req, res, next) => {
    const { id, token } = req.params;
    const customer = await Customer.findById(id);
    if(!customer) {
        return next(new NotFoundError("Không tìm thấy tài khoản của bạn!"));
    }
    const secret = process.env.JWT_MAIL_SECRET_KEY + customer.password;
    try {
        const verify = jwt.verify(token, secret);
        res.status(200).json({status: 'success', message: "Xác minh hoàn tất!"});
    } catch (error) {
        next(new ForbibdenError("Mail xác thực của bạn đã hết hạn!"));
    }
}
//
exports.resetPassword = async (req, res, next) => {
    const { id } = req.params;
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        await Customer.findByIdAndUpdate(id, {password: hashPassword}, {new: true});
        res.status(200).json({status: 'success', message: "Đổi mật khẩu thành công!"});
    } catch (error) {
        next(new Error())
    }
}

exports.getAllCustomer = async (req, res, next) => {
    try {
        const result = await Customer.find();
        res.status(200).send(result);
    } catch(err) {
        next(new Error());
    }
}

exports.getOneCustomer = async (req, res, next) => {
    try {
        const result = await Customer.findById(req.params.id);
        var newResult = {...result._doc}
        if(result.birthday) {
            newResult.birthday = result.birthday.toISOString().slice(0, 10)
        } 
        res.status(200).send(newResult);
    } catch (err) {
        next(new NotFoundError("Không tìm thấy tài nguyên!"));
    }
}

exports.updateInfoCustomer = async (req, res, next) => {
    const fileData = req.file;
    try{
        if(fileData !== undefined) {
            const current = await Customer.findById(req.params.id);
            if(current) { cloudinary.uploader.destroy(current?.avatarPath) };
            req.body.avatar = {
                link: fileData?.path,
                path: fileData?.filename,
            };
        } else {
            delete req.body.avatar
        }

        const result = await Customer.findByIdAndUpdate(req.params.id, req.body , { new: true });
        res.status(200).json({
            result: result,
            message: "Đã cập nhật thành công",
        })
    } catch(err) {
        next(new Error());
    }
}

exports.toggleStatus = async (req, res, next) => {
    try {
        const current = await Customer.findById(req.params.id);
        const result = await Customer.findByIdAndUpdate(
            req.params.id, 
            { status: !current.status },
            { new: true }
        )
        
        res.status(200).json({
            message: `${(result.status === true) ? "Mở khóa tài khoản" : "Khóa tài khoản"} thành công`
        })
    } catch (error) {
        next(new Error())
    }
}

exports.changePassword = async (req, res, next) => {
    try { 
        const employee = await Customer.findById(req.params.id);
        const validPassword = await bcrypt.compareSync(req.body.currentPassword, employee.password);

        if (!validPassword) {
            return next(new Error("Mật khẩu hiện tại không đúng!"));
        }

        const hashPassword = await bcrypt.hash(req.body.newPassword, 10);
        await Customer.findByIdAndUpdate(req.params.id, {password: hashPassword});
        res.status(200).json({message: "Thành công! Mật khẩu đã được thay đổi!"});
    } catch (error) {
        next(new Error())
    }
}
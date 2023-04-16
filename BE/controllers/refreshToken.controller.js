const jwtMiddleware = require('../middlewares/jwt-verify')
const jwt = require("jsonwebtoken");
const UnauthError = require('../error/UnauthError');

exports.requestRefreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return next(new UnauthError('Phiên đăng nhập đã hết hạn! Vui lòng đăng nhập lại'));
        } 
        jwt.verify(
            refreshToken, 
            process.env.JWT_REFRESH_KEY, 
            (err) => {
                if(err) next(new Error());
                const newAccessToken = jwtMiddleware.generateAccessToken(req.body);
                res.status(200).send(newAccessToken);
            }
        );
    } catch (err) {
        next(new Error());
    }
    
}
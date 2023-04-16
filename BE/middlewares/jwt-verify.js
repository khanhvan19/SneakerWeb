const jwt = require("jsonwebtoken");
const ForbibdenError = require('../error/ForbiddenError');
const ValidationError = require("../error/ValidationError");

exports.generateAccessToken = (data) => {
  return jwt.sign(
    { id: data._id },
    process.env.JWT_ACCESS_KEY,
    { expiresIn: "20s" }
  );
}

exports.generateRefreshToken = (data) => {
  return jwt.sign(
    { id: data._id },
    process.env.JWT_REFRESH_KEY,
    { expiresIn: "30d" }
  );
}

exports.generateMailVerifyToken = (data, secret) => {
  return jwt.sign(
    { id: data._id, email: data.email },
    secret,
    { expiresIn: "15m" }
  );
}

exports.verifyAccessToken = (req, res, next) => {
  const accessToken = req.headers.token;
  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err) => {
      if (err) {
        return next(new ForbibdenError("Access Token không tồn tại!"));
      }
      next();
    });
  } else {
    return next(new ValidationError("Vui lòng tiến hành đăng nhập!"));
  }
};


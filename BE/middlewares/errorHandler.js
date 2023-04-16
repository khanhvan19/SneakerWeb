const errorHandler = (err, req, res, next) => {
    if(err.errorObj) {
        err.message = [];
        for(let field in err.errorObj) {
            err.message.push(`Nhập '${field}' không hợp lệ hoặc thiếu`)
        }
    }

    const messageError = err.message || "Đã có lỗi xảy ra! Vui lòng thử lại sau!";
    const statusCode = err.status || 500;
    res.status(statusCode).json({
        status: `Error ${statusCode}`,
        message: messageError,
    });
}

module.exports = errorHandler
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser')
const NotFoundError = require('./error/NotFoundError')
const errorHandler = require('./middlewares/errorHandler')

const employeeRoute = require('./routes/employee.route');
const regionRoute = require('./routes/region.router');
const brandRoute = require('./routes/brand.route')
const categoryRoute = require('./routes/category.route')
const sampleRouter = require('./routes/sample.router')
const productRouter = require('./routes/product.route')
const importRouter = require('./routes/import.route')
const customerRouter = require('./routes/customer.route')
const voucherRouter = require('./routes/voucher.router')

const app = express();
app.use(cors({credentials: true, origin: process.env.URL_FRONTEND_SERVER}));
app.use(cookieParser());
app.use(express.json());

//Router
app.use('/api/region', regionRoute);
app.use('/api/employee', employeeRoute);
app.use('/api/brand', brandRoute);
app.use('/api/category', categoryRoute);
app.use('/api/sample', sampleRouter);
app.use('/api/product', productRouter);
app.use('/api/import', importRouter);
app.use('/api/customer', customerRouter);
app.use('/api/voucher', voucherRouter);

app.use((req, res, next) => {
    next(new NotFoundError("Không tìm thấy tài nguyên!"));
})

app.use(errorHandler)

module.exports = app;

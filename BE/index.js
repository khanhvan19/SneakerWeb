//dotenv
require('dotenv').config();
const app = require("./app");
//connect DB
const { connectDB } = require('./configDB')
connectDB();

//port
app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on port ${process.env.APP_PORT}`)
})
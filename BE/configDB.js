const mongoose = require('mongoose');

const connectDB = async() => {
    mongoose.set('strictQuery', true);
    const connectOption = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
    
    try {
        await mongoose.connect(process.env.DB_URI, connectOption);
        console.log('Connect DB successfully');
    } catch (error) {
        console.log(`Connect Failure! Error: ${error}`);
        process.exit(1);
    }
}

module.exports = { connectDB }
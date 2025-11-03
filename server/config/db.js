const mongoose = require('mongoose');

let isConnected = false;

async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qa_app';
    if (isConnected) return;
    await mongoose.connect(uri);
    isConnected = true;
    console.log('MongoDB connected');
}

module.exports = connectDB;
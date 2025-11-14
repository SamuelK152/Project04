const mongoose = require('mongoose');

let isConnected = false;

function sanitize(uri) {
    return uri.replace(/\/\/([^:]+):[^@]+@/, '//$1:****@');
}

async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/qa_app';
    if (isConnected) return;
    try {
        console.log('Connecting to MongoDB:', sanitize(uri));
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 15000
        });
        isConnected = true;
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        throw err;
    }
}

module.exports = connectDB;
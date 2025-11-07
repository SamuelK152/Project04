const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        body: { type: String, required: true, trim: true },
    },
    { _id: true, timestamps: true }
);

const answerSchema = new mongoose.Schema(
    {
        question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true, index: true },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        body: { type: String, required: true, trim: true },
        comments: [commentSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Answer', answerSchema);
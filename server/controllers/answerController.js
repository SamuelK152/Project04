const Answer = require('../models/Answer');

exports.listByQuestion = async (req, res) => {
    try {
        const questionId = req.query.question || req.params.questionId;
        if (!questionId) return res.status(400).json({ message: 'question is required' });

        const answers = await Answer.find({ question: questionId })
            .sort({ createdAt: -1 })
            .populate('author', 'name email')
            .populate('comments.author', 'name email')
            .lean();

        res.json({ answers });
    } catch {
        res.status(500).json({ message: 'Failed to load answers' });
    }
};

exports.create = async (req, res) => {
    try {
        const { question, body } = req.body;
        if (!question || !body) return res.status(400).json({ message: 'question and body are required' });

        const answer = await Answer.create({
            question,
            body,
            author: req.userId,
        });

        const populated = await answer.populate('author', 'name email');
        res.status(201).json({ answer: populated });
    } catch {
        res.status(500).json({ message: 'Failed to create answer' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { body } = req.body;
        if (!body) return res.status(400).json({ message: 'body is required' });
        const ans = await Answer.findById(req.params.id);
        if (!ans) return res.status(404).json({ message: 'Answer not found' });

        ans.comments.push({ author: req.userId, body });
        await ans.save();
        const populated = await Answer.findById(ans._id)
            .populate('author', 'name email')
            .populate('comments.author', 'name email')
            .lean();

        res.status(201).json({ answer: populated });
    } catch {
        res.status(500).json({ message: 'Failed to add comment' });
    }
};

exports.remove = async (req, res) => {
    try {
        const ans = await Answer.findById(req.params.id);
        if (!ans) return res.status(404).json({ message: 'Answer not found' });
        if (ans.author.toString() !== req.userId) return res.status(403).json({ message: 'Not allowed' });

        await ans.deleteOne();
        res.json({ message: 'Answer deleted' });
    } catch {
        res.status(500).json({ message: 'Failed to delete answer' });
    }
};
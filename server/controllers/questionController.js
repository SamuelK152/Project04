const Question = require('../models/Question');
const Answer = require('../models/Answer');

exports.listByCategory = async (req, res) => {
  try {
    const categoryId = req.query.category || req.params.categoryId;
    if (!categoryId) return res.status(400).json({ message: 'category is required' });

    const questions = await Question.find({ category: categoryId })
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .lean();

    res.json({ questions });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load questions' });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, body, category } = req.body;
    if (!title || !body || !category) return res.status(400).json({ message: 'title, body, and category are required' });
    const question = await Question.create({
      title,
      body,
      category,
      author: req.userId,
    });
    res.status(201).json({ question });
  } catch (e) {
    res.status(500).json({ message: 'Failed to create question' });
  }
};

exports.remove = async (req, res) => {
  try {
    const id = req.params.id;
    const q = await Question.findById(id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    if (q.author.toString() !== req.userId) return res.status(403).json({ message: 'Not allowed' });

    await Answer.deleteMany({ question: q._id });
    await q.deleteOne();
    res.json({ message: 'Question deleted' });
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete question' });
  }
};
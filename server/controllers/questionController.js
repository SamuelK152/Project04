const Question = require('../models/Question');

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
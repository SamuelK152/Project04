const Category = require('../models/Category');

exports.list = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 }).lean();
    res.json({ categories });
  } catch (e) {
    res.status(500).json({ message: 'Failed to load categories' });
  }
};
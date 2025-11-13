const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    const secret = process.env.JWT_SECRET || 'dev_secret';
    return jwt.sign(payload, secret, { expiresIn: '7d' });
}

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

        const existing = await User.findOne({ email });
        if (existing) return res.status(409).json({ message: 'Email already in use' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });
        const token = signToken(user);
        res.status(201).json({ token, user: user.toJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

        const token = signToken(user);
        res.json({ token, user: user.toJSON() });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.me = async (req, res) => {
    try {
        const user = await User.findById(req.userId).lean();
        if (!user) return res.status(404).json({ message: 'Not found' });
        const { _id, name, email } = user;
        res.json({ user: { _id: String(_id), id: String(_id), name, email } });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Missing token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        const userId = decoded.sub || decoded.id || decoded.userId;
        if (!userId) return res.status(401).json({ message: 'Invalid token' });
        req.userId = String(userId);
        req.user = { id: req.userId };
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};
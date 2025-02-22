/*
Author: Akanksha Misha
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        if (!req.user.userType) {
            return res.status(403).json({ message: 'Access denied. Admin privileges required' });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;

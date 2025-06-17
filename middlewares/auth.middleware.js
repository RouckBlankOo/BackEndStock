const jwt = require('jsonwebtoken');
const { User } = require('../database');
const { getEnvConfig } = require('../core/env.config');

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'Authentication required' });
        }
        const decoded = jwt.verify(token, getEnvConfig().jwt_secret);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
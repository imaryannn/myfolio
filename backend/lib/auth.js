const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
function generateToken(userId) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
}
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
async function comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
}
function authenticate(req) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    const token = authHeader.substring(7);
    return verifyToken(token);
}
module.exports = {
    generateToken,
    verifyToken,
    hashPassword,
    comparePassword,
    authenticate
};
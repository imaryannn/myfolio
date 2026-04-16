const { authenticate } = require('../../lib/auth');
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method === 'GET') {
        const user = authenticate(req);
        if (!user) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        res.status(200).json({ success: true, user });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

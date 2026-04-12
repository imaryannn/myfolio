const { connectToDatabase } = require('../../lib/mongodb');
const { authenticate } = require('../../lib/auth');
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const { db } = await connectToDatabase();
    if (req.method === 'GET') {
        try {
            const profile = await db.collection('profile').findOne({});
            if (!profile) {
                return res.status(404).json({ error: 'Profile not found' });
            }
            res.status(200).json({ success: true, profile });
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if (req.method === 'PUT') {
        const user = authenticate(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { hero, about, contact } = req.body;
            const result = await db.collection('profile').updateOne(
                {},
                {
                    $set: {
                        hero,
                        about,
                        contact,
                        updatedAt: new Date()
                    }
                },
                { upsert: true }
            );
            res.status(200).json({ success: true, message: 'Profile updated' });
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
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
            const skills = await db.collection('skills')
                .find({})
                .sort({ order: 1 })
                .toArray();
            res.status(200).json({ success: true, skills });
        } catch (error) {
            console.error('Get skills error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if (req.method === 'PUT') {
        const user = authenticate(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { skills } = req.body;
            if (!Array.isArray(skills)) {
                return res.status(400).json({ error: 'Skills must be an array' });
            }
            await db.collection('skills').deleteMany({});
            if (skills.length > 0) {
                await db.collection('skills').insertMany(
                    skills.map((skill, index) => ({
                        ...skill,
                        order: index,
                        updatedAt: new Date()
                    }))
                );
            }
            res.status(200).json({ success: true, message: 'Skills updated' });
        } catch (error) {
            console.error('Update skills error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
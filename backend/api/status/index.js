const { connectToDatabase } = require('../../lib/mongodb');
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method === 'GET') {
        try {
            const { db } = await connectToDatabase();
            const status = await db.collection('status').findOne({});
            res.status(200).json({
                success: true,
                online: status?.online !== false
            });
        } catch (error) {
            console.error('Status fetch error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else if (req.method === 'PUT') {
        try {
            const { online } = req.body;
            const { db } = await connectToDatabase();
            await db.collection('status').updateOne(
                {},
                { $set: { online } },
                { upsert: true }
            );
            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Status update error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

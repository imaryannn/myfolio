const { connectToDatabase } = require('../../lib/mongodb');
const { authenticate } = require('../../lib/auth');
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const { db } = await connectToDatabase();
    if (req.method === 'GET') {
        try {
            const projects = await db.collection('projects')
                .find({})
                .sort({ order: 1 })
                .toArray();
            res.status(200).json({ success: true, projects });
        } catch (error) {
            console.error('Get projects error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if (req.method === 'POST') {
        const user = authenticate(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { name, category, description, techStack, link, terminalOutput, order } = req.body;
            if (!name || !description) {
                return res.status(400).json({ error: 'Name and description required' });
            }
            const result = await db.collection('projects').insertOne({
                name,
                category: category || 'Protocol: App',
                description,
                techStack: techStack || [],
                link: link || '',
                terminalOutput: terminalOutput || [],
                order: order || 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            res.status(201).json({
                success: true,
                project: { _id: result.insertedId, name, category, description, techStack, link, terminalOutput, order }
            });
        } catch (error) {
            console.error('Create project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
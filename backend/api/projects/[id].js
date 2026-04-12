const { connectToDatabase } = require('../../lib/mongodb');
const { authenticate } = require('../../lib/auth');
const { ObjectId } = require('mongodb');
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    const { id } = req.query;
    if (!id || !ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid project ID' });
    }
    const { db } = await connectToDatabase();
    if (req.method === 'GET') {
        try {
            const project = await db.collection('projects').findOne({ _id: new ObjectId(id) });
            if (!project) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.status(200).json({ success: true, project });
        } catch (error) {
            console.error('Get project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if (req.method === 'PUT') {
        const user = authenticate(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const { name, category, description, techStack, link, terminalOutput, order } = req.body;
            const result = await db.collection('projects').updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        name,
                        category,
                        description,
                        techStack,
                        link,
                        terminalOutput,
                        order,
                        updatedAt: new Date()
                    }
                }
            );
            if (result.matchedCount === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.status(200).json({ success: true, message: 'Project updated' });
        } catch (error) {
            console.error('Update project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else if (req.method === 'DELETE') {
        const user = authenticate(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        try {
            const result = await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
            if (result.deletedCount === 0) {
                return res.status(404).json({ error: 'Project not found' });
            }
            res.status(200).json({ success: true, message: 'Project deleted' });
        } catch (error) {
            console.error('Delete project error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};
const { connectToDatabase } = require('../../lib/mongodb');
const { hashPassword, generateToken } = require('../../lib/auth');
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    try {
        const { email, password, name, setupKey } = req.body;
        if (setupKey !== process.env.SETUP_KEY) {
            return res.status(403).json({ error: 'Invalid setup key' });
        }
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'All fields required' });
        }
        const { db } = await connectToDatabase();
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await hashPassword(password);
        const result = await db.collection('users').insertOne({
            email,
            password: hashedPassword,
            name,
            createdAt: new Date()
        });
        const token = generateToken(result.insertedId.toString());
        res.status(201).json({
            success: true,
            token,
            user: {
                id: result.insertedId,
                email,
                name
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
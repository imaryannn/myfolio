require('dotenv').config();
const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let db;
const client = new MongoClient(process.env.MONGODB_URI);

client.connect().then(() => {
  db = client.db('portfolio');
  console.log('Connected to MongoDB');
}).catch(err => console.error('MongoDB connection error:', err));

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', async () => {
    try {
      if (body) body = JSON.parse(body);
      
      // Login endpoint
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const { email, password } = body;
        
        const user = await db.collection('users').findOne({ email });
        
        if (!user || !(await bcrypt.compare(password, user.password))) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid credentials' }));
          return;
        }
        
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          token, 
          user: { email: user.email, name: user.name } 
        }));
        return;
      }
      
      // Register endpoint
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const { email, password, name } = body;
        
        const existing = await db.collection('users').findOne({ email });
        if (existing) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'User already exists' }));
          return;
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
          email,
          password: hashedPassword,
          name,
          createdAt: new Date()
        });
        
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'User created' }));
        return;
      }
      
      // Delete user (for testing)
      if (pathname === '/api/auth/delete-user' && req.method === 'POST') {
        const { email } = body;
        await db.collection('users').deleteOne({ email });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'User deleted' }));
        return;
      }
      
      // Get all projects
      if (pathname === '/api/projects' && req.method === 'GET') {
        const projects = await db.collection('projects').find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, projects }));
        return;
      }
      
      // Get all skills
      if (pathname === '/api/skills' && req.method === 'GET') {
        const skills = await db.collection('skills').find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, skills }));
        return;
      }
      
      // Get profile
      if (pathname === '/api/profile' && req.method === 'GET') {
        const profile = await db.collection('profile').findOne({});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, profile }));
        return;
      }
      
      // Test route
      if (pathname === '/api/test') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'API is working', db: db ? 'connected' : 'disconnected' }));
        return;
      }

      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    } catch (error) {
      console.error('Error:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

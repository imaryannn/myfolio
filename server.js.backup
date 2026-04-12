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
      if (pathname === '/api/auth/delete-user' && req.method === 'POST') {
        const { email } = body;
        await db.collection('users').deleteOne({ email });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'User deleted' }));
        return;
      }
      if (pathname === '/api/projects' && req.method === 'GET') {
        const projects = await db.collection('projects').find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, projects }));
        return;
      }
      if (pathname === '/api/projects' && req.method === 'POST') {
        const result = await db.collection('projects').insertOne({
          ...body,
          createdAt: new Date()
        });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, id: result.insertedId }));
        return;
      }
      if (pathname.startsWith('/api/projects/') && req.method === 'PUT') {
        const id = pathname.split('/')[3];
        await db.collection('projects').updateOne(
          { _id: new ObjectId(id) },
          { $set: { ...body, updatedAt: new Date() } }
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
        const id = pathname.split('/')[3];
        await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      if (pathname === '/api/skills' && req.method === 'GET') {
        const skills = await db.collection('skills').find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, skills }));
        return;
      }
      if (pathname === '/api/skills' && req.method === 'PUT') {
        await db.collection('skills').deleteMany({});
        if (body.skills && body.skills.length > 0) {
          await db.collection('skills').insertMany(body.skills);
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      if (pathname === '/api/profile' && req.method === 'GET') {
        const profile = await db.collection('profile').findOne({});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, profile }));
        return;
      }
      if (pathname === '/api/profile' && req.method === 'PUT') {
        await db.collection('profile').deleteMany({});
        await db.collection('profile').insertOne(body);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      if (pathname === '/api/status' && req.method === 'PUT') {
        await db.collection('status').deleteMany({});
        await db.collection('status').insertOne({ online: body.online });
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
        return;
      }
      if (pathname === '/api/status' && req.method === 'GET') {
        const status = await db.collection('status').findOne({});
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, online: status?.online !== false }));
        return;
      }
      if (pathname === '/api/seed' && req.method === 'POST') {
        const projects = [
          {
            name: 'ZyroMeet',
            category: 'Protocol: Comms',
            description: 'Built a browser-based video calling app using WebRTC for peer-to-peer media streams and WebSockets for signaling.',
            tech: ['WebRTC', 'WebSocket', 'React'],
            url: 'https://zyromeet.onrender.com/',
            createdAt: new Date()
          },
          {
            name: 'NodeChat',
            category: 'Protocol: P2P Chat',
            description: 'Real-time chat app built on Node.js and Socket.io. Handles bidirectional WebSocket connections.',
            tech: ['Express.js', 'MongoDB Streams', 'WSS'],
            url: 'https://nodechat-aivw.onrender.com/',
            createdAt: new Date()
          },
          {
            name: 'WPDF Toolkit',
            category: 'Protocol: Utility',
            description: 'Client-side document processor leveraging Web Workers to compress, encrypt, and manipulate PDF files.',
            tech: ['Web Workers', 'Binary Streams', 'PDF.js API'],
            url: 'https://imaryannn.github.io/wpdf/',
            createdAt: new Date()
          },
          {
            name: 'Prioramail',
            category: 'Protocol: App',
            description: 'Minimal email platform with secure authentication and full email management capabilities.',
            tech: ['HTML/JS', 'Express', 'MongoDB', 'OAuth/JWT', 'Gmail API'],
            url: 'https://prioramail.vercel.app/',
            createdAt: new Date()
          },
          {
            name: 'Syncyt',
            category: 'Protocol: Interactive',
            description: 'Real-time interactive platform with synchronized media and live communication features.',
            tech: ['Socket.io', 'Express', 'Node.js', 'YouTube API'],
            url: 'https://syncyt.onrender.com/',
            createdAt: new Date()
          }
        ];
        const skills = [
          {
            category: 'Frontend Logic',
            items: [
              { name: 'JavaScript (ES6+)', level: 95 },
              { name: 'HTML5', level: 95 },
              { name: 'CSS3', level: 90 }
            ]
          },
          {
            category: 'Backend & Network',
            items: [
              { name: 'Node.js', level: 85 },
              { name: 'Express.js', level: 90 },
              { name: 'Socket.io / WSS', level: 85 }
            ]
          },
          {
            category: 'Data & Systems',
            items: [
              { name: 'MongoDB', level: 80 },
              { name: 'REST APIs', level: 90 },
              { name: 'Git & Auth', level: 85 }
            ]
          }
        ];
        const profile = {
          hero: {
            title: 'ARYAN',
            subtitle: 'Full Stack Developer',
            description: 'Architecting robust, high-performance systems and immersive interactive experiences at the frontier of the web.'
          },
          about: {
            text: 'Build scalable, distributed, and production-grade client-server systems that actually work under pressure. I write real code — Node.js backends, REST APIs, WebSocket servers, MongoDB pipelines, and front-end UIs that are fast and functional.'
          },
          contact: {
            email: 'thatsaryn@gmail.com',
            github: 'https://github.com/imaryannn',
            linkedin: 'https://www.linkedin.com/in/aryan-2064153a0/'
          }
        };
        await db.collection('projects').deleteMany({});
        await db.collection('skills').deleteMany({});
        await db.collection('profile').deleteMany({});
        await db.collection('projects').insertMany(projects);
        await db.collection('skills').insertMany(skills);
        await db.collection('profile').insertOne(profile);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Database seeded successfully' }));
        return;
      }
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
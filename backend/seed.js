const { MongoClient } = require('mongodb');
require('dotenv').config();

const seedData = {
    projects: [
        {
            name: "ZyroMeet",
            category: "Protocol: Comms",
            description: "Built a browser-based video calling app using WebRTC for peer-to-peer media streams and WebSockets for signaling. Handles real-time connection negotiation and low-latency A/V transport.",
            techStack: ["WebRTC", "WebSocket", "React"],
            link: "https://zyromeet.onrender.com/",
            terminalOutput: [
                "> initializing WebRTC handshake...",
                "> connection established: [PEER_A0Z]",
                "> latency: 12ms"
            ],
            order: 0
        },
        {
            name: "NodeChat",
            category: "Protocol: P2P Chat",
            description: "Real-time chat app built on Node.js and Socket.io. Handles bidirectional WebSocket connections, room-based messaging, and live user presence — all running on a persistent Express server.",
            techStack: ["Express.js", "MongoDB Streams", "WSS"],
            link: "https://nodechat-aivw.onrender.com/",
            terminalOutput: [
                "[USER_01]: SYN",
                "[SERVER]: ACK",
                "[USER_01]: connected to wss://chat",
                "[USER_02]: socket.write('hello')"
            ],
            order: 1
        },
        {
            name: "WPDF Toolkit",
            category: "Protocol: Utility",
            description: "Client-side document processor leveraging Web Workers to compress, encrypt, and manipulate standard PDF file binaries securely.",
            techStack: ["Web Workers", "Binary Streams", "PDF.js API"],
            link: "https://imaryannn.github.io/wpdf/",
            terminalOutput: [
                "> loading bin/document.pdf",
                "> parsing byte streams: 100%",
                "> compressing via worker-01...",
                "> output: 2.1MB (saved 45%)"
            ],
            order: 2
        },
        {
            name: "Prioramail",
            category: "Protocol: App",
            description: "Minimal email platform with secure authentication and full email management capabilities.",
            techStack: ["HTML/JS", "Express", "MongoDB", "OAuth/JWT", "Gmail API"],
            link: "https://prioramail.vercel.app/",
            terminalOutput: [
                "> auth.google.verifyToken()",
                "> JWT established successfully",
                "> fetching inbox via Gmail API...",
                "> 12 new messages loaded"
            ],
            order: 3
        },
        {
            name: "Syncyt",
            category: "Protocol: Interactive",
            description: "Real-time interactive platform with synchronized media and live communication features.",
            techStack: ["Socket.io", "Express", "Node.js", "YouTube API"],
            link: "https://syncyt.onrender.com/",
            terminalOutput: [
                "> wss://syncyt starting...",
                "> client[09] joined room 'media_1'",
                "> broadcast(player.seekTo(124))",
                "> playback perfectly synced"
            ],
            order: 4
        }
    ],
    skills: [
        {
            category: "Frontend Logic",
            items: [
                { name: "JavaScript (ES6+)", level: 95 },
                { name: "HTML5", level: 95 },
                { name: "CSS3", level: 90 }
            ],
            order: 0
        },
        {
            category: "Backend & Network",
            items: [
                { name: "Node.js", level: 85 },
                { name: "Express.js", level: 90 },
                { name: "Socket.io / WSS", level: 85 }
            ],
            order: 1
        },
        {
            category: "Data & Systems",
            items: [
                { name: "MongoDB", level: 80 },
                { name: "REST APIs", level: 90 },
                { name: "Git & Auth", level: 85 }
            ],
            order: 2
        }
    ],
    profile: {
        hero: {
            title: "ARYAN",
            subtitle: "Full Stack Developer",
            description: "Architecting robust, high-performance systems and immersive interactive experiences at the frontier of the web."
        },
        about: {
            text: "<strong>MISSION //</strong> Build scalable, distributed, and production-grade client-server systems that actually work under pressure.\n\nI write real code — Node.js backends, REST APIs, WebSocket servers, MongoDB pipelines, and front-end UIs that are fast and functional. I don't just make things look good — I make them work."
        },
        contact: {
            github: "https://github.com/imaryannn",
            linkedin: "https://www.linkedin.com/in/aryan-2064153a0/"
        }
    },
    status: {
        online: true
    }
};

async function seedDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        
        const db = client.db('myfolio');
        
        await db.collection('projects').deleteMany({});
        await db.collection('projects').insertMany(seedData.projects);
        console.log('✓ Projects seeded');
        
        await db.collection('skills').deleteMany({});
        await db.collection('skills').insertMany(seedData.skills);
        console.log('✓ Skills seeded');
        
        await db.collection('profile').deleteMany({});
        await db.collection('profile').insertOne(seedData.profile);
        console.log('✓ Profile seeded');
        
        await db.collection('status').deleteMany({});
        await db.collection('status').insertOne(seedData.status);
        console.log('✓ Status seeded');
        
        console.log('\n✅ Database seeded successfully!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        await client.close();
    }
}

seedDatabase();

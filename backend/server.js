const http = require('http');
const { URL } = require('url');
require('dotenv').config();

const routes = [
    { pattern: /^\/api\/auth\/login\/?$/, handler: require('./api/auth/login') },
    { pattern: /^\/api\/auth\/register\/?$/, handler: require('./api/auth/register') },
    { pattern: /^\/api\/auth\/verify\/?$/, handler: require('./api/auth/verify') },
    { pattern: /^\/api\/ai\/project-draft\/?$/, handler: require('./api/ai/project-draft') },
    { pattern: /^\/api\/profile\/?$/, handler: require('./api/profile') },
    { pattern: /^\/api\/projects\/?$/, handler: require('./api/projects') },
    { pattern: /^\/api\/projects\/([^/]+)\/?$/, handler: require('./api/projects/[id]'), param: 'id' },
    { pattern: /^\/api\/skills\/?$/, handler: require('./api/skills') },
    { pattern: /^\/api\/status\/?$/, handler: require('./api/status') },
];

function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        req.on('data', (chunk) => chunks.push(chunk));
        req.on('error', reject);
        req.on('end', () => {
            const rawBody = Buffer.concat(chunks).toString();

            if (!rawBody) {
                resolve({});
                return;
            }

            try {
                resolve(JSON.parse(rawBody));
            } catch (error) {
                reject(new Error('Invalid JSON body'));
            }
        });
    });
}

function attachResponseHelpers(res) {
    res.status = (statusCode) => {
        res.statusCode = statusCode;
        return res;
    };

    res.json = (payload) => {
        if (!res.headersSent) {
            res.setHeader('Content-Type', 'application/json');
        }

        res.end(JSON.stringify(payload));
    };

    return res;
}

function findRoute(pathname) {
    for (const route of routes) {
        const match = pathname.match(route.pattern);

        if (match) {
            return {
                handler: route.handler,
                params: route.param ? { [route.param]: match[1] } : {},
            };
        }
    }

    return null;
}

const server = http.createServer(async (req, res) => {
    attachResponseHelpers(res);

    const url = new URL(req.url, `http://${req.headers.host}`);
    const route = findRoute(url.pathname);

    if (!route) {
        res.status(404).json({ error: 'Not found' });
        return;
    }

    req.query = Object.fromEntries(url.searchParams.entries());
    req.query = { ...req.query, ...route.params };

    try {
        req.body = await readBody(req);
        await route.handler(req, res);
    } catch (error) {
        if (error.message === 'Invalid JSON body') {
            res.status(400).json({ error: error.message });
            return;
        }

        console.error('Server error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const port = process.env.PORT || 3000;
const host = process.env.HOST || '127.0.0.1';

server.listen(port, host, () => {
    console.log(`API server running at http://${host}:${port}`);
});

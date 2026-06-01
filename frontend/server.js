const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 5173;
const host = process.env.HOST || '127.0.0.1';

const contentTypes = {
    '.css': 'text/css',
    '.html': 'text/html',
    '.ico': 'image/x-icon',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
};

function sendFile(res, filePath) {
    const ext = path.extname(filePath).toLowerCase();

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(error.code === 'ENOENT' ? 404 : 500, {
                'Content-Type': 'text/plain',
            });
            res.end(error.code === 'ENOENT' ? 'Not found' : 'Internal server error');
            return;
        }

        res.writeHead(200, {
            'Content-Type': contentTypes[ext] || 'application/octet-stream',
        });
        res.end(content);
    });
}

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const decodedPath = decodeURIComponent(url.pathname);
    const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, '');
    const requestedPath = path.join(root, normalizedPath);
    const filePath = decodedPath.endsWith('/')
        ? path.join(requestedPath, 'index.html')
        : requestedPath;

    if (!filePath.startsWith(root)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('Forbidden');
        return;
    }

    sendFile(res, filePath);
});

server.listen(port, host, () => {
    console.log(`Frontend running at http://${host}:${port}`);
});

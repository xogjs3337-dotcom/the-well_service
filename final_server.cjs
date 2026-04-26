const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 8092;

http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    let filePath = '.' + parsedUrl.pathname;
    if (filePath == './') filePath = './index.html';

    // API Handling
    if (parsedUrl.pathname === '/api/db' || parsedUrl.pathname === '/api.php') {
        const dbFile = './db.json';
        if (req.method === 'GET') {
            fs.readFile(dbFile, (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: 'DB Read Error' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                    res.end(data);
                }
            });
            return;
        }
        if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk.toString(); });
            req.on('end', () => {
                try {
                    const newData = JSON.parse(body);
                    newData.lastUpdated = new Date().toISOString();
                    fs.writeFile(dbFile, JSON.stringify(newData, null, 2), (err) => {
                        if (err) {
                            res.writeHead(500);
                            res.end(JSON.stringify({ error: 'DB Write Error' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                        }
                    });
                } catch (e) {
                    res.writeHead(400);
                    res.end(JSON.stringify({ error: 'Invalid JSON' }));
                }
            });
            return;
        }
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            res.writeHead(404);
            res.end('File not found: ' + filePath);
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
}).listen(port);

console.log(`Final Integrated Server running at http://localhost:${port}/`);

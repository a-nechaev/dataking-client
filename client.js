const path = require('path');
const http = require('http');
const { parse } = require('querystring');
const fs = require('fs');
const WebSocket = require('ws');

const DATAKING_SERVER_URL = process.env.DATAKING_SERVER_URL || 'ws://127.0.0.1:8080';
const CLIENT_NAME = process.env.CLIENT_NAME || 'client';

const ws = new WebSocket(DATAKING_SERVER_URL);

ws.on('open', function() {
    ws.send(JSON.stringify({type:'system', event:'connection', data:{"client_name":CLIENT_NAME}}));
});

const APP_HOST = process.env.APP_HOST || '0.0.0.0';
const APP_PORT = process.env.APP_PORT || 3001;


const server = http.createServer((req, res) => {

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'GET' && req.url === '/test.html') {
        fs.readFile(path.join(__dirname, './test.html'), (error, content) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/web.js') {
        fs.readFile(path.join(__dirname, './web.js'), (error, content) => {
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.end(content, 'utf-8');
        });
        return;
    }

    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
            try {
                result = JSON.parse(result);
                if (result && result.type && result.event && result.data) {

                    ws.send(JSON.stringify({type:result.type, event:result.event, data:result.data}));

                    res.write(JSON.stringify({status:'success'}));
                    res.end();
                } else {
                    res.write(JSON.stringify({status:'error'}));
                    res.end();
                }
            } catch (e) {
                res.write(JSON.stringify({status:'error', error:e.message}));
                res.end();
            }
        });
    } else {
        res.write(JSON.stringify({status:'error'}));
        res.end();
    }
});

server.listen(APP_PORT, APP_HOST);

function collectRequestData(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        callback(body);
    });
}
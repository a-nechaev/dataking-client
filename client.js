const http = require('http');
const { parse } = require('querystring');
const WebSocket = require('ws');

const DATAKING_SERVER_URL = process.env.DATAKING_SERVER_URL || 'ws://127.0.0.1:8080';
const CLIENT_NAME = process.env.CLIENT_NAME || 'client';

const ws = new WebSocket(DATAKING_SERVER_URL);

ws.on('open', function open() {
    ws.send(JSON.stringify({type:'system', event:'connection', data:{"client_name":CLIENT_NAME}}));
});

const APP_HOST = process.env.APP_HOST || '0.0.0.0';
const APP_PORT = process.env.APP_PORT || 3001;


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    if (req.method === 'POST') {
        collectRequestData(req, result => {
            console.log(result);
                if (result && result.type && result.event && result.data) {
                    console.log(result.data);
                    try {
                        let data = JSON.parse(result.data.toString());

                        ws.send(JSON.stringify({type:result.type, event:result.event, data:data}));

                        res.write(JSON.stringify({status:'success'}));
                        res.end();
                    } catch (e) {
                        res.write(JSON.stringify({status:'error', error:e.message}));
                        res.end();
                    }
                } else {
                    res.write(JSON.stringify({status:'error'}));
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
        callback(parse(body));
    });
}
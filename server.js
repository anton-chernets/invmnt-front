const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'key', 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'crt', 'invmnt_site.crt'), 'utf8');
const caBundle = fs.readFileSync(path.join(__dirname, 'ssl', 'crt', 'invmnt_site.ca-bundle'), 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: caBundle };

https.createServer(credentials, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
}).on('error', (e) => {
  console.error('Failed to start HTTPS server', e);
});

http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80).on('error', (e) => {
  console.error('Failed to start HTTP server', e);
});

// const express = require('express');
// const https = require('https');
// const fs = require('fs');
// const app = express();

// // Путь к вашим сертификатам и ключу
// const privateKey = fs.readFileSync('ssl/key/key.pem', 'utf8');
// const certificate = fs.readFileSync('ssl/crt/invmnt_site.crt', 'utf8');
// //  цепочка сертификатов в отдельном файле
// const ca = fs.readFileSync('ssl/crt/invmnt_site.ca-bundle', 'utf8');

// const credentials = { key: privateKey, cert: certificate, ca: ca };

// app.use(express.static('build/')); // Служить файлами из папки build, если это SPA на React

// https.createServer(credentials, app).listen(443, () => {
//   console.log('HTTPS Server running on port 443');
// });

// const express = require('express');
// const app = express();
// const https = require('https');
// const fs = require('fs');

// const host = '127.0.0.1';
// const port = 7000;

// https
//     .createServer(
//         {
//             key: fs.readFileSync('ssl/key/key.pem'),
//             cert: fs.readFileSync('ssl/crt/combined.crt'),
//         },
//         app
//     )
//     .listen(port, host, function () {
//         console.log(
//             `Server listens https://${host}:${port}`
//         );
//     });

const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

const privateKey = fs.readFileSync(path.join(__dirname, 'ssl', 'key', 'key.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, 'ssl', 'crt', 'invmnt_site.crt'), 'utf8');
const caBundle = fs.readFileSync(path.join(__dirname, 'ssl', 'crt', 'invmnt_site.ca-bundle'), 'utf8');

const credentials = { key: privateKey, cert: certificate, ca: caBundle };

https.createServer(credentials, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

// Redirect from HTTP to HTTPS
const http = require('http');
http.createServer((req, res) => {
  res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
  res.end();
}).listen(80);

https.createServer(credentials, app).listen(443, () => {
    console.log('HTTPS Server running on port 443');
  }).on('error', (e) => {
    console.error('Failed to start server', e);
  });
  
  http.createServer((req, res) => {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
  }).listen(80).on('error', (e) => {
    console.error('Failed to start HTTP server', e);
  });

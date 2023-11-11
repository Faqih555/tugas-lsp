const http = require('http');
const fs = require('fs');
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  // Membaca path dari URL
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, 'public', url);

  // Membaca file HTML
  fs.readFile(filePath, 'utf8', (err, content) => {
    if (err) {
      // Jika file tidak ditemukan, kirimkan respons 404 Not Found
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found\n');
    } else {
      // Jika file ditemukan, kirimkan respons dengan isi file HTML
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content);
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
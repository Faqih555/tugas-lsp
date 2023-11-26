const http = require("http");
const fs = require("fs");
const querystring = require("querystring");
const path = require("path"); 
const url = require("url");  
const users = require('./user'); // Import array pengguna dari file users.js

const hostname = "127.0.0.1";
const port = 3000;

http.createServer(async (req, res) => {
  const reqUrl = req.url;
  const method = req.method;

  console.log(reqUrl, method);

  if (reqUrl === "/") {
    if (method === 'GET') {
      // Tampilkan halaman login
      fs.readFile(`./public/login.html`, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Error: File not found');
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
        }
        res.end();
      });
    } else if (method === 'POST') {
      // Tangani data login yang dikirim melalui POST
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        const formData = querystring.parse(body);
        const username = formData.name;
        const password = formData.password;

        // Validasi login dengan array pengguna
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
          // Redirect ke halaman home jika login berhasil
          res.writeHead(302, { 'Location': '/home' });
          console.log('login berhasil')
        } else {
          // Redirect kembali ke halaman login jika login gagal
          res.writeHead(302, { 'Location': '/' });
          console.log('login gagal')
        }
        res.end();
      });
    }
  } else if (reqUrl.startsWith("/transaction")) {
    const parsedUrl = url.parse(reqUrl, true);  // Parse URL dengan parameter query
    const { pathname, query } = parsedUrl;

    if (pathname === "/transaction" && method === "GET") {
      // Menampilkan halaman transaksi
      fs.readFile(`./public/transaction.html`, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Error: File not found');
        } else {
          res.writeHead(200, { "Content-Type": "text/html" });
          res.write(data);
        }
        res.end();
      });
    } else {
      res.writeHead(404);
      res.end("Error: Page not found");
    }
  } else if (reqUrl === "/home") {
    fs.readFile(`./public/index.html`, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Error: File not found');
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.write(data);
      }
      res.end();
    });
  } else if (reqUrl === "/image/logo") {
    fs.readFile('./public/assets/logo.png', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Error: File not found");
      } else {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.end(data);
      }
    });
  } else if (reqUrl === "/image/banner") {
    fs.readFile('./public/assets/download.jpeg', (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Error: File not found");
      } else {
        res.writeHead(200, { "Content-Type": "image/jpeg" });
        res.end(data);
      }
    });
  } else {
    res.writeHead(404);
    res.end("Error: Page not found");
  }
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

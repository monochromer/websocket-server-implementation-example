const path = require('path');
const fs = require('fs');
const http = require('http');
const { WebSocketServer } = require('./libs/ws/websocket');

const PORT = 3000;
const clients = new Set();

function sendFile(filePath, res) {
  return fs.createReadStream(path.join(__dirname, 'public', filePath))
    .pipe(res);
}

const httpServer = http.createServer((req, res) => {
  const { method, url } = req;

  switch (true) {
    case (method === 'GET' && url === '/'): {
      res.writeHead(200, {
        'Content-Type': 'text/html'
      });
      sendFile('index.html', res);
      return;
    }

    case (method === 'GET' && url === '/main.js'): {
      res.writeHead(200, {
        'Content-Type': 'text/javascript'
      });
      sendFile('main.js', res);
      return;
    }

    default:
      res.statusCode = 404;
      res.end();
  }
}).listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


const wsServer = new WebSocketServer({
  httpServer
})
  .on('connection', socketClient => {
    clients.add(socketClient);

    socketClient.on('close', (event) => {
      console.log('close: ', event);
      clients.delete(socketClient);
    });

    socketClient.on('error', event => {
      console.error(event);
    });

    socketClient.on('message', message => {
      console.log(message);
      clients.forEach(client => {
        client.write(message);
      });
    })
  })
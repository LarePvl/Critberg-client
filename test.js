const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const net = require('net');

app.use(express.static('testapp'))

function toBuffer(json) {
  return new Buffer.from(JSON.stringify(json));
}

const PORT = process.env.PORT || '6969';
const ADDRESS = process.env.ADDRESS || 'localhost';

io.on('connection', websocket => {
  const socket = new net.Socket();
  socket.connect(PORT, ADDRESS, () => {
    websocket.on('data', data => {
      console.log(data);
      socket.write(toBuffer(data));
    });

    websocket.on('disconnect', () => {
      socket.end(toBuffer({type:'disconnect'}));
    });
  });

  socket.on('data', data => {
    console.log(data.toString());
    for (json of data.toString().split('\n').filter(v=>v!=='').map(JSON.parse)) {
      websocket.emit('data', json);
    }
  });

  socket.on('error', error => {
    console.log(error.code);
    websocket.emit('data', `Error: ${error.code}. Please refresh the page.`);
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
  console.log(`Server in ${ADDRESS}:${PORT}`);
});

const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const net = require('net');

app.use(express.static('testapp'))

function toBuffer(json) {
  return new Buffer.from(JSON.stringify(json));
}

io.on('connection', websocket => {
  console.log('a user connected');

  const socket = new net.Socket();
  socket.connect('6969','localhost', () => {});

  socket.on('data', data => {
    const json = JSON.parse(data.toString());
    websocket.emit('data', json);
  })

  websocket.on('data', data => {
    console.log(data);
    socket.write(toBuffer(data));
  });

  websocket.on('disconnect', () => {
    socket.end(toBuffer({type:'disconnect'}));
  })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

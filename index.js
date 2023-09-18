const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const messageHistory = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
  const userIpAddress = socket.handshake.address;
  console.log(`A user connected from ${userIpAddress}`);

  // Send the last 100 messages to the newly connected client.
  socket.emit('load previous messages', messageHistory);

  socket.on('chat message', (msg) => {
    messageHistory.push(msg);
    // Keep only the last 100 messages.
    if (messageHistory.length > 100) {
      messageHistory.shift();
    }
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected from ${userIpAddress}`);
  });
});

http.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

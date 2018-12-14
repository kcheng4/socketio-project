const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const publicPath = path.join(__dirname,'../public');

var port = process.env.PORT || 3000;
var app = express();

var server =http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User connected');

  socket.emit('newMessage',{
    from:"Javier",
    text:"slam it down someee",
    createdAt:123
  });

  socket.on('createMessage',(data) => {
    console.log(data);
  });

  socket.on('disconnect',() => {
    console.log('Disconnected from server');
  });
});


server.listen(port,() => {
  console.log(`Server is up and running on port ${port}`);
});

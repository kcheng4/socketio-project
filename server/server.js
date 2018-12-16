const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage} = require('./utils/message')
const publicPath = path.join(__dirname,'../public');

var port = process.env.PORT || 3000;
var app = express();

var server =http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User connected');

  // socket.emit('newMessage',{
  //   from:"Javier",
  //   text:"slam it down someee",
  //   createdAt:123
  // });
  socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage',(data, callback) => {
    console.log(data);
    // io.emit('newMessage',{
    //   from:data.from,
    //   text:data.text,
    //   createdAt:new Date().getTime()
    // });
    io.emit('newMessage', generateMessage(data.from,data.text));
    callback('This is from the server');
  });

  socket.on('disconnect',() => {
    console.log('Disconnected from server');
  });
});


server.listen(port,() => {
  console.log(`Server is up and running on port ${port}`);
});

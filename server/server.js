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

  // socket.emit('newMessage',{
  //   from:"Javier",
  //   text:"slam it down someee",
  //   createdAt:123
  // });
  socket.emit('newMessage', {
    from:'admin',
    text:'Welcs'
  });

  socket.broadcast.emit('newMessage',{
    from:'admin',
    text:'New user joined',
    createdAt:new Date().getTime()
  });

  socket.on('createMessage',(data) => {
    console.log(data);
    // io.emit('newMessage',{
    //   from:data.from,
    //   text:data.text,
    //   createdAt:new Date().getTime()
    // });
    socket.broadcast.emit('newMessage',{
      from: data.from,
      text: data.text,
      createdAt: new Date().getTime()
    });
  });

  socket.on('disconnect',() => {
    console.log('Disconnected from server');
  });
});


server.listen(port,() => {
  console.log(`Server is up and running on port ${port}`);
});

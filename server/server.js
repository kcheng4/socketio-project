const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/Users');

const publicPath = path.join(__dirname,'../public');

var port = process.env.PORT || 3000;
var app = express();

var server =http.createServer(app);
var io = socketIO(server);

var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User connected');

  // socket.emit('newMessage',{
  //   from:"Javier",
  //   text:"slam it down someee",
  //   createdAt:123
  // });


  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)){
      return callback('Name and Room Name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);
    io.to(params.room).emit('updateUserList',users.getUserList(params.room));
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to chat'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
    callback();
  });


  socket.on('createMessage',(data, callback) => {
    var user = users.getUser(socket.id);
    console.log(user[0].name);
    if (user && isRealString(data.text)){
        io.to(user[0].room).emit('newMessage', generateMessage(user[0].name, data.text));
    }

    callback();
  });

  socket.on('createLocationMessage',(data) => {
    var user = users.getUser(socket.id);

    if (user){
        io.to(user[0].room).emit('newLocationMessage',generateLocationMessage(user[0].name, data.latitude, data.longitude));
    }
  });

  socket.on('disconnect',() => {
    console.log('Disconnected from server');

    var user = users.removeUser(socket.id);

    if (user){
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });
});


server.listen(port,() => {
  console.log(`Server is up and running on port ${port}`);
});

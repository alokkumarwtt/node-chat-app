const path = require('path');
const http = require('http');
const _=require('lodash');
const express = require('express');
const socketIO = require('socket.io');
const {isRealString} = require('./utils/validation.js');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const {Users}=require('./utils/users')
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users=new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');


 
   socket.on('join', (params, callback) => {

    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.');
    }

    socket.join(params.room);
    
    var dup=params.name;
    users.removeUser(socket.id);
    socket.emit('dropdown', generateMessage('Admin',params.room));
    var y=users.getUserList(params.room);
    match = false;
    for(i=0; i<y.length;i++){
    if(dup==(y[i])){
        var i
        match = true;
     }
}  
 if (match){
     callback('User Already Connected');
      
       } else {
           users.addUser(socket.id, params.name, params.room);
         io.to(params.room).emit('updateUserList', users.getUserList(params.room));
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined.`));
       callback()
      }
  

 
  });
  socket.on('createMessage', (message, callback) => {
    var user=users.getUser(socket.id)
    if(user && isRealString(message.text)){
        var myString = message.text;
       console.log(myString)
    //var res = myString.match(/CAD-10/g);
      var substr=myString.substring(0,3);
    var substr1=myString.substring(4,6);
    console.log(substr);
    console.log(substr1);
    if(substr=="CAD"){
    io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }else{
     io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
     callback('This is from the server.');
    }
    }
  

});

  socket.on('createLocationMessage', (coords) => {
    var user=users.getUser(socket.id);

    io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
  });

 
      socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
    }
  });

});
app.use(express.static(publicPath))
server.listen(3000,()=>{
 console.log('Server started on port no 3000')
})



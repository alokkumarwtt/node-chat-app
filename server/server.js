const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'));

  socket.on('createMessage', (message, callback) => {

    console.log('createMessage', message);
    var myString = message.text;
    console.log(myString)
    //var res = myString.match(/CAD-10/g);
      var substr=myString.substring(0,3);
    var substr1=myString.substring(4,6);
    console.log(substr);
    console.log(substr1);
    if(substr=="CAD"){
    io.emit('newMessage', generateMessage(message.from, message.text));
    }else{
     io.emit('newMessage', generateMessage(message.from, message.text));
     callback('This is from the server.');
    }

    
   
    
    
  });

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.latitude, coords.longitude));
  });

  socket.on('disconnect', () => {
    console.log('User was disconnected');
  });
});
app.use(express.static(publicPath))
server.listen(3000,()=>{
 console.log('Server started on port no 3000')
})



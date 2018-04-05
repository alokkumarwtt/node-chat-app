const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');
const {generateMessage}=require('./utils/message')

const publicPath=path.join(__dirname,'../public')
var app=express()

var server=http.createServer(app);
var io=socketIO(server);

io.on('connection',(socket)=>{
	console.log('new user connected')
	socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'))
	socket.broadcast.emit('newMessage',generateMessage('Admin','New user connected'))
    
    socket.on('disconnect',()=>{
		console.log('User Dissonnected')
	})
	
   socket.on('createMessage',(message,callback)=>{
         console.log(message)
         io.emit('newMessage',generateMessage(message.from,message.text))
         callback('Message Receved by the server');
         // socket.broadcast.emit('newMessage',{
         // 	from:message.from,
         // 	text:message.text,
         // 	createdAt:new Date().getTime()
         // })
    })
})

app.use(express.static(publicPath))
server.listen(3000,()=>{
 console.log('Server started on port no 3000')
})
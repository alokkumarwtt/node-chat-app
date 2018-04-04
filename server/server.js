const path=require('path');
const express=require('express');
const http=require('http');
const socketIO=require('socket.io');

const publicPath=path.join(__dirname,'../public')
var app=express()

var server=http.createServer(app);
var io=socketIO(server);

io.on('connection',(socket)=>{
	console.log('new user connected')
	socket.on('disconnect',()=>{
		console.log('User Dissonnected')
	})
	socket.emit('newMessage',{
		From:'Mona',
		text:'Hi alok how are you??'
	})
   socket.on('createMessage',(message)=>{
         console.log(message)
    })

	
})

app.use(express.static(publicPath))
server.listen(3000,()=>{
 console.log('Server started on port no 3000')
})
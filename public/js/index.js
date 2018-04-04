	var socket=io();
	socket.on('connect',()=>{
		console.log('connect to server')
		socket.emit('createMessage',{
			to:'mona@gmail.com',
			text:'Yeah i am fine mona..you?'
		})
    })
	socket.on('disconnect',()=>{
		console.log('connect to server')
	})
	socket.on('newMessage',(newmessage)=>{
		console.log(newmessage)
    })
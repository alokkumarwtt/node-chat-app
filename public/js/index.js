	var socket=io();
	socket.on('connect',()=>{
		console.log('connect to server')
		
    })
	socket.on('disconnect',()=>{
		console.log('connect to server')
	})
	socket.on('newMessage',(newmessage)=>{
		console.log(newmessage)
		var li = jQuery('<li></li>');
        li.text(`${newmessage.from}: ${newmessage.text}`);
        jQuery('#messages').append(li);
    })
  

   $(document).ready(function(){
  jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  })
}); 	

});

 
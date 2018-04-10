	var socket=io();
  function scrollToBottom () {
  
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child')
 
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}
socket.on('connect', function () {
  var params= jQuery.deparam(window.location.search);
  var x=params.room;
  var y=x.toUpperCase();
  params.room=y;

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log('No error');
    }
  });
});
	socket.on('disconnect',()=>{
		console.log('connect to server')
	})

 socket.on('updateUserList', function (users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});
socket.on('dropdown',(newmessage)=>{
 console.log(newmessage.text)
  // var option = jQuery('<option></option>');
        //option.text(`${newmessage.text}`);
          //jQuery('#messages123').append(option);


        
});
  
	socket.on('newMessage',(newmessage)=>{
    // var myString=newmessage.text;
    var formattedTime=moment(newmessage.createdAt).format('h:mm a')
    var mymsg=newmessage.text;
    var msg=mymsg.substring(0,3);
     var number=mymsg.substring(4,10);
     if(msg=="CAD"){
     
    var fbUrl=`http://api.fixer.io/latest?base=${msg}`
     console.log(number)
    $.ajax({        
    url: fbUrl ,
    type: 'GET',
    success: function (resp) {
        var usd=resp.rates.USD;
             console.log(typeof(usd))
        var x = Number(number)
        console.log(x)
        var value=usd*x;
        console.log(value)
        var template=jQuery('#message-template').html()
        var html=Mustache.render(template,{
          text:`USD-${value}`,
          from:newmessage.from,
          createdAt:formattedTime
        });
        jQuery('#messages').append(html)
        scrollToBottom ()
        // var li = jQuery('<li></li>');
        // li.text(`${newmessage.from}: ${formattedTime} USD- ${value}`);
        //   jQuery('#messages').append(li);
    },
    error: function(e){
        console.log('Error: '+e);
    }
     
});
}else{
    var template=jQuery('#message-template').html()
        var html=Mustache.render(template,{
          text:newmessage.text,
          from:newmessage.from,
          createdAt:formattedTime
        });
        jQuery('#messages').append(html)
        scrollToBottom ()
   // var template=jQuery('#message-template').html()
   //      var html=Mustache.render(template);
   //      jQuery('#messages').append(html)
}
})
    socket.on('newLocationMessage', function (message) {
     var formattedTime=moment(message.createdAt).format('h:mm a')
     console.log(message)
      var template=jQuery('#location-message-template').html()
        var html=Mustache.render(template,{
         url:message.url,
          from:message.from,
          createdAt:formattedTime
        });
        jQuery('#messages').append(html)
           scrollToBottom ()
    //  var li = jQuery('<li></li>');
    // var a = jQuery('<a target="_blank">My current location</a>');
 
    // li.text(`${message.from}: ${formattedTime}`);
    // a.attr('href', message.url);
    // li.append(a);
    // jQuery('#messages').append(li);
});
  $(document).ready(function(){
  jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var messageTextBox=jQuery('[name=message]')
 

  socket.emit('createMessage', {
  
    text: messageTextBox.val()
  }, function () {
    messageTextBox.val('')
  })
}); 
var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }
  locationButton.attr('disabled','disabled').text('Sending location.....')
  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send location')

    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  },function () {
    //locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location.');
  });
});
});
 
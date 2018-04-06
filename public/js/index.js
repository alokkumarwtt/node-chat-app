	var socket=io();
	socket.on('connect',()=>{
		console.log('connect to server')
		
    })
	socket.on('disconnect',()=>{
		console.log('connect to server')
	})
	socket.on('newMessage',(newmessage)=>{
    // var myString=newmessage.text;
    var mymsg=newmessage.text;
    var msg=mymsg.substring(0,3);
     var number=mymsg.substring(4,10);
  
  
    if(msg=="CAD"){
       //console.log(newmessage.url);
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
        var li = jQuery('<li></li>');
        li.text(`${newmessage.from}:  USD- ${value}`);
          jQuery('#messages').append(li);
    },
    error: function(e){
        console.log('Error: '+e);
    }
     
});
 
   

    }else{

 var li = jQuery('<li></li>');
          li.text(`${newmessage.from}: ${newmessage.text}`);
          jQuery('#messages').append(li);

    }
	     

   //  var myString = newmessage.text;
   //  console.log(myString)
   //  //var res = myString.match(/CAD-10/g);
   //    var substr=myString.substring(0,3);
   //  var substr1=myString.substring(4,6);

   //  console.log(substr*10);
   // if( substr=="CAD"){
   //   var li = jQuery('<li></li>');
   //      li.text(`${newmessage.from}:USD ${substr1*1.2772}`);
   //      jQuery('#messages').append(li);
   //  }else{
         
   // }
    
     
    
// var parts = myString.split("Half");
// var thePart = parts[0];

    })
    socket.on('newLocationMessage', function (message) {
      console.log(message)
    var li = jQuery('<li></li>');
    var a = jQuery('<a target="_blank">My current location</a>');

    li.text(`${message.from}: `);
    a.attr('href', message.url);
    li.append(a);
    jQuery('#messages').append(li);
});
  

   $(document).ready(function(){
  jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  socket.emit('createMessage', {
    from: 'User',
    text: jQuery('[name=message]').val()
  }, function () {

  })
}); 

var locationButton = jQuery('#send-location');
locationButton.on('click', function () {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function (position) {
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function () {
    alert('Unable to fetch location.');
  });
});
});
 
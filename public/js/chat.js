var socket = io();

function scrollToBottom() {
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();
  console.log(newMessage);
  console.log(clientHeight);
  console.log(scrollTop);
  console.log(scrollHeight);
  console.log(newMessageHeight);
  console.log(lastMessageHeight);



  if (clientHeight+scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}
socket.on('connect',function() {
  console.log('Connected to server');

  // socket.emit('createMessage',{
  //   from:"Andrew",
  //   text:"Suck a dick"
  // });
});

socket.on('disconnect',function() {
  console.log('Disconnected from server');
});

socket.on('newMessage',function(data){
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text:data.text,
    from:data.from,
    createdAt: moment(data.createdAt).format('h:mm A')
  });

  jQuery('#messages').append(html);
  scrollToBottom();

  // console.log(data);
  // var formattedTime = moment(data.createdAt).format('h:mm A');
  // var li = jQuery('<li></li>');
  // li.text(`${formattedTime}-- ${data.from}:${data.text}`);
  // jQuery('#messages').append(li);
});

socket.on('newLocationMessage',(data) => {
  var template = jQuery('#location-template').html();
  var html = Mustache.render(template,{
    text:data.text,
    from:data.from,
    createdAt: moment(data.createdAt).format('h:mm A')
  });
  // var formattedTime = moment(data.createdAt).format('h:mm A');
  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My current location</a>');
  // li.text(`${formattedTime}-- ${data.from}: `);
  // a.attr('href',data.url);
  // li.append(a);
  jQuery('#messages').append(html);
  scrollToBottom();
});
jQuery('#message-form').on('submit',function(e){
  e.preventDefault();
  var message=jQuery('[name=message]');
  socket.emit('createMessage',{
    from:'User',
    text: message.val()
  }, function(data){
    message.val('');
  });
});

var locationButton = jQuery('#send-location');
locationButton.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser');
  }
  locationButton.attr('disabled','disabled').text('Sending location...');

  navigator.geolocation.getCurrentPosition(function(position){
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocationMessage',{
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
      });
  }, function(error) {
    locationButton.removeAttr('disabled').text('Send Location');
  });
});

/*
 * Client-side JS
 */

var socket = io();
//if using websockets
//var socket = io.connect('http://muddy-ksami.rhcloud.com:8000');
var socketid;
var nick;

//==========================
// Trigger events on server
//==========================

// When user logs in
$('#login').submit(function(){
  var username = $('#username').val();
  var password = $('#password').val();
  $('#password').val('');
  
  socket.emit('command', {'username': username, 'password': password});

  return false;
});

$(window).on('beforeunload', function(){
  socket.emit('dc');
  console.log('dc');
});

//==============================================
// Event handlers for events triggered by server
//==============================================
socket.on('servershutdown' ,function(){
  alert('server restarting');
  document.location.href = '/';
});

socket.on('socketid', function(id){
  socketid = id;
  //$('#data').text(socketid);
});

socket.on('data', function(data){
  console.dir(data);
  for (var i = data.length - 1; i >= 0; i--) {
    //var str = JSON.stringify(data[i], null, 2);
    //console.log(str);
    var txt = data[i].text;
    txt = twemoji.parse(txt);
    var pic = '<img src="' + data[i].user.profile_image_url + '">';
    var tweet = '<div style="position: relative">';
    var bg = '<div class="bg" style="background-image: ' + 'url(\'' + data[i].user.profile_background_image_url + '\')"></div>';
    var name = data[i].user.name;
    var screenName = data[i].user.screen_name;
    var timestamp = data[i].created_at;
    var str = tweet + pic + bg + '<div class="tweet">' + txt + '<br />' + '- ' + name + ' (@' + screenName + ') at ' + timestamp +'</div><br /><br />';
    $('#data').append(str);
  }
});
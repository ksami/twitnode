/*
 * Server-side JS - Main file
 */

// Environment configurables
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var _fileindex = __dirname + '/public/index.html';

// Dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//var fs = require('fs');
app.use(express.static(__dirname + '/public'));


// Globals
var twit = require('twit');
var keys = require(__dirname + '/.private/keys');
var twitter = new twit(keys);

// Listen to <port>
http.listen(port, ipaddress, function(){
    console.log('listening on ' + ipaddress + ':' + port);
});

// Route handler
app.get('/',function(req, res){
    res.sendfile(_fileindex);
});


//=========
// Session
//=========
io.on('connection', function(socket){


    // When user first connects
    socket.join(socket.id);
    console.log('user ' + socket.id + ' connected');
    io.to(socket.id).emit('socketid', socket.id);

    twitter.get('search/tweets', { q: 'banana since:2011-11-11', count: 100 }, function(err, data, response) {
      io.to(socket.id).emit('data', data.statuses);
      //console.log(response);
      //console.dir(data.statuses);
    });


    //==============================================
    // Event handlers for events triggered by client
    //==============================================

    // Save user data on disconnect
    socket.on('dc', function() {
        console.log('user ' + socket.id + ' disconnected');
    });

    // Any other input, echo back
    socket.on('command', function(msg){
        console.log('user ' + socket.id + ' sent:');
        console.dir(msg);
        
        //var searchterm = msg.username;
    });

});
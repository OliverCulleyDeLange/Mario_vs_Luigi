var path = require('path');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var availableRooms = [];
var gamePairs = [];
function printRooms(){
  console.log('_____________________________________');
  console.log('available rooms : ' + availableRooms);
  console.log('     game pairs : ' + gamePairs);
  console.log('-------------------------------------');
};

io.on('connection', function(socket){

  socket.on('get rooms', function() {
    // console.log('room request from ' + socket.id);
    socket.emit('available rooms', availableRooms);
  })

  socket.on('mario start', function() {
    console.log('Mario started a game, adding room ' + socket.id);
    availableRooms.push(socket.id);
    printRooms();
  })

  socket.on('luigi join', function(room) {
  	console.log('Luigi joined mario in room ' + room);
    var index = availableRooms.indexOf(room);
    if (index > -1) {
      var marioRoom = availableRooms.splice(index, 1);
      var luigiSocket = socket.id;
      gamePairs.push([marioRoom, luigiSocket]);
    }
    printRooms();
    socket.broadcast.to(room).emit('luigi enter');
  })

  socket.on('disconnect', function(){
    var room = socket.id;
    var index;
    for (var i = gamePairs.length - 1; i >= 0; i--) {
         if (gamePairs[i][0] == room) {
          var luigiRoom = gamePairs[i][1];
          console.log('a mario disconnected, luigis room ' + luigiRoom + ' becomes free to join');
          availableRooms.push(luigiRoom);
          index = i;
        } else if (gamePairs[i][1] == room) {
          var marioRoom = gamePairs[i][0];
          console.log('a luigi disconnected, marios room ' + marioRoom + ' becomes free again');
          availableRooms.push(marioRoom);
          index = i;
        }
    };
    gamePairs.splice(index, 1);
    printRooms();
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
mvl.socketio = {
    init: function() {
        if (typeof mvl.socket === 'undefined' || !mvl.socket) {
//            mvl.socket = io('http://localhost:3000');
            mvl.socket = io('https://mvl.herokuapp.com');

            mvl.socket.on('available rooms', function(rooms) {
                console.log("got available rooms:" + rooms);
                mvl.menu.setWaitingRooms(rooms);
            });

            mvl.socket.on('luigi enter', function(luigi) {
                console.log("luigi has entered");
                mvl.actions.createLuigi(false);
            });

            mvl.socket.on('partner move', function(playerPosition) {
            //            console.log('Partner moved to ' + JSON.stringify(playerPosition));
                mvl.players.opponent.position = playerPosition.position;
                mvl.players.opponent.faceDir = playerPosition.faceDir;
                mvl.players.opponent.runState = playerPosition.runState;
                mvl.players.opponent.walkCycle = playerPosition.walkCycle;
                mvl.players.opponent.velocity = playerPosition.velocity;
                mvl.players.opponent.onGround = playerPosition.onGround;
            });

            mvl.socket.on('partner bullets', function(bulletPositions) {
            //            console.log('Partner is shooting ' + JSON.stringify(bulletPositions));
                mvl.players.opponent.bullets = [];
                bulletPositions.forEach(function(bullet) {
                    var b = new Bullet(bullet.position, bullet.direction);
                    mvl.players.opponent.bullets.push(b);
                })
            });

            mvl.socket.on('partner exit', function() {
                console.log("Partner has left the game")
                mvl.actions.gameOver();
            });
        }
    }
}
mvl.socketio = {
    init: function() {
        if (typeof mvl.socket === 'undefined' || !mvl.socket) {
//            mvl.socket = io('http://localhost:3000');
            mvl.socket = io('https://mvl.herokuapp.com');

            mvl.socket.on('available rooms', function(rooms) {
                console.log("got available rooms:" + JSON.stringify(rooms));
                mvl.menu.setWaitingRooms(rooms);
            });

            mvl.socket.on('luigi enter', function(luigi) {
                console.log("luigi has entered");
                mvl.players.opponent = new Player("luigi", {x: innerWidth*0.9, y: innerHeight*0.25}, mvl.keyMaps.luigi, false);
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

            mvl.socket.on('die', function() {
                console.log("You got shot, oops.")
                mvl.players.me.kill();
            });
        }
    }
}
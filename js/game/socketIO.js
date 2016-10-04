function initSocketIO() {
    socket = io('http://localhost:3000');

    socket.on('available rooms', function(rooms) {
        console.log("got available rooms:" + rooms);
        setWaitingRooms(rooms);
    });

    socket.on('luigi enter', function(luigi) {
        console.log("luigi has entered");
        createLuigi(false);
    });

    socket.on('partner move', function(playerPosition) {
    //            console.log('Partner moved to ' + JSON.stringify(playerPosition));
        players.opponent.pos = playerPosition.pos;
        players.opponent.faceDir = playerPosition.faceDir;
        players.opponent.runState = playerPosition.runState;
        players.opponent.walkCycle = playerPosition.walkCycle;
        players.opponent.velocity = playerPosition.velocity;
        players.opponent.onGround = playerPosition.onGround;
    });

    socket.on('partner bullets', function(bulletPositions) {
    //            console.log('Partner is shooting ' + JSON.stringify(bulletPositions));
        players.opponent.bullets = [];
        bulletPositions.forEach(function(bullet) {
            var b = new Bullet(bullet.pos, bullet.direction);
            players.opponent.bullets.push(b);
        })
    });

    socket.on('partner exit', function() {
        console.log("Partner has left the game")
        gameOver();
    });
}
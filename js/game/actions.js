mvl.actions = {
    startGame: function() {
        mvl.players.me = new Player("mario", {x: innerWidth*0.1, y: innerHeight*0.25}, mvl.keyMaps.mario, true);

        if (mvl.state.onlinePlay) {
            console.log('mario start - telling server an open game has begun');
            mvl.socket.emit('mario start');
        }
    
        if (!mvl.state.onlinePlay && mvl.state.twoPlayer) {
            mvl.players.opponent = new Player("luigi", {x: innerWidth*0.9, y: innerHeight*0.25}, mvl.keyMaps.luigi, true);
        }
    
        mvl.actions.begin();
    },
    
    joinGame: function(evt) {
        var gameRoom = evt.target.getAttribute('data-room');
        console.log("Joining game " + gameRoom);
        mvl.players.me = new Player("luigi", {x: innerWidth*0.9, y: innerHeight*0.25}, mvl.keyMaps.luigi, true);
        mvl.players.opponent = new Player("mario", {x: innerWidth*0.1, y: innerHeight*0.25}, mvl.keyMaps.mario, false);
        mvl.socket.emit('luigi join', gameRoom);
    
        mvl.actions.begin();
    },
    
    begin: function() {
        mvl.menu.hideGameMenu();
        mvl.map = new Map();
        mvl.map.draw();
        mvl.state.isGameOver = false;
        mvl.state.running = true;
        mvl.state.lastTime = Date.now();
        mvl.game.main();
    },
    
    gameOver: function() {
        mvl.state.isGameOver = true;
        mvl.menu.showGameOver();
        mvl.menu.showGameOverOverlay();
    },
    
    reset: function() {
        mvl.menu.hideGameOver();
        mvl.menu.hideGameOverOverlay();
        mvl.menu.showGameMenu();
    },
    
    resume: function() {
        mvl.menu.hidePause();
        mvl.menu.hideGameOverOverlay();
        mvl.state.running = true;
        mvl.state.lastTime = Date.now();

        mvl.game.main();
    }
}

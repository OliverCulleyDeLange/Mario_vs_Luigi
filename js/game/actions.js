mvl.actions = {
    startGame: function() {
        mvl.actions.createMario(true);
        if (mvl.state.onlinePlay) {
            console.log('mario start - telling server an open game has begun');
            mvl.socket.emit('mario start');
        }
    
        if (!mvl.state.onlinePlay && mvl.state.twoPlayer) {
            mvl.actions.createLuigi(true);
        }
    
        mvl.actions.begin();
    },
    
    joinGame: function(evt) {
        var gameRoom = evt.target.getAttribute('data-room');
        console.log("Joining game " + gameRoom);
        mvl.actions.createMario(false);
        mvl.actions.createLuigi(true);
        mvl.socket.emit('luigi join', gameRoom);
    
        mvl.actions.begin();
    },
    
    begin: function() {
        mvl.map = new Map();
        mvl.map.draw();
        mvl.state.isGameOver = false;
        mvl.state.running = true;
        mvl.menu.hideGameMenu();
        mvl.state.lastTime = Date.now();
        mvl.game.main();
    },
    
    gameOver: function() {
        document.getElementById('game-over').style.display = 'block';
        document.getElementById('game-over-overlay').style.display = 'block';
        mvl.state.isGameOver = true;
    },
    
    reset: function() {
        document.getElementById('game-over').style.display = 'none';
        document.getElementById('game-over-overlay').style.display = 'none';
        mvl.menu.showGameMenu();
    },
    
    resume: function() {
        mvl.state.running = true;
        mvl.state.lastTime = Date.now();

        mvl.game.main();

        document.getElementById('resume').style.display = "none";
        document.getElementById('game-over-overlay').style.display = "none";
    },
    
    createMario: function(controlable) {
        var marioKeyMap = {
            up: 'W', 
            left: 'A', 
            down: 'S', 
            right: 'D', 
            shoot: 'BSLASH', 
            sheild:'SHIFT', 
            pickup: 'Z'
        };
        var mario = new Player("mario", {x: innerWidth*0.1, y: innerHeight*0.25}, marioKeyMap, controlable);
        if (controlable) {
            mvl.players.me = mario
        } else {
            mvl.players.opponent = mario
        }
    },
    
    createLuigi: function(controlable) {
        var luigiKeyMap = {
            up: 'UP',
            left: 'LEFT',
            down:'DOWN',
            right: 'RIGHT',
            shoot: 'PERIOD',
            sheild: 'COMMA',
            pickup: 'FSLASH'
        };
        var luigi = new Player("luigi", {x: innerWidth*0.9, y: innerHeight*0.25}, luigiKeyMap, controlable);
        if (controlable && mvl.state.onlinePlay) {
            mvl.players.me = luigi
        } else {
            mvl.players.opponent = luigi
        }
    }
}

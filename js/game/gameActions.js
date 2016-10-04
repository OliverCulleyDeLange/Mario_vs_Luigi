function startGame() {
    createMario(true);
    if (onlinePlay) {
        console.log('mario start - telling server an open game has begun');
        socket.emit('mario start');
    }

    if (!onlinePlay && twoPlayer) {
        createLuigi(true);
    }

    begin();
};

function joinGame(evt) {       
    var gameRoom = evt.target.getAttribute('data-room');
    console.log("Joining game " + gameRoom);
    createMario(false);
    createLuigi(true);
    socket.emit('luigi join', gameRoom);

    begin();
};

function begin() {
    drawMap();
    isGameOver = false;
    running = true;
    hideGameMenu();
    lastTime = Date.now();
    main();
};

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
};

function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    showGameMenu()
};

function resume() {
    running = true;
    lastTime = Date.now();
    main();
    document.getElementById('resume').style.display = "none";
    document.getElementById('game-over-overlay').style.display = "none";
};


function createMario(controlable) {
    var marioKeyMap = {
        up: 'W', 
        left: 'A', 
        down: 'S', 
        right: 'D', 
        shoot: 'BSLASH', 
        sheild:'SHIFT', 
        pickup: 'Z'
    };
    var mario = new player("mario", {x: innerWidth*0.1, y: innerHeight*0.25}, marioKeyMap, controlable);
    if (controlable) {
        players.me = mario
    } else {
        players.opponent = mario
    }
};

function createLuigi(controlable) {    
        var luigiKeyMap = {
            up: 'UP', 
            left: 'LEFT', 
            down:'DOWN', 
            right: 'RIGHT', 
            shoot: 'PERIOD', 
            sheild: 'COMMA', 
            pickup: 'FSLASH'
        };
        var luigi = new player("luigi", {x: innerWidth*0.9, y: innerHeight*0.25}, luigiKeyMap, controlable);
        if (controlable && onlinePlay) {
            players.me = luigi
        } else {
            players.opponent = luigi
        }
};




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
    //document.getElementById('game-setup').style.display = 'none';
    isGameOver = false;
    gameTime = 0;

    bullets = [];

    mario.pos = [canvas.width * 0.1, canvas.height / 3];
    if(twoPlayer) luigi.pos = [canvas.width * 0.9, canvas.height / 3];
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
    var mario = new player("mario", [innerWidth*0.1,innerHeight*0.25], marioKeyMap, controlable);
    players.push(mario);
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
        var luigi = new player("luigi", [innerWidth*0.9,innerHeight*0.25], luigiKeyMap, controlable);
        players.push(luigi);
};




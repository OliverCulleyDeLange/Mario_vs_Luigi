function createCanvas() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    ctx.fillStyle = '#333';
    terrainPattern = ctx.fillRect(0,0,canvas.width,canvas.height);
};

function setupButtonEventListeners() {
    document.getElementById('play-reset').addEventListener('click', reset);
    document.getElementById('resume').addEventListener('click', resume);
    document.getElementById('play').addEventListener('click', play);
    document.getElementById('onePlayer').addEventListener('click', setOnePlayer);
    document.getElementById('twoPlayer').addEventListener('click', setTwoPlayer);
    document.getElementById('localPlay').addEventListener('click', setLocalPlay);
    document.getElementById('onlinePlay').addEventListener('click', setOnlinePlay);
};
// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
function getAnimationFrame() {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
}

// Game over
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

function play() {
    running = true;
    hideGameMenu();
    createPlayers();
    drawMap();
    lastTime = Date.now();

    if (onlinePlay) {
        //connect('ws://' + window.location.host + '/Mario_vs_Luigi/');
        connect('ws://localhost:4444');
    } else {
        main();
    }
};

function hideGameMenu() {
    document.getElementById('game-setup').style.display = "none";
};

function createPlayers() {
    var marioKeyMap = {
        up: 'W', 
        left: 'A', 
        down: 'S', 
        right: 'D', 
        shoot: 'BSLASH', 
        sheild:'SHIFT', 
        pickup: 'Z'
    };
    var mario = new player([innerWidth*0.1,innerHeight*0.25], marioKeyMap);
    players.push(mario);
    if(twoPlayer) {
        var luigiKeyMap = {
            up: 'UP', 
            left: 'LEFT', 
            down:'DOWN', 
            right: 'RIGHT', 
            shoot: 'PERIOD', 
            sheild: 'COMMA', 
            pickup: 'FSLASH'
        };
        var luigi = new player([innerWidth*0.9,innerHeight*0.25], luigiKeyMap);
        players.push(luigi);
    }
};

function setOnePlayer() {
    document.getElementById('onePlayer').className += ' button-selected';
    document.getElementById('twoPlayer').className = 'button-link';
    twoPlayer = false;
};

function setTwoPlayer() {
    document.getElementById('twoPlayer').className += ' button-selected';
    document.getElementById('onePlayer').className = 'button-link';
    twoPlayer = true;
};
      
function setLocalPlay() {
    document.getElementById('localPlay').className += ' button-selected';
//        document.getElementById('onlinePlay').className = 'button-link'; //TODO uncomment when Multiplayer wokring
    onlinePlay = false;
}

function setOnlinePlay() {
    document.getElementById('onlinePlay').className += ' button-selected';
    document.getElementById('localPlay').className = 'button-link';
    onlinePlay = true;
}

//window.addEventListener('blur', function() {
//    if(document.getElementById('game-setup').style.display == "none") {
//        running = false;
//        document.getElementById('resume').style.display = "block";
//        document.getElementById('game-over-overlay').style.display = "block";
//    }
//});
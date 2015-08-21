/*
 *  M_vs_L
 *  Two player 2D Mario influenced shooter
 *  Basic arrow key interaction (Up (Jump), Left, Right, Down (Drop))
 *  Control character on screen - Kill enemies and other player if 2 player
 *  Score points for kills, more points for killing opponent 
 *  Wider than screen maps (Bigger screens at advantage)
 *  Health Bar | Sheild Bar | Score board
 *  
 *  Phase 2: 
 *  Add Mario Map with scrolling
 *  
 *  Phase 3:
 *  Second local player addition - Allows two players to play on one machine
 *  WASD & Shift & |\ & Z = Player 1
 *  Arrows & ,< & .> & /? = Player 2
 *  Bullet collision detection & death animation
 *  
 *  Phase 4:
 *  Addition of two player online - Node.js?
 *  
 *  TODO:
 *  Do colision detection only in area around thing being checked.
 */
// Game state
var running = false;
var onlinePlay = false;
var twoPlayer = false;
var socket = null;
var players = [];
var playerSpeed = 500;
var bulletSpeed = 275;
var bullets = [];

var gameTime = 0;
var isGameOver;
var terrainPattern;

var requestAnimFrame = getAnimationFrame();

createCanvas();

resources.load([
    'img/ML.png',
    'img/terrain.png'
]);
resources.onReady(setupButtonEventListeners);

function setupButtonEventListeners() {
    document.getElementById('play-reset').addEventListener('click', reset);
    document.getElementById('resume').addEventListener('click', resume);
    document.getElementById('play').addEventListener('click', startGame);
    document.getElementById('onePlayer').addEventListener('click', setOnePlayer);
    document.getElementById('twoPlayer').addEventListener('click', setTwoPlayer);
    document.getElementById('localPlay').addEventListener('click', setLocalPlay);
    document.getElementById('onlinePlay').addEventListener('click', setOnlinePlay);
    // window.addEventListener('blur', function() {
    // if(document.getElementById('game-setup').style.display == "none") {
    //    running = false;
    //    document.getElementById('resume').style.display = "block";
    //    document.getElementById('game-over-overlay').style.display = "block";
    // }
    // });
};

function main() {
    if(!running) return;
        
    var now = Date.now();
//    dt = (now - lastTime) / 1000.0; // dt is number of seconds passed since last update
      dt = 0.05;
    update();
    render();

    lastTime = now;
    requestAnimFrame(main);
    //console.log("Game Frame");
};

function update() {
    gameTime += dt;
    
    for ( var i = 0; i<players.length; i++) {
        var player = players[i];
        
        player.setDefaultValues();
        player.handleInput();
        player.updateXVelocity();
        player.updateYVelocity();
        player.updatePosition();

        player.checkBounds();
        player.setWalkAnimation();
        
        if(player.shoot && Date.now() - player.lastFire > 500) {
            player.fireGun();
        }
    }
    
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];
        bullet.move();
        bullet.doCollisionDetection();
    }
};

function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(!isGameOver) {
        renderEntities(players);
        renderEntities(bullets);
        renderEntities(cubes);
    };
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }
};

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx, entity.runState);
    ctx.restore();
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
};

function createCanvas() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    ctx.fillStyle = '#333';
    terrainPattern = ctx.fillRect(0,0,canvas.width,canvas.height);
};
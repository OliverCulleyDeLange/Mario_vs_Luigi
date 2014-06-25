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

// The main game loop
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

// Update game objects
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

// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render the players if the game isn't over
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
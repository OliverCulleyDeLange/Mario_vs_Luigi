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

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

// The main game loop
var lastTime;
function main() {
    if(!running) {
        return;
    }
        
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0; // dt is number of seconds passed since last update

    update(dt);

    render();

    lastTime = now;
    requestAnimFrame(main);
    //console.log("Game Frame");
};

function init() {
    ctx.fillStyle = '#333';
    terrainPattern = ctx.fillRect(0,0,canvas.width,canvas.height);

    document.getElementById('play-reset').addEventListener('click', function() {
        reset();
    });

    document.getElementById('resume').addEventListener('click', function() {
        resume();
    });

    document.getElementById('play').addEventListener('click', function() {
        running = true;
        document.getElementById('game-setup').style.display = "none";
        mario = new player([innerWidth*0.1,innerHeight*0.25]);
        // Make players
        players.push(mario);
        if(twoPlayer) {
            luigi = new player([innerWidth*0.9,innerHeight*0.25]);
            players.push(luigi);
        }
        drawMap();
        lastTime = Date.now();
        // If 'Online' player, setup networking
        if (onlinePlay) {
            //connect('ws://' + window.location.host + '/Mario_vs_Luigi/');
            connect('ws://localhost:4444');
        } else {
            main();
        }
    });

    document.getElementById('onePlayer').addEventListener('click', function() {
        // Actions for clicking onePlayer
        document.getElementById('onePlayer').className += ' button-selected';
        document.getElementById('twoPlayer').className = 'button-link';
        twoPlayer = false;
    });

    document.getElementById('twoPlayer').addEventListener('click', function() {
        // Actions for clicking twoPlayer
        document.getElementById('twoPlayer').className += ' button-selected';
        document.getElementById('onePlayer').className = 'button-link';
        twoPlayer = true;
    });

    document.getElementById('localPlay').addEventListener('click', function() {
        // Actions for clicking localPlay
        document.getElementById('localPlay').className += ' button-selected';
//        document.getElementById('onlinePlay').className = 'button-link';
        onlinePlay = false;
    });

    document.getElementById('onlinePlay').addEventListener('click', function() {
        // Actions for clicking onlinePlay
        document.getElementById('onlinePlay').className += ' button-selected';
        document.getElementById('localPlay').className = 'button-link';
        onlinePlay = true;
    });
};

resources.load([
    'img/ML.png',
    'img/terrain.png'
]);
resources.onReady(init);

// Update game objects
function update(dt) {
    gameTime += dt;
    // Default Variables
    mario.direction = 0;
    mario.sheild = false;
    mario.shoot = false;
    mario.pickup = false;
    if(twoPlayer) {
        luigi.direction = 0;
        luigi.sheild = false;
        luigi.shoot = false;
        luigi.pickup = false;
    }
    // Change player properties based on key press
    handleInput(dt);
    // Change entity position based on properties
    updateEntities(dt);
    // Do collision detection
    //checkCollisions();

};

function updateEntities(dt) { // dt is number of seconds passed - multiply speed of object by dt to get pixel movement

// Update all the Players
    for (var h=0; h<players.length; h++) {
        var player = players[h];
        // Below deals with X axis movement and velocity increase / decrease
        var velIncX = 0.05;
        if (player.direction) {
            player.faceDir = player.direction;
            player.velocity[0] += velIncX * player.direction;
        } else {
            player.velocity[0] *= 0.8;
            if (Math.abs(player.velocity[0]) < 0.05) player.velocity[0] = 0;
        }
        // The below deals with Y axis movement and gravity
        if (player.onGround) {
            player.velocity[1] = 0;
        } else {
            player.velocity[1] += 0.08;
        }
        if (player.velocity[0] > player.maxVel[0]) player.velocity[0] = player.maxVel[0];
        if (player.velocity[0] < player.minVel[0]) player.velocity[0] = player.minVel[0];
        if (player.velocity[1] > player.maxVel[1]) player.velocity[1] = player.maxVel[1];
        if (player.velocity[1] < player.minVel[1]) player.velocity[1] = player.minVel[1];
        
        
        var tmpPosX = player.pos[0] + player.velocity[0] * (playerSpeed * dt);
        var tmpPosY = player.pos[1] + player.velocity[1] * (playerSpeed * dt);
        
        if (!playerCollisions([tmpPosX, tmpPosY], player.sprite.size)) {
            player.pos[0] += player.velocity[0] * (playerSpeed * dt);
            player.pos[1] += player.velocity[1] * (playerSpeed * dt);
        } else {
            //TODO Player is not colliding but not necessarily on ground
            player.onGround = true;
        }
        
        //Keep player in box
        checkPlayerBounds(player);
        // The below deals with walk animations
        if (player.onGround) {
            if (player.velocity[0] === 0) {
                player.walkCycle = 0;
                player.runState = (player.faceDir < 0 ? player.runStates.STANDLEFT : player.runStates.STANDRIGHT);
            } else {
                player.walkCycle += 0.5;
                if (player.walkCycle >= 3) player.walkCycle = 0;
                player.runState =	(player.velocity[0] < 0 ? player.runStates.RUNLEFT1 : player.runStates.RUNRIGHT1) + (player.walkCycle>>0);
            }
        } else {
            player.walkCycle = 0;
                    //console.log(player.faceDir < 0 ? player.runStates.JUMPLEFT : player.runStates.JUMPRIGHT);
            player.runState = (player.faceDir < 0 ? player.runStates.JUMPLEFT : player.runStates.JUMPRIGHT);
        }
        // Is player shooting?
        //player.shoot = true;
        if(player.shoot && !isGameOver && Date.now() - player.lastFire > 500) {
        var x = player.pos[0] + player.sprite.size[0] / 2;
        var y = player.pos[1] + player.sprite.size[1] / 2;

        bullets.push({ pos: [x + player.sprite.size[0] * player.faceDir, y],
                       dir: player.faceDir,
                       sprite: new Sprite('img/ML.png', [0,0], [8,4], 0)
                       //                 (url, pos, size, speed, frames, dir, once)
                       });
        player.lastFire = Date.now();
        }
    } // End for players loop
    
// Update all the bullets
    for(var i=0; i<bullets.length; i++) {
        var bullet = bullets[i];
        if (bullet.dir === 1) { //Bullet travelling right
            bullet.pos[0] += bulletSpeed * dt;
        }
        else { //Bullets travelling left
            bullet.pos[0] -= bulletSpeed * dt;
        }
        // Remove the bullet if it goes offscreen
        if(bullet.pos[0] > canvas.width || bullet.pos[0] < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
    bulletCollisions(); //Checks for any bullet collisions
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
    }

    
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
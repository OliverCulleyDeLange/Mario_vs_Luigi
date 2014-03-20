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
    var dt = (now - lastTime) / 1000.0;

    update(dt);
    // For testing only
    displayVars(); // Causes huge lag
    render();

    lastTime = now;
    requestAnimFrame(main);
    console.log("Game Frame");
};

function init() {
    //terrainPattern = ctx.createPattern(resources.get('img/terrain.png'), 'repeat'); 
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
        mario = new player();
        players.push(mario);
        if(twoPlayer) {
            luigi = new player();
            players.push(luigi);
        }
        for (b=0; b<cubeCoords.length; b++) {
            cubes[b] = new cube(cubeCoords[b][0], cubeCoords[b][1]);
        }

        lastTime = Date.now();
        main();
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
        document.getElementById('onlinePlay').className = 'button-link';
        onlinePlay = false;
    });
    document.getElementById('onlinePlay').addEventListener('click', function() {
        // Actions for clicking onlinePlay
        document.getElementById('onlinePlay').className += ' button-selected';
        document.getElementById('localPlay').className = 'button-link';
        onlinePlay = true;
    });
}
        
resources.load([
    'img/ML.png',
    'img/terrain.png'
]);
resources.onReady(init);
//Cube Constructor
function cube(x,y) {
    this.pos = [x,y];
    this.size = [16, 16];
    this.sprite = new Sprite('img/terrain.png', [0, 0], [16, 16], [0]);
}
// Player Constructor
function player() {
  this.pos = [0,0]; // x,y position
  this.velocity = [0,0]; //x,y velocitiy
  this.maxVel = [0.5, 2];
  this.minVel = [-0.5, -1];
  this.direction = 0;
  this.faceDir = 1;
  this.onGround = false;
  this.runState = 6;
  this.walkCycle = 0;
  this.sprite = new Sprite('img/ML.png', [0,0], [16,16], 16, [0]);
  //Weapon/Sheild
  this.lastFire = Date.now();
  this.shoot = false;
  this.sheildTimeout = 10000;
  this.sheild = false;
  this.pickup = false;
  // Scoring
  this.score = 0;
  // Run States
  this.runStates = {
    JUMPLEFT : 0,
    RUNLEFT1 : 1,
    RUNLEFT2 : 2,
    RUNLEFT3 : 3,
    SKIDLEFT : 4,
    STANDLEFT : 5,
    STANDRIGHT : 6,
    RUNRIGHT1 : 7,
    RUNRIGHT2 : 8,
    RUNRIGHT3 : 9,
    SKIDRIGHT : 10,
    JUMPRIGHT : 11
  };
};

// Game state
var running = false;
var onlinePlay = false;
var twoPlayer = false;
var players = [];
var playerSpeed = 500;
var bulletSpeed = 1000;
var bullets = [];
var cubeCoords = [];
for (a=0; a<20; a++) {
    cubeCoords[a] = [Math.round(Math.random()*1000),Math.round(Math.random()*1000)] ;
};
var cubes = [];
var visibleCubes = [];

var gameTime = 0;
var isGameOver;
var terrainPattern;

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

function handleInput(dt) {
    // Mario
    if(input.isDown('DOWN')) {
        if (mario.onGround == false) {
            mario.velocity[1] = mario.maxVel[1];
        }
        //console.log("DOWN pressed");
    }

    if(input.isDown('UP')) {
        if (mario.onGround) {
           mario.velocity[1] = mario.minVel[1];
           mario.onGround = false;
        }
        //console.log("UP pressed");
    }

    if(input.isDown('LEFT')) {
        mario.direction = -1;
        //console.log("LEFT pressed");
    }

    if(input.isDown('RIGHT')) {
        mario.direction = 1;
        //console.log("RIGHT pressed");
    }
    
    if(input.isDown('COMMA')) {
        mario.sheild = true;
        //console.log("COMMA pressed");
    }
    
    if(input.isDown('PERIOD')) {
        mario.shoot = true;
        //console.log("PERIOD pressed");
    }
    
    if(input.isDown('FSLASH')) {
        mario.pickup = true;
        //console.log("FSLASH pressed");
    }
    // Luigi
    if(twoPlayer) {
        if(input.isDown('S')) {
            luigi.velocity[1] = luigi.maxVel[1];
        }

        if(input.isDown('W')) {
            if (luigi.onGround) {
               luigi.velocity[1] = luigi.minVel[1];
            }
        }

        if(input.isDown('A')) {
            luigi.direction[0] = luigi.minVel[0];
        }

        if(input.isDown('D')) {
            luigi.direction[0] = luigi.maxVel[0];
        }

        if(input.isDown('SHIFT')) {
            luigi.sheild = true;
        }

        if(input.isDown('BSLASH')) {
            luigi.pickup = true;
        }

        if(input.isDown('Z')) {
            luigi.shoot = true;
        }
    }
}

function updateEntities(dt) {
// Update all the Players
    for (var h=0; h<players.length; h++) {
        var player = players[h];
        // Below deals with X axis movement and velocity increse / decrease
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
            player.onGround = true;
        }
        
        //Keep player in box
        checkPlayerBounds(player);
        // The below deals with walk animations
        if (player.onGround) {
		if (player.velocity[0] == 0) {
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
        if(player.shoot && !isGameOver && Date.now() - player.lastFire > 100) {
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
}

// Collisions
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function bulletCollisions() {  
    // Check bullet collision with walls and players
    for(var j=0; j<bullets.length; j++) {
        var pos2 = bullets[j].pos;
        var size2 = bullets[j].sprite.size;
        // Checks for bullet -> Player collision
        if(boxCollides(mario.pos, mario.sprite.size, pos2, size2)) {
            bullets.splice(j, 1); // Splice removes the bullet item from the array
            mario.kill();
            break;
        }
        if (twoPlayer) {
            if(boxCollides(luigi.pos, luigi.sprite.size, pos2, size2)) {
                bullets.splice(j, 1); // Splice removes the bullet item from the array
                mario.kill();
                break;
            }
        }
        // Check for Bullet -> Map collisions
        for (k=0; k<visibleCubes.length; k++) {
            if(boxCollides(cubes[k].pos, cubes[k].sprite.size, pos2, size2)) {
                bullets.splice(j,1);
            }
        }
    }
}
function playerCollisions(pos2, size2) {  //player values passed through  
    //Check for Player -> Wall/Map collision
    for (k=0; k<cubes.length; k++) {
        if(boxCollides(cubes[k].pos, cubes[k].sprite.size, pos2, size2)) {
            return true;
            break;
        }
    }
}

function checkPlayerBounds(player) {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]-50) {
        player.pos[1] = canvas.height - player.sprite.size[1]-50;
        player.onGround = true;
    }
}

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
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx, entity.runState);
    ctx.restore();
}

// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}

// Reset game to original state
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

// Don't run the game when the game window isn't visible
function resume() {
    running = true;
    lastTime = Date.now();
    main();
    document.getElementById('resume').style.display = "none";
    document.getElementById('game-over-overlay').style.display = "none";
}

//window.addEventListener('blur', function() {
//    if(document.getElementById('game-setup').style.display == "none") {
//        running = false;
//        document.getElementById('resume').style.display = "block";
//        document.getElementById('game-over-overlay').style.display = "block";
//    }
//});

function displayVars() {
    // Function for monitoring vars
    var marioWatchVars = [   "pos",   "velocity",   "maxVel",   "minVel",  "direction" ,   "faceDir",
        "onGround", "sprite.size",   "lastFire",   "shoot",
        "sheildTimeout",  "sheild",   "pickup", "score"];
    var globalWatchVars = ["onlinePlay","twoPlayer","bullets.length", "canvas.height","canvas.width"];
    
    for(var x=0; x<globalWatchVars.length; x++) {
        var y = globalWatchVars[x];
        var p =  document.createElement("p");
        p.setAttribute("id", y);
        document.getElementById('vars').appendChild(p);
        document.getElementById(y).innerHTML = y + ": " + eval(y);
    }
    for(var x=0; x<marioWatchVars.length; x++) {
        var y = marioWatchVars[x];
        var p =  document.createElement("p");
        p.setAttribute("id", y);
        document.getElementById('vars').appendChild(p);
        document.getElementById(y).innerHTML = y + ": " + eval("mario." + y);
    }
}
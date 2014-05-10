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
var cubeCoords = [];
for (a=0; a<20; a++) {
    cubeCoords[a] = [Math.round(innerWidth*Math.random()),Math.round(innerHeight*Math.random())] ;
};
var cubes = [];
var visibleCubes = [];

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
        mario = new player([innerWidth*0.1,innerHeight*0.25]);
        // Make players
        players.push(mario);
        if(twoPlayer) {
            luigi = new player([innerWidth*0.9,innerHeight*0.25]);
            players.push(luigi);
        }
        for (b=0; b<cubeCoords.length; b++) {
            cubes[b] = new cube(cubeCoords[b][0], cubeCoords[b][1]);
        }
        lastTime = Date.now();
        // If 'Online' player, setup networking
        if (onlinePlay) {
            //connect('ws://' + window.location.host + '/Mario_vs_Luigi/');
            connect('ws://localhost:4444');
        } else {
            main();
        }
    })
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
};

function connect(host) {
      if ('WebSocket' in window) {
        socket = new WebSocket(host);
      } else if ('MozWebSocket' in window) {
        socket = new MozWebSocket(host);
      } else {
        Console.log('Error: WebSocket is not supported by this browser.');
        return;
      }

      socket.onopen = function () {
          // Socket open.. start the game loop.
          console.log('Info: WebSocket connection opened.');
          setInterval(function() {
              // Prevent server read timeout.
              Game.socket.send('ping');
          }, 5000);
      };

      socket.onclose = function () {
          console.log('Info: WebSocket closed.');
          init();
      };

      socket.onmessage = function (message) {
          // _Potential_ security hole, consider using json lib to parse data in production.
          var packet = eval('(' + message.data + ')');
          switch (packet.type) {
              case 'update':
                  for (var i = 0; i < packet.data.length; i++) {
                      Game.updateSnake(packet.data[i].id, packet.data[i].body);
                  }
                  break;
              case 'join':
                  for (var j = 0; j < packet.data.length; j++) {
                      Game.addSnake(packet.data[j].id, packet.data[j].color);
                  }
                  break;
              case 'leave':
                  Game.removeSnake(packet.id);
                  break;
              case 'dead':
                  console.log('Info: Your snake is dead, bad luck!');
                  Game.direction = 'none';
                  break;
              case 'kill':
                  console.log('Info: Head shot!');
                  break;
              default:
                  console.log("Packet is:" + packet);
                  break;
          }
      };
};

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
};
// Player Constructor
function player(pos) {
  this.pos = pos; // x,y position
  this.startPos = [pos[0],pos[1]];
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
  this.lives = 5;
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
  this.kill = (function() {
    console.log("Killed");
    this.lives--;
    this.reset();
  });

  this.reset = (function() {
    this.pos = [this.startPos[0],this.startPos[1]] // x,y position
    this.velocity = [0,0]; //x,y velocitiy
    this.direction = 0;
    this.faceDir = 1;
    this.onGround = false;
    this.shoot = false;
    this.sheildTimeout = 10000;
    this.sheild = false;
    this.pickup = false;
  });
};

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
    if(input.isDown('S')) {
        if (mario.onGround == false) {
                mario.velocity[1] = mario.maxVel[1];
        }
    }

    if(input.isDown('W')) {
        if (mario.onGround) {
           mario.velocity[1] = mario.minVel[1];
           mario.onGround = false;
        }
    }

    if(input.isDown('A')) {
        mario.direction = -1;
    }

    if(input.isDown('D')) {
        mario.direction = 1;
    }

    if(input.isDown('SHIFT')) {
        mario.sheild = true;
    }

    if(input.isDown('BSLASH')) {
        mario.shoot = true;
    }

    if(input.isDown('Z')) {
        mario.pickup = true;
    }
    if(twoPlayer) {
            if(input.isDown('DOWN')) {
                if (luigi.onGround == false) {
                    luigi.velocity[1] = luigi.maxVel[1];
                }
                //console.log("DOWN pressed");
            }

            if(input.isDown('UP')) {
                if (luigi.onGround) {
                   luigi.velocity[1] = luigi.minVel[1];
                   luigi.onGround = false;
                }
                //console.log("UP pressed");
            }

            if(input.isDown('LEFT')) {
                luigi.direction = -1;
                //console.log("LEFT pressed");
            }

            if(input.isDown('RIGHT')) {
                luigi.direction = 1;
                //console.log("RIGHT pressed");
            }

            if(input.isDown('COMMA')) {
                luigi.sheild = true;
                //console.log("COMMA pressed");
            }

            if(input.isDown('PERIOD')) {
                luigi.shoot = true;
                //console.log("PERIOD pressed");
            }

            if(input.isDown('FSLASH')) {
                luigi.pickup = true;
                //console.log("FSLASH pressed");
            }
    }
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

// Collisions
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
};

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
};

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
                luigi.kill();
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
};
function playerCollisions(pos2, size2) {  //player values passed through  
    //Check for Player -> Wall/Map collision
    for (k=0; k<cubes.length; k++) {
        if(boxCollides(cubes[k].pos, cubes[k].sprite.size, pos2, size2)) {
            return true;
            break;
        }
    }
};

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

// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
};

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
};

//window.addEventListener('blur', function() {
//    if(document.getElementById('game-setup').style.display == "none") {
//        running = false;
//        document.getElementById('resume').style.display = "block";
//        document.getElementById('game-over-overlay').style.display = "block";
//    }
//});
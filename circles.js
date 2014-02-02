
ML.prototype.update = function() {
//        var velIncX = 0.05;
//	if (this.direction) {
//		this.faceDir = this.direction;
//		this.velocity[0] += velIncX * this.direction;
//	} else {
//		this.velocity[0] *= 0.8;
//		if (Math.abs(this.velocity[0]) < 0.05) this.velocity[0] = 0;
//	}
        
//       this.velocity[1] += 0.08;
//	if (this.velocity[0] > this.maxVel[0]) this.velocity[0] = this.maxVel[0];
//	if (this.velocity[0] < this.minVel[0]) this.velocity[0] = this.minVel[0];
//	if (this.velocity[1] > this.maxVel[1]) this.velocity[1] = this.maxVel[1];
//	if (this.velocity[1] < this.minVel[1]) this.velocity[1] = this.minVel[1];
//        var newPos = [
//		this.pos[0] + this.velocity[0],
//		this.pos[1] + this.velocity[1]
//	];

//	if (this.onGround) {
//		if (this.velocity[0] == 0) {
//			this.walkCycle = 0;
//			this.runState = (this.faceDir < 0 ? this.runStates.STANDLEFT : this.runStates.STANDRIGHT);
//		} else {
//			this.walkCycle += 0.5;
//			if (this.walkCycle >= 3) this.walkCycle = 0;
//			this.runState =	(this.velocity[0] < 0 ? this.runStates.RUNLEFT1 : this.runStates.RUNRIGHT1) + (this.walkCycle>>0);
//		}
//	} else {
//		this.walkCycle = 0;
//                //console.log(this.faceDir < 0 ? this.runStates.JUMPLEFT : this.runStates.JUMPRIGHT);
//		this.runState = (this.faceDir < 0 ? this.runStates.JUMPLEFT : this.runStates.JUMPRIGHT);
//	}

//	this.pos = collide(this.pos, newPos);	
//
//	if (this.pos[0] != newPos[0]) this.velocity[0] = 0;
//	if (this.pos[1] != newPos[1]) this.velocity[1] = 0;

	//if (this.pos[1] > 13) this.pos[1] = 13 - $(window).height()/16;

//	if (this.pos[0] > $(window).width()/16 - 16 + scrollPos/16)
//		initScroll(1);
//	else if (this.pos[0] < 16 + scrollPos/16)
//		initScroll(-1);

	//$mario
//		.css("left", this.pos[0]*16)
//		.css("bottom", 13*16 - this.pos[1]*16)


    function collide(pos1, pos2) {
    //	var oldX = pos1[0];
    //	var oldY = pos1[1];
    //	var newX = pos2[0];
    //	var newY = pos2[1];
    //
    //	var collision, xAdjust = 0;
    //
    //	var space = 1/16;
    //
    //	onGround = false;
    //
    //	if (oldY != newY) { // moving vertically
    //		if (newY > oldY) { // moving down
    //			// lower left collision
    //			collision = isBlocking(newX + space, newY + 1);
    //			if (collision && !isBlocking(newX + space, newY)) {
    //				newY -= collision[1];
    //				onGround = true;
    //			}
    //
    //			// lower right collision
    //			collision = isBlocking(newX + 1-space, newY + 1);
    //			if (collision && !isBlocking(newX + 1-space, newY)) {
    //				newY -= collision[1];
    //				onGround = true;
    //			}
    //		// moving up
    //		} else {
    //
    //			// upper left collision
    //			collision = isBlocking(newX + space, newY);
    //			if (collision && !isBlocking(newX + space, newY + 1)) {
    //				newY += (1 - collision[1]);
    //			}
    //
    //			// upper right collision
    //			collision = isBlocking(newX + 1 - space, newY);
    //			if (collision && !isBlocking(newX + 1 - space, newY + 1)) {
    //				newY += (1 - collision[1]);
    //				xAdjust = 1;
    //			}
    //		}
    //
    //	}
    //	// moving horizontally
    //	if (oldX != newX) {
    //
    //		// moving right
    //		if (newX > oldX) {
    //
    //			// lower right collision
    //			collision = isBlocking(newX + 1, newY + 1-space);
    //			if (collision) {
    //				newX -= collision[0];
    //			}
    //
    //			// upper right collision
    //			collision = isBlocking(newX + 1, newY);
    //			if (collision) {
    //				newX -= collision[0];
    //			}
    //
    //		// moving left
    //		} else {
    //
    //			// lower left collision
    //			collision = isBlocking(newX, newY + 1-space);
    //			if (collision) {
    //				newX += (1 - collision[0]);
    //			}
    //
    //			// upper left collision
    //			collision = isBlocking(newX, newY);
    //			if (collision) {
    //				newX += (1 - collision[0]);
    //			}
    //		}
    //	}
    //Temp
    newX = pos2[0];
    newY = pos2[1];
    xAdjust = 0;
            return [newX,newY,xAdjust];
    }
};

// --------------------------------------------- //
// Game Code
var Game = {};

Game.fps = 60;

Game.initialize = function() {
  this.entities = [];
  this.context = document.getElementById("viewport").getContext("2d");
};

Game.draw = function() {
  //this.context.clearRect(0, 0, 640, 480);
  
  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].draw(this.context);
  }
};

Game.update = function() {
  for (var i=0; i < this.entities.length; i++) {
    this.entities[i].update();
  }
};

Game.addMario = function() {
    Game.mario = new ML("mario");
    Game.entities.push(Game.mario);
};
Game.addLuigi = function() {
    Game.luigi = new ML("luigi");
    Game.entities.push(Game.luigi);
};
// --------------------------------------------- //

var renderStats = new Stats();
document.body.appendChild(renderStats.domElement);

var updateStats = new Stats();
document.body.appendChild(updateStats.domElement);

      Game.initialize();

      Game.addMario();
      
      Game.run = (function() {
        var loops = 0, skipTicks = 1000 / Game.fps,
            maxFrameSkip = 10,
            nextGameTick = (new Date).getTime();

        return function() {
          loops = 0;

          while ((new Date).getTime() > nextGameTick) {
            updateStats.update();
            Game.update();
            nextGameTick += skipTicks;
            loops++;
          }

          renderStats.update();
          if (loops) Game.draw();
          vars();
        };
        
      })();
      
      (function() {
        var onEachFrame;
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
        var requestAnimFrame = (function(){
            return window.requestAnimationFrame       ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame    ||
                window.oRequestAnimationFrame      ||
                window.msRequestAnimationFrame     ||
                function(callback){
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    
          onEachFrame = function(cb) {
            var _cb = function() { cb(); requestAnimFrame(_cb); };
            _cb();
          };

        window.onEachFrame = onEachFrame;
      })();
      
      window.onEachFrame(Game.run);
      
// --------------------------------------------- //
$(document).keydown(function(e) {
	switch (e.which) {
		case 39: // right
			Game.mario.direction = 1;
			break;
		case 37: // left
			Game.mario.direction = -1;
			break;
		case 38: // up
			if (Game.mario.onGround) 
				Game.mario.velocity[1] = Game.mario.minVel[1];
			break;
	}
	console.log(e.which);
});

$(document).keyup(function(e) {
	switch (e.which) {
		case 39: // right
			if (Game.mario.direction == 1)
				Game.mario.direction = 0;
			break;
		case 37: // left;
			if (Game.mario.direction == -1)
				Game.mario.direction = 0;
			break;
	}
	//console.log(e.which);
});

function vars() {
    $("#pos").html("Pos - " + Game.mario.pos);
    $("#vecocity").html("Velocity - " + Game.mario.velocity);
    $("#direction").html("Direction - " + Game.mario.direction);
    $("#faceDir").html("faceDir - " + Game.mario.faceDir);
    $("#onGround").html("onGround - " + Game.mario.onGround);
    $("#runState").html("runState - " + Game.mario.runState);
    $("#walkCycle").html("walkCycle - " + Game.mario.walkCycle);
    $("#gunTimeout").html("gunTimeout - " + Game.mario.gunTimeout);
    $("#sheildTimeout").html("sheildTimeout - " + Game.mario.sheildTimeout);
    
}
function player(name, pos, keyMap) {
    this.name = name;
    this.pos = pos; // x,y position
    this.startPos = [pos[0],pos[1]];
    this.velocity = [0,0]; //x,y velocitiy
    this.maxVel = [0.5, 2];
    this.minVel = [-0.5, -1];
    this.velIncX = 0.05;
    this.direction = 0;
    this.faceDir = 1;
    this.onGround = false;
    this.runState = 6;
    this.walkCycle = 0;
    this.sprite = new Sprite('img/ML.png', [0,0], [16,16], 16, [0]);
    this.keyMap = keyMap;
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
        
    this.kill = function() {
        console.log("Killed");
        this.lives--;
        this.resetAfterDeath();
    };
    
    this.resetAfterDeath = function() {
        this.pos = [this.startPos[0],this.startPos[1]] // x,y position
        this.velocity = [0,0]; //x,y velocitiy
        this.direction = 0;
        this.faceDir = 1;
        this.onGround = false;
        this.shoot = false;
        this.sheildTimeout = 10000;
        this.sheild = false;
        this.pickup = false;
    };
    
    this.setDefaultValues = function () {
        this.direction = 0;
        this.sheild = false;
        this.shoot = false;
        this.pickup = false;
    };
    
    this.lastPressedLeftOrRight;
    this.handleInput = function () {
        var currentlyPressed = "";
        if (input.isDown(this.keyMap.down)) {
            currentlyPressed += ", down";
            if (!this.onGround) this.velocity[1] = this.maxVel[1];
        }
        if (input.isDown(this.keyMap.up)) {
            currentlyPressed += ", up";
            if (this.onGround) {
                this.velocity[1] = this.minVel[1];
                this.onGround = false;
            }
        }
        if (input.isDown(this.keyMap.left) && input.isDown(this.keyMap.right)) {
            currentlyPressed += ", left & right";
            if (this.lastPressedLeftOrRight === 'left') {
                this.direction = 1;
                this.lastPressedLeftOrRight = 'left';
            } else {
                this.direction = -1;
                this.lastPressedLeftOrRight = 'right';
            }
        } else {
            if (input.isDown(this.keyMap.left)) {
                currentlyPressed += ", left";
                this.direction = -1;
                this.lastPressedLeftOrRight = 'left';
            }
            if (input.isDown(this.keyMap.right)) {
                currentlyPressed += ", right";
                this.direction = 1;
                this.lastPressedLeftOrRight = 'right';
            }
        }
        if (input.isDown(this.keyMap.sheild)) {
            this.sheild = true;
        }
        if (input.isDown(this.keyMap.shoot)) {
            this.shoot = true;
        }
        if (input.isDown(this.keyMap.pickup)) {
            this.pickup = true;
        }
//        if (currentlyPressed) console.log(currentlyPressed);
    };

    this.updateXVelocity = function() {
        if (this.direction) {
            this.faceDir = this.direction;
            this.velocity[0] += this.velIncX * this.direction;
        } else {
            this.velocity[0] *= 0.8;
            if (Math.abs(this.velocity[0]) < 0.05) this.velocity[0] = 0;
        }
    };
    
    this.updateYVelocity = function() {
        if (this.onGround) {
            this.velocity[1] = 0;
        } else {
            this.velocity[1] += 0.08;
        }
        if (this.velocity[0] > this.maxVel[0]) this.velocity[0] = this.maxVel[0];
        if (this.velocity[0] < this.minVel[0]) this.velocity[0] = this.minVel[0];
        if (this.velocity[1] > this.maxVel[1]) this.velocity[1] = this.maxVel[1];
        if (this.velocity[1] < this.minVel[1]) this.velocity[1] = this.minVel[1];
    };
    
    this.updatePosition = function() {
        var tmpPosX = this.pos[0] + this.velocity[0] * (playerSpeed * dt);
        var tmpPosY = this.pos[1] + this.velocity[1] * (playerSpeed * dt);
        var tmpPos = [tmpPosX, tmpPosY];
        
        var i = 0;
        while (this.willCollideWithMap(tmpPos) && (i < 5))  {
            tmpPos[0] = this.pos[0] + ((tmpPos[0] - this.pos[0]) /2 );
            tmpPos[1] = this.pos[1] + ((tmpPos[1] - this.pos[1]) /2 );
            // console.log("Change " + i + " = " + tmpPos);
            i++
        }
        if ( i < 5 ) {
            this.pos = tmpPos;
            this.onGround = false;
        } else {
            this.onGround = true;
        }
    };
    
    this.stoodOnTopOf = function(cube) {
        var bottomYCoordinateofPlayer = this.pos[1] + this.sprite.size[1];
        var topYCoordinateOfCube = cube.pos[1];
        return !boxCollides(cube.pos, cube.sprite.size, 
                            this.pos, this.sprite.size) &&
               boxCollides(cube.pos, cube.sprite.size, 
                            this.pos, [this.sprite.size[0], this.sprite.size[1]+5]);
    };
    
    this.willStandOnTopOf = function(cube, position) {
        var bottomYCoordinateofPlayer = position[1] + this.sprite.size[1];
        var topYCoordinateOfCube = cube.pos[1];
        return !boxCollides(cube.pos, cube.sprite.size, 
                            position, this.sprite.size) &&
               boxCollides(cube.pos, cube.sprite.size, 
                            position, [this.sprite.size[0], this.sprite.size[1]+5]);
    };
    
    this.setWalkAnimation = function() {
        if (this.onGround) {
            if (this.velocity[0] === 0) {
                this.walkCycle = 0;
                this.runState = (this.faceDir < 0 ? this.runStates.STANDLEFT : this.runStates.STANDRIGHT);
            } else {
                this.walkCycle += 0.5;
                if (this.walkCycle >= 3) this.walkCycle = 0;
                this.runState =	(this.velocity[0] < 0 ? this.runStates.RUNLEFT1 : this.runStates.RUNRIGHT1) + (this.walkCycle>>0);
            }
        } else {
            this.walkCycle = 0;
            //console.log(player.faceDir < 0 ? player.runStates.JUMPLEFT : player.runStates.JUMPRIGHT);
            this.runState = (this.faceDir < 0 ? this.runStates.JUMPLEFT : this.runStates.JUMPRIGHT);
        }
    };
    
    this.fireGun = function() {
        var x = this.pos[0] + this.sprite.size[0] / 2;
        var y = this.pos[1] + this.sprite.size[1] / 2;
        
        var bulletPosition = [x + this.sprite.size[0] * this.faceDir, y];
        var bulletDirection = this.faceDir;
        bullets.push(new bullet(bulletPosition , bulletDirection));
        this.lastFire = Date.now();
    };
    
    this.checkBounds = function () {
        if(this.pos[0] < 0) {
            this.pos[0] = 0;
        }
        else if(this.pos[0] > canvas.width - this.sprite.size[0]) {
            this.pos[0] = canvas.width - this.sprite.size[0];
        }

        if(this.pos[1] < 0) {
            this.pos[1] = 0;
        }
        else if(this.pos[1] >= canvas.height - this.sprite.size[1]-50) {
            this.pos[1] = canvas.height - this.sprite.size[1]-50;
            this.onGround = true;
        }
    };
    
    this.willCollideWithMap = function(position) {
        //Check for Player -> Wall/Map collision
        for (var i=0; i<cubes.length -1; i++) { //TODO narrow down to only check collision with nearby cubes
            var collision = boxCollides(cubes[i].pos, cubes[i].sprite.size, position, this.sprite.size);
            if( collision ) return true;
        }
        return false;
    };
};
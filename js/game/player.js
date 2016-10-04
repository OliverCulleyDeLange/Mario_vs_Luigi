function player(name, pos, keyMap, controlable) {
    this.name = name;
    this.controlable = controlable;
    this.pos = pos; // x,y position
    this.startPos = {x: pos.x, y: pos.y};
    this.velocity = {
        x: 0,
        y: 0
    }
    this.maxVel = {
        right: 1,
        up: 1.5,
        left: -1,
        down: -1.5
    }
    this.velIncX = 0.05;
    this.direction = 0;
    this.faceDir = 1;
    this.onGround = false;
    this.runState = 6;
    this.walkCycle = 0;
    this.sprite = new Sprite('img/ML.png', {x:0,y: 0}, [16,16], 16, [0]);
    this.keyMap = keyMap;
    //Weapon/Sheild
    this.bullets = [];
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
        this.pos = {x: this.startPos.x, y: this.startPos.y}
        this.velocity = {x:0, y:0};
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
        if (!this.controlable) { return; }

        var currentlyPressed = "";
        if (input.isDown(this.keyMap.down)) {
            currentlyPressed += ", down";
            if (!this.onGround) this.velocity.y = this.maxVel.down;
        }
        if (input.isDown(this.keyMap.up)) {
            currentlyPressed += ", up";
            if (this.onGround) {
                this.velocity.y = this.maxVel.up;
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
            this.velocity.x += this.velIncX * this.direction;
        } else {
            this.velocity.x *= 0.8;
            if (Math.abs(this.velocity.x) < 0.05) this.velocity.x = 0;
        }
        if (this.velocity.x > this.maxVel.right) this.velocity.x = this.maxVel.right;
        if (this.velocity.x < this.maxVel.left) this.velocity.x = this.maxVel.left;
    };
    
    this.updateYVelocity = function() {
        if (this.onGround) {
            this.velocity.y = 0;
        } else {
            this.velocity.y -= 0.08;
        }
        if (this.velocity.y > this.maxVel.up) this.velocity.y = this.maxVel.up;
        if (this.velocity.y < this.maxVel.down) this.velocity.y = this.maxVel.down;
    };
    
    this.updatePosition = function() {
        if (this.velocity.x || this.velocity.y) {
            var tmpPosX = this.pos.x + (this.velocity.x * (playerSpeed * dt));
            var tmpPosY = this.pos.y - (this.velocity.y * (playerSpeed * dt));
            var tmpPos = {x: tmpPosX, y: tmpPosY };

            var i = 0;
            while (this.willCollideWithMap(tmpPos) && (i < 5))  {
                tmpPos.x = this.pos.x + ((tmpPos.x - this.pos.x) /2 );
                tmpPos.y = this.pos.y + ((tmpPos.y - this.pos.y) /2 );
                // console.log("Change " + i + " = " + tmpPos);
                i++
            }
            if ( i < 5 ) {
                this.pos = tmpPos;
                this.onGround = false;
            } else {
                this.onGround = true;
            }
        }
    };
    
    this.stoodOnTopOf = function(cube) {
        var bottomYCoordinateofPlayer = this.pos.y + this.sprite.size[1];
        var topYCoordinateOfCube = cube.pos.y;
        return !boxCollides(cube.pos, cube.sprite.size, 
                            this.pos, this.sprite.size) &&
               boxCollides(cube.pos, cube.sprite.size, 
                            this.pos, [this.sprite.size[0], this.sprite.size[1]+5]);
    };
    
    this.willStandOnTopOf = function(cube, position) {
        var bottomYCoordinateofPlayer = position[1] + this.sprite.size[1];
        var topYCoordinateOfCube = cube.pos.y;
        return !boxCollides(cube.pos, cube.sprite.size, 
                            position, this.sprite.size) &&
               boxCollides(cube.pos, cube.sprite.size, 
                            position, [this.sprite.size[0], this.sprite.size[1]+5]);
    };
    
    this.setWalkAnimation = function() {
        if (this.onGround) {
            if (this.velocity.x === 0) {
                this.walkCycle = 0;
                this.runState = (this.faceDir < 0 ? this.runStates.STANDLEFT : this.runStates.STANDRIGHT);
            } else {
                this.walkCycle += 0.5;
                if (this.walkCycle >= 3) this.walkCycle = 0;
                this.runState =	(this.velocity.x < 0 ? this.runStates.RUNLEFT1 : this.runStates.RUNRIGHT1) + (this.walkCycle>>0);
            }
        } else {
            this.walkCycle = 0;
            //console.log(player.faceDir < 0 ? player.runStates.JUMPLEFT : player.runStates.JUMPRIGHT);
            this.runState = (this.faceDir < 0 ? this.runStates.JUMPLEFT : this.runStates.JUMPRIGHT);
        }
    };
    
    this.fireGun = function() {
        var x = this.pos.x + this.sprite.size[0] / 2;
        var y = this.pos.y + this.sprite.size[1] / 2;
        
        var bulletPosition = { x: x + this.sprite.size[0] * this.faceDir, y:y };
        var bulletDirection = this.faceDir;
        this.bullets.push(new Bullet(bulletPosition, bulletDirection));
        this.lastFire = Date.now();
    };

    this.updateBullets = function() {
        for(var i=0; i < this.bullets.length; i++) {
            var bullet = this.bullets[i];
            bullet.move(this.bullets);
            bullet.doCollisionDetection(this.bullets);
        }
        if (this.bullets.length > 0 && this === players.me) {
            var bullets = this.bullets.map(function(b) {return {  pos: b.pos, direction: b.dir }});
            socket.emit('player bullets', bullets );
        }
    };
    
    this.checkBounds = function () {
        if(this.pos.x < 0) {
            this.pos.x = 0;
        }
        else if(this.pos.x > canvas.width - this.sprite.size[0]) {
            this.pos.x = canvas.width - this.sprite.size[0];
        }

        if(this.pos.y < 0) {
            this.pos.y = 0;
        }
        else if(this.pos.y >= canvas.height - this.sprite.size[1]-50) {
            this.pos.y = canvas.height - this.sprite.size[1]-50;
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
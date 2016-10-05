function Player(name, pos, keyMap, controlable) {
    // Player is a Sprite so call Sprite constructor
    Sprite.call(this, 'img/ML.png', {x:0, y:0}, [16,16], 16, [0])

    this.name = name;
    this.keyMap = keyMap;
    this.controlable = controlable;
    this.position = pos;
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
    this.lastPressedLeftOrRight;
}

Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Sprite;

Player.prototype.kill = function() {
    this.lives--;
    this.resetAfterDeath();
    console.log(this.name + " died");
};

Player.prototype.resetAfterDeath = function() {
    this.position = {x: this.startPos.x, y: this.startPos.y}
    this.velocity = {x:0, y:0};
    this.direction = 0;
    this.faceDir = 1;
    this.onGround = false;
    this.shoot = false;
    this.sheildTimeout = 10000;
    this.sheild = false;
    this.pickup = false;
};

Player.prototype.setDefaultValues = function () {
    this.direction = 0;
    this.sheild = false;
    this.shoot = false;
    this.pickup = false;
};

Player.prototype.handleInput = function () {
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

Player.prototype.updateXVelocity = function() {
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

Player.prototype.updateYVelocity = function() {
    if (this.onGround) {
        this.velocity.y = 0;
    } else {
        this.velocity.y -= 0.08;
    }
    if (this.velocity.y > this.maxVel.up) this.velocity.y = this.maxVel.up;
    if (this.velocity.y < this.maxVel.down) this.velocity.y = this.maxVel.down;
};

Player.prototype.updatePosition = function() {
    if (this.velocity.x || this.velocity.y) {
        var tmpPosX = this.position.x + (this.velocity.x * (mvl.state.playerSpeed * dt));
        var tmpPosY = this.position.y - (this.velocity.y * (mvl.state.playerSpeed * dt));
        var tmpPos = {x: tmpPosX, y: tmpPosY };

        var i = 0;
        while (this.willCollideWithMap(tmpPos) && (i < 5))  {
            tmpPos.x = this.position.x + ((tmpPos.x - this.position.x) /2 );
            tmpPos.y = this.position.y + ((tmpPos.y - this.position.y) /2 );
            // console.log("Change " + i + " = " + tmpPos);
            i++
        }
        if ( i < 5 ) {
            this.position = tmpPos;
            this.onGround = false;
        } else {
            this.onGround = true;
        }
    }
};

Player.prototype.emitPosition = function() {
    mvl.socket.emit('player move', {
        position: this.position,
        faceDir: this.faceDir,
        runState: this.runState,
        walkCycle: this.walkCycle,
        velocity: this.velocity,
        onGround: this.onGround
    });
}

Player.prototype.stoodOnTopOf = function(tile) {
    var bottomYCoordinateofPlayer = this.position.y + this.size[1];
    var topYCoordinateOfCube = tile.position.y;
    return !mvl.boxCollides(tile.position, tile.size,
                        this.position, this.size) &&
           mvl.boxCollides(tile.position, tile.size,
                        this.position, [this.size[0], this.size[1]+5]);
};

Player.prototype.willStandOnTopOf = function(tile, position) {
    var bottomYCoordinateofPlayer = position[1] + this.size[1];
    var topYCoordinateOfCube = tile.position.y;
    return !mvl.boxCollides(tile.position, tile.size,
                        position, this.size) &&
           mvl.boxCollides(tile.position, tile.size,
                        position, [this.size[0], this.size[1]+5]);
};

Player.prototype.setWalkAnimation = function() {
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

Player.prototype.fireGun = function() {
    var x = this.position.x + this.size[0] / 2;
    var y = this.position.y + this.size[1] / 2;

    var bulletPosition = { x: x + this.size[0] * this.faceDir, y:y };
    var bulletDirection = this.faceDir;
    this.bullets.push(new Bullet(bulletPosition, bulletDirection));
    this.lastFire = Date.now();
};

Player.prototype.updateBullets = function() {
    for(var i=0; i < this.bullets.length; i++) {
        var bullet = this.bullets[i];
        bullet.move();

        //Remove if off screen
        if(bullet.position.x > canvas.width || bullet.position.x < 0) {
            this.bullets.splice(i, 1);
        }
        // Bullet -> Opponent collisions
        if (mvl.state.twoPlayer && mvl.players.opponent) {
            if(mvl.boxCollides(mvl.players.opponent.position, mvl.players.opponent.size, bullet.position, bullet.size)) {
                this.bullets.splice(i, 1);
                mvl.players.opponent.kill();
                mvl.socket.emit('kill');
            }
        }
        // Bullet -> Map collisions
        for (var j=0; j < mvl.map.tiles.length; j++) {
            var tile = mvl.map.tiles[j];
            if(mvl.boxCollides(tile.position, tile.size, this.position, this.size)) {
                this.bullets.splice(i, 1);
            }
        }
    }
};

Player.prototype.emitBullets = function() {
    var bullets = this.bullets.map(function(b) {return {  position: b.position, direction: b.dir }});
    mvl.socket.emit('player bullets', bullets );
};

Player.prototype.checkBounds = function () {
    if(this.position.x < 0) {
        this.position.x = 0;
    }
    else if(this.position.x > canvas.width - this.size[0]) {
        this.position.x = canvas.width - this.size[0];
    }

    if(this.position.y < 0) {
        this.position.y = 0;
    }
    else if(this.position.y >= canvas.height - this.size[1]-50) {
        this.position.y = canvas.height - this.size[1]-50;
        this.onGround = true;
    }
};

Player.prototype.willCollideWithMap = function(position) {
    //Check for Player -> Wall/Map collision
    for (var i=0; i< mvl.map.tiles.length -1; i++) { //TODO narrow down to only check collision with nearby tiles
        var collision = mvl.boxCollides(mvl.map.tiles[i].position, mvl.map.tiles[i].size, position, this.size);
        if( collision ) return true;
    }
    return false;
};

Player.prototype.updateStats = function() {
    document.getElementById(this.name + "lives").innerHTML  = this.lives
    document.getElementById(this.name + "score").innerHTML  = this.score
};
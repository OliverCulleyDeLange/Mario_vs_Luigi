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
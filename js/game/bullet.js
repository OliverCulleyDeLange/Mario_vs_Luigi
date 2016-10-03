function bullet(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.sprite = new Sprite('img/ML.png', {x:0,y: 0}, [8,4], 0);
    //                 (url, pos, size, speed, frames, dir, once)

    this.move = function(bullets) {
        if (this.dir === 1) { //Bullet travelling right
            this.pos.x += bulletSpeed * dt;
        }
        else { //Bullets travelling left
            this.pos.x -= bulletSpeed * dt;
        }
        //Remove if off screen
        if(this.pos.x > canvas.width || this.pos.x < 0) {
            var index = bullets.indexOf(this)
            if (index > -1) {
                bullets.splice(index, 1);
            }
        }
    }
    
    this.doCollisionDetection = function(bullets) {
        // Bullet -> Player collisions
        if(boxCollides(players.me.pos, players.me.sprite.size, this.pos, this.sprite.size)) {
            var index = bullets.indexOf(this)
            if (index > -1) {
                bullets.splice(index, 1);
            }
            players.me.kill();
        }
        if (twoPlayer) {
            if(boxCollides(players.opponent.pos, players.opponent.sprite.size, this.pos, this.sprite.size)) {
            var index = bullets.indexOf(this)
            if (index > -1) {
                bullets.splice(index, 1);
            }
            players.opponent.kill();
            }
        }
        // Bullet -> Map collisions
        for (var j=0; j<cubes.length; j++) {
            var cube = cubes[j];
            if(boxCollides(cube.pos, cube.sprite.size, this.pos, this.sprite.size)) {
                bullets.splice(i,1);
            }
        }
    }
};
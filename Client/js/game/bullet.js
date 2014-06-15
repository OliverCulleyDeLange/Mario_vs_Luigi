function bullet(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.sprite = new Sprite('img/ML.png', [0,0], [8,4], 0);
    //                 (url, pos, size, speed, frames, dir, once)

    this.move = function() {
        if (this.dir === 1) { //Bullet travelling right
            this.pos[0] += bulletSpeed * dt;
        }
        else { //Bullets travelling left
            this.pos[0] -= bulletSpeed * dt;
        }
        //Remove if off screen
        if(this.pos[0] > canvas.width || this.pos[0] < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
    
    this.doCollisionDetection = function () {
        // Bullet -> Player collisions
        for (var i=0; i<players.length; i++) {
            var player = players[i];
            if(boxCollides(player.pos, player.sprite.size, this.pos, this.sprite.size)) {
                bullets.splice(i, 1); // Splice removes the bullet item from the array
                player.kill();
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
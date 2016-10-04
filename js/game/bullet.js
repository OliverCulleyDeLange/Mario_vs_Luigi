function Bullet(pos, direction) {
    // Bullet is a Sprite so call Sprite constructor
    Sprite.call(this, 'img/ML.png', {x:0, y:0}, [8,4], 0)

    this.position = pos;
    this.direction = direction;
}

Bullet.prototype = Object.create(Sprite.prototype);
Bullet.prototype.constructor = Sprite;

Bullet.prototype.move = function(bullets) {
    if (this.direction === 1) { //Bullet travelling right
        this.position.x += mvl.state.bulletSpeed * dt;
    }
    else { //Bullets travelling left
        this.position.x -= mvl.state.bulletSpeed * dt;
    }
    //Remove if off screen
    if(this.position.x > canvas.width || this.position.x < 0) {
        var index = bullets.indexOf(this)
        if (index > -1) {
            bullets.splice(index, 1);
        }
    }
}

Bullet.prototype.doCollisionDetection = function(bullets) {
    // Bullet -> Player collisions
    if (mvl.boxCollides(mvl.players.me.position, mvl.players.me.size, this.position, this.size)) {
        var index = bullets.indexOf(this)
        if (index > -1) { bullets.splice(index, 1); }
        mvl.players.me.kill();
    }
    if (mvl.state.twoPlayer) {
        if(mvl.boxCollides(mvl.players.opponent.position, mvl.players.opponent.size, this.position, this.size)) {
            var index = bullets.indexOf(this)
                    if (index > -1) { bullets.splice(index, 1); }
            mvl.players.opponent.kill();
        }
    }
    // Bullet -> Map collisions
    for (var j=0; j<mvl.map.tiles.length; j++) {
        var tile = mvl.map.tiles[j];
        if(mvl.boxCollides(tile.position, tile.size, this.position, this.size)) {
            var index = bullets.indexOf(this)
            if (index > -1) { bullets.splice(index, 1); }
        }
    }
}

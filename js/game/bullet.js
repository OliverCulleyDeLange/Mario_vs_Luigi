function Bullet(pos, direction) {
    // Bullet is a Sprite so call Sprite constructor
    Sprite.call(this, 'img/ML.png', {x:0, y:0}, [8,4], 0)

    this.position = pos;
    this.direction = direction;
}

Bullet.prototype = Object.create(Sprite.prototype);
Bullet.prototype.constructor = Sprite;

Bullet.prototype.move = function() {
    if (this.direction === 1) { //Bullet travelling right
        this.position.x += mvl.state.bulletSpeed * dt;
    }
    else { //Bullets travelling left
        this.position.x -= mvl.state.bulletSpeed * dt;
    }
}

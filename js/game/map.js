var Map = function() {
    this.tiles = [];
}

Map.prototype.draw = function() {
    for (var i=0; i<0; i++) {
        var x = Math.round(innerWidth*Math.random());
        var y = Math.round(innerHeight*Math.random());
        this.tiles[i] = new Tile(x,y);
    }
}


function Tile(x,y) {
    Sprite.call(this, 'img/terrain.png', {x:0 ,y:0}, [16,16], 0)

    this.position = {x: x, y: y}
}

Tile.prototype = Object.create(Sprite.prototype);
Tile.prototype.constructor = Sprite;

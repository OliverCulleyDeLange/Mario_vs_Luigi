var cubes = [];

function drawMap() {
    for (var i=0; i<0; i++) {
        cubes[i] = new cube(Math.round(innerWidth*Math.random()),Math.round(innerHeight*Math.random()));
    }
}

function cube(x,y) {
    this.pos = [x,y];
    this.size = [16, 16];
    this.sprite = new Sprite('img/terrain.png', {x:0,y: 0}, [16, 16], [0]);
};

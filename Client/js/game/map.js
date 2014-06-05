var cubes = [];

function drawMap() {
    console.log("Drawing Map");
    for (a=0; a<innerHeight /2; a++) {
        cubes[a] = new cube(Math.round(innerWidth*Math.random()),Math.round(innerHeight*Math.random()));
    }
}

function cube(x,y) {
    this.pos = [x,y];
    this.size = [16, 16];
    this.sprite = new Sprite('img/terrain.png', [0, 0], [16, 16], [0]);
};

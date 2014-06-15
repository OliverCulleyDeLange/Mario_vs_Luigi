function bullet(pos, dir) {
    this.pos = pos;
    this.dir = dir;
    this.sprite = new Sprite('img/ML.png', [0,0], [8,4], 0);
    //                 (url, pos, size, speed, frames, dir, once)
};
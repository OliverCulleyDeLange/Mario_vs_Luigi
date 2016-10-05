// Main game namespace
var mvl = mvl || {};

mvl.players =  {};
mvl.state = {
    running: false,
    onlinePlay: false,
    twoPlayer: false,
    playerSpeed: 600,
    bulletSpeed: 800,
    gameTime: 0,
    isGameOver: false
}
mvl.keyMaps = {
    mario: {
        up: 'W',
        left: 'A',
        down: 'S',
        right: 'D',
        shoot: 'BSLASH',
        sheild:'SHIFT',
        pickup: 'Z'
    },
    luigi: {
            up: 'UP',
            left: 'LEFT',
            down:'DOWN',
            right: 'RIGHT',
            shoot: 'PERIOD',
            sheild: 'COMMA',
            pickup: 'FSLASH'
    }
}
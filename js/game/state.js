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
    mario: function() {
       return {
            up: document.getElementById('mJump').value || document.getElementById('mJump').placeholder,
            left: document.getElementById('mLeft').value || document.getElementById('mLeft').placeholder,
            down: document.getElementById('mDown').value || document.getElementById('mDown').placeholder,
            right: document.getElementById('mRight').value || document.getElementById('mRight').placeholder,
            shoot: document.getElementById('mShoot').value || document.getElementById('mShoot').placeholder,
       }
    },
    luigi: function() {
        return {
            up: document.getElementById('lJump').value || document.getElementById('lJump').placeholder,
            left: document.getElementById('lLeft').value || document.getElementById('lLeft').placeholder,
            down: document.getElementById('lDown').value || document.getElementById('lDown').placeholder,
            right: document.getElementById('lRight').value || document.getElementById('lRight').placeholder,
            shoot: document.getElementById('lShoot').value || document.getElementById('lShoot').placeholder,
        }
    }
}
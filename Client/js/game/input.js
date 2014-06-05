(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;
        //console.log(code);
        switch(code) {
        //Shift (16) - Sheild | |\ (192) - Pick Up Item | Z (90) - Fire weapon
        //, (188)  Sheild | . (190) - Pick up item | / (191) - Fire weapon
        // Player 1 controls
        case 37:
            key = 'LEFT'; break;
        case 38:
            key = 'UP'; break;
        case 39:
            key = 'RIGHT'; break;
        case 40:
            key = 'DOWN'; break;
        case 188:
            key = 'COMMA'; break;
        case 190:
            key = 'PERIOD'; break;
        case 191:
            key = 'FSLASH'; break;
        // Player 2
        case 65:
            key = 'A'; break;
        case 87:
            key = 'W'; break;
        case 68:
            key = 'D'; break;
        case 83:
            key = 'S'; break;
        case 16:
            key = 'SHIFT'; break;
        case 220:
            key = 'BSLASH'; break;
        case 90:
            key = 'Z'; break;
        //Default
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function(e) {
        setKey(e, true);
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
    });

    window.addEventListener('blur', function() {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        }
    };
})();
function handleInput(dt) {
    switch (true){
        case input.isDown('S'):
            if (mario.onGround === false) {
                mario.velocity[1] = mario.maxVel[1];
            }
            break;
        case input.isDown('W'):
            if (mario.onGround) {
                mario.velocity[1] = mario.minVel[1];
                mario.onGround = false;
            }
            break;
        case input.isDown('A'):
            mario.direction = -1;
            break;
        case input.isDown('D'):
            mario.direction = 1;
            break;
        case input.isDown('SHIFT'):
            mario.sheild = true;
            break;
        case input.isDown('BSLASH'):
            mario.shoot = true;
            break;
        case input.isDown('Z'):
            mario.pickup = true;
            break;
    }
    if(twoPlayer) {
        switch (true){
            case input.isDown('DOWN'):
                if (luigi.onGround === false) {
                    luigi.velocity[1] = luigi.maxVel[1];
                }
                break;
            case input.isDown('UP'):
                if (luigi.onGround) {
                    luigi.velocity[1] = luigi.minVel[1];
                    luigi.onGround = false;
                }
                break;
            case input.isDown('LEFT'):
                luigi.direction = -1;
                break;
            case input.isDown('RIGHT'):
                luigi.direction = 1;
                break;
            case input.isDown('COMMA'):
                luigi.sheild = true;
                break;
            case input.isDown('PERIOD'):
                luigi.shoot = true;
                break;
            case input.isDown('FSLASH'):
                luigi.pickup = true;
                break;
        }
    }
};
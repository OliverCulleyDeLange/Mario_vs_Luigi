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
//        console.log(e.keyCode + " down");
    });

    document.addEventListener('keyup', function(e) {
        setKey(e, false);
//        console.log(e.keyCode + " up");
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
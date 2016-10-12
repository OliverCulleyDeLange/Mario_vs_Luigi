(function() {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;
//        console.log(code);
        switch(code) {
        // Player 1 controls
        case 37:
            key = 'left'; break;
        case 38:
            key = 'up'; break;
        case 39:
            key = 'right'; break;
        case 40:
            key = 'down'; break;
        case 188:
            key = ','; break;
        case 190:
            key = '.'; break;
        case 191:
            key = '/'; break;
        // Player 2
        case 65:
            key = 'a'; break;
        case 87:
            key = 'w'; break;
        case 68:
            key = 'd'; break;
        case 83:
            key = 's'; break;
        case 16:
            key = 'shift'; break;
        case 220:
            key = '\\'; break;
        case 90:
            key = 'z'; break;
        //Default
        default:
            // Convert ASCII codes to letters
            key = String.fromCharCode(code).toLowerCase();
        }

//        console.log("key=" + key)
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
            return pressedKeys[key];
        }
    };
})();
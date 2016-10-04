function hideGameMenu() {
    document.getElementById('game-setup').style.display = "none";
};

function showWaitingRooms() {
    document.getElementById('waiting-room').style.display = "block";
};

function hideWaitingRooms() {
    document.getElementById('waiting-room').style.display = "none";
};

function setWaitingRooms(rooms) {
    //TODO got to be a nicer way of doing this!
    var html = document.createElement('div');
    rooms.forEach(function(room) {
        var btn = document.createElement('button');
        btn.className += btn.className ? ' button-link' : 'button-link';
        btn.setAttribute('data-room', room);
        btn.innerText = room;
        html.appendChild(btn);
    })
    document.getElementById('available-games').innerHTML = html.outerHTML;
    var gameButtons = document.getElementById('available-games').firstChild.children;
    for (var i = gameButtons.length - 1; i >= 0; i--) {
        gameButtons[i].addEventListener('click', joinGame, false);
    };
};

function setOnePlayer() {
    document.getElementById('onePlayer').className += ' button-selected';
    document.getElementById('twoPlayer').className = 'button-link';
    setLocalPlay();
    twoPlayer = false;
};

function setTwoPlayer() {
    document.getElementById('twoPlayer').className += ' button-selected';
    document.getElementById('onePlayer').className = 'button-link';
    twoPlayer = true;
};
      
function setLocalPlay() {
    document.getElementById('localPlay').className += ' button-selected';
    document.getElementById('onlinePlay').className = 'button-link';
    document.getElementById('play').innerHTML = "Play";
    hideWaitingRooms();
    onlinePlay = false;
};

function setOnlinePlay() {
    document.getElementById('onlinePlay').className += ' button-selected';
    document.getElementById('localPlay').className = 'button-link';
    setTwoPlayer();
    showWaitingRooms();
    if (typeof socket === 'undefined' || !socket) {
        socket = io('localhost:3000');

        socket.on('available rooms', function(rooms) {
            console.log("got available rooms:" + rooms);
            setWaitingRooms(rooms);
        });
        socket.on('luigi enter', function(luigi) {
            console.log("luigi has entered");
            createLuigi(false);
        });
        socket.on('partner move', function(newPos) {
            console.log('Partner moved to ' + JSON.stringify(newPos));
            players.opponent.pos = newPos;
        });
        socket.on('partner bullets', function(bulletPositions) {
            console.log('Partner is shooting ' + JSON.stringify(bulletPositions));
            players.opponent.bullets = [];
            bulletPositions.forEach(function(bullet) {
                var b = new Bullet(bullet.pos, bullet.direction);
                players.opponent.bullets.push(b);
            })
        });
        socket.on('partner exit', function() {
            console.log("Partner has left the game")
            gameOver();
        });
    }
    socket.emit('get rooms');
    document.getElementById('play').innerHTML = "Start new game";
    onlinePlay = true;
};
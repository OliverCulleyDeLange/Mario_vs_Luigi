// Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
};

// Reset game to original state
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    //document.getElementById('game-setup').style.display = 'none';
    isGameOver = false;
    gameTime = 0;

    bullets = [];

    mario.pos = [canvas.width * 0.1, canvas.height / 3];
    if(twoPlayer) luigi.pos = [canvas.width * 0.9, canvas.height / 3];
};

function resume() {
    running = true;
    lastTime = Date.now();
    main();
    document.getElementById('resume').style.display = "none";
    document.getElementById('game-over-overlay').style.display = "none";
};

window.addEventListener('blur', function() {
    if(document.getElementById('game-setup').style.display == "none") {
        running = false;
        document.getElementById('resume').style.display = "block";
        document.getElementById('game-over-overlay').style.display = "block";
    }
});
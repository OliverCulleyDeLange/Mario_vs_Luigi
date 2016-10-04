// Game state
var running = false;
var onlinePlay = false;
var twoPlayer = false;
var socket = null;
var players = {};
var playerSpeed = 600;
var bulletSpeed = 800;

var gameTime = 0;
var isGameOver;
var terrainPattern;

var createCanvas = function() {
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    ctx.fillStyle = '#333';
}();

// A cross-browser requestAnimationFrame
// See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
var requestAnimFrame = function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
}();

resources.load([
    'img/ML.png',
    'img/terrain.png'
]);
resources.onReady(setupButtonEventListeners);

function setupButtonEventListeners() {
    document.getElementById('play-reset').addEventListener('click', reset);
    document.getElementById('resume').addEventListener('click', resume);
    document.getElementById('play').addEventListener('click', startGame);
    document.getElementById('onePlayer').addEventListener('click', setOnePlayer);
    document.getElementById('twoPlayer').addEventListener('click', setTwoPlayer);
    document.getElementById('localPlay').addEventListener('click', setLocalPlay);
    document.getElementById('onlinePlay').addEventListener('click', setOnlinePlay);
    // window.addEventListener('blur', function() {
    // if(document.getElementById('game-setup').style.display == "none") {
    //    running = false;
    //    document.getElementById('resume').style.display = "block";
    //    document.getElementById('game-over-overlay').style.display = "block";
    // }
    // });
};
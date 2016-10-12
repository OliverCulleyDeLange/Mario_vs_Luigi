// Everything starts here!
var createCanvas = function(canvasHeight, canvasWidth) {
    mvl.canvas = document.createElement("canvas");
    ctx = mvl.canvas.getContext("2d");
    mvl.canvas.width = canvasWidth;
    mvl.canvas.height = canvasHeight;
    document.body.appendChild(mvl.canvas);
    ctx.fillStyle = '#333';
};
createCanvas(window.innerHeight, window.innerWidth);

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
resources.onReady(function setupButtonEventListeners() {
    document.getElementById('play-reset').addEventListener('click', mvl.actions.reset);
    document.getElementById('resume').addEventListener('click', mvl.actions.resume);
    document.getElementById('play').addEventListener('click', mvl.actions.startGame);
    document.getElementById('onePlayer').addEventListener('click', mvl.menu.setOnePlayer);
    document.getElementById('twoPlayer').addEventListener('click', mvl.menu.setTwoPlayer);
    document.getElementById('localPlay').addEventListener('click', mvl.menu.setLocalPlay);
    document.getElementById('onlinePlay').addEventListener('click', mvl.menu.setOnlinePlay);
    // Uncomment for onblur game pausing. Annoying for debugging
    // window.addEventListener('blur', function() {
    // if(document.getElementById('game-setup').style.display == "none") {
    //    running = false;
    //    document.getElementById('resume').style.display = "block";
    //    document.getElementById('overlay-tint').style.display = "block";
    // }
    // });
});
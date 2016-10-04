/*
 *  MvL
 *  Two player 2D Mario influenced shooter
 *  Basic arrow key interaction (Up (Jump), Left, Right, Down (Drop))
 *  Control character on screen - Kill enemies and other player if 2 player
 *  Score points for kills, more points for killing opponent 
 *  Wider than screen maps (Bigger screens at advantage)
 *  Health Bar | Sheild Bar | Score board
 *  
 *  Phase 2: 
 *  Add Map with scrolling
 *  
 *  Phase 3:
 *  Second local player addition - Allows two players to play on one machine
 *  WASD & Shift & |\ & Z = Player 1
 *  Arrows & ,< & .> & /? = Player 2
 *  Bullet collision detection & death animation
 *  
 *  Phase 4:
 *  Addition of two player online - Node.js?
 *  
 *  TODO:
 *  Screen size scaling
 *  Do colision detection only in area around thing being checked.
 */

mvl.game = {
    main: function() {
        if(!mvl.state.running) return;

        var now = Date.now();
        dt = (now - mvl.state.lastTime) / 1000.0; // dt is number of seconds passed since last update
    //      dt = 0.05; // Use for debugging when you don't want massive DTs because of breakpoints
        mvl.game.update();
        mvl.game.render();

        mvl.state.lastTime = now;
        requestAnimFrame(mvl.game.main);
        //console.log("Game Frame");
    },

    update: function() {
        mvl.state.gameTime += dt;

        mvl.game.updatePlayer(mvl.players.me);
        if (mvl.state.onlinePlay) {
            mvl.players.me.emitPosition();
            mvl.players.me.emitBullets();
        }
        if (mvl.state.twoPlayer && mvl.players.opponent ) {
            mvl.game.updatePlayer(mvl.players.opponent)
        }
    },

    updatePlayer: function(player) {
        player.setDefaultValues();
        player.handleInput();
        player.updateXVelocity();
        player.updateYVelocity();
        player.updatePosition();

        player.checkBounds();
        player.setWalkAnimation();

        if(player.shoot && Date.now() - player.lastFire > 250) {
            player.fireGun();
        }
        player.updateBullets();
        player.updateStats();
    },

    render: function() {
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if(!mvl.state.isGameOver) {
            mvl.game.renderEntity(mvl.players.me);
            mvl.game.renderEntities(mvl.players.me.bullets);

            if (mvl.state.twoPlayer && mvl.players.opponent) {
                mvl.game.renderEntity(mvl.players.opponent);
                mvl.game.renderEntities(mvl.players.opponent.bullets)
            }

            mvl.game.renderEntities(mvl.map.tiles);
        };
    },

    renderEntities: function(list) {
        for(var i=0; i<list.length; i++) {
            mvl.game.renderEntity(list[i]);
        }
    },

    renderEntity: function(entity) {
        ctx.save();
        ctx.translate(entity.position.x, entity.position.y);
        entity.render(ctx, entity.runState);
        ctx.restore();
    }
}


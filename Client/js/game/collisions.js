// Collisions
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
};

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
};

function bulletCollisions() {
    // Check bullet collision with walls and players
    for(var j=0; j<bullets.length; j++) {
        var pos2 = bullets[j].pos;
        var size2 = bullets[j].sprite.size;
        // Checks for bullet -> Player collision
        if(boxCollides(mario.pos, mario.sprite.size, pos2, size2)) {
            bullets.splice(j, 1); // Splice removes the bullet item from the array
            mario.kill();
            break;
        }
        if (twoPlayer) {
            if(boxCollides(luigi.pos, luigi.sprite.size, pos2, size2)) {
                bullets.splice(j, 1); // Splice removes the bullet item from the array
                luigi.kill();
                break;
            }
        }
        // Check for Bullet -> Map collisions
        for (k=0; k<visibleCubes.length; k++) {
            if(boxCollides(cubes[k].pos, cubes[k].sprite.size, pos2, size2)) {
                bullets.splice(j,1);
            }
        }
    }
};

function playerCollisions(pos2, size2) {  //player values passed through
    //Check for Player -> Wall/Map collision
    for (k=0; k<cubes.length; k++) {
        if(boxCollides(cubes[k].pos, cubes[k].sprite.size, pos2, size2)) {
            return true;
            break;
        }
    }
};

function checkPlayerBounds(player) {
    // Check bounds
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if(player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if(player.pos[1] > canvas.height - player.sprite.size[1]-50) {
        player.pos[1] = canvas.height - player.sprite.size[1]-50;
        player.onGround = true;
    }
};
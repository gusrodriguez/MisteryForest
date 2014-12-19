//Creacion del canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;

//Carga los recursos en cache
resources.load([
    'resources/maps/level1-tileset.png',
    'resources/sprites/hero-sprite-walking.png'
]);

//Para que el objeto Sprite dibuje sobre el canvas, es necesario cargar primero todas las imagenes antes de comenzar con el bucle principal
resources.onReady(init);

//$(function () {
//    init();
//});

//Inicializacion: Dibujo de la escena.
function init() {

    lastTime = Date.now();

    scene.load("level1-map");

    main();
}

// Bucle principal
var lastTime;
function main() {

    var now = Date.now();

    var dt = (now - lastTime) / 1000.0;

    update(dt);

    render();

    lastTime = now;

    requestAnimationFrame(main);
};

function update(dt) {
    //gameTime += dt;

    handleInput(dt);
};

// Draw everything
function render() {
    //ctx.fillStyle = terrainPattern;
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Redibuja la escena completa
    scene.load("level1-map");

    renderEntity(player);

    // Render the player if the game isn't over
    //if (!isGameOver) {
        //renderEntity(player);
    //}
};

function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);

    //// Update all the bullets
    //for(var i=0; i<bullets.length; i++) {
    //    var bullet = bullets[i];

    //    switch(bullet.dir) {
    //        case 'up': bullet.pos[1] -= bulletSpeed * dt; break;
    //        case 'down': bullet.pos[1] += bulletSpeed * dt; break;
    //        default:
    //            bullet.pos[0] += bulletSpeed * dt;
    //    }

    //    // Remove the bullet if it goes offscreen
    //    if(bullet.pos[1] < 0 || bullet.pos[1] > canvas.height ||
    //       bullet.pos[0] > canvas.width) {
    //        bullets.splice(i, 1);
    //        i--;
    //    }
    //}

    //// Update all the enemies
    //for(var i=0; i<enemies.length; i++) {
    //    enemies[i].pos[0] -= enemySpeed * dt;
    //    enemies[i].sprite.update(dt);

    //    // Remove if offscreen
    //    if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
    //        enemies.splice(i, 1);
    //        i--;
    //    }
    //}

    //// Update all the explosions
    //for(var i=0; i<explosions.length; i++) {
    //    explosions[i].sprite.update(dt);

    //    // Remove if animation is done
    //    if(explosions[i].sprite.done) {
    //        explosions.splice(i, 1);
    //        i--;
    //    }
    //}
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function handleInput(dt) {
    
    if (input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        updateEntities(dt)
    }

    //if (input.isDown('UP') || input.isDown('w')) {
    //    player.pos[1] -= playerSpeed * dt;
    //}

    //if (input.isDown('LEFT') || input.isDown('a')) {
    //    player.pos[0] -= playerSpeed * dt;
    //}

    //if (input.isDown('SPACE') &&
    //    !isGameOver &&
    //    Date.now() - lastFire > 100) {
    //    var x = player.pos[0] + player.sprite.size[0] / 2;
    //    var y = player.pos[1] + player.sprite.size[1] / 2;

    //    bullets.push({
    //        pos: [x, y],
    //        dir: 'forward',
    //        sprite: new Sprite('img/sprites.png', [0, 39], [18, 8])
    //    });
    //    bullets.push({
    //        pos: [x, y],
    //        dir: 'up',
    //        sprite: new Sprite('img/sprites.png', [0, 50], [9, 5])
    //    });
    //    bullets.push({
    //        pos: [x, y],
    //        dir: 'down',
    //        sprite: new Sprite('img/sprites.png', [0, 60], [9, 5])
    //    });

    //    lastFire = Date.now();
    //}
}
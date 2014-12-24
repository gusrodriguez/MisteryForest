//Cross browser requestAnimationFrame

var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

//Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);
var tileSize = 32;
var amountTilesHorizontal = 20;
var amountTilesVertical = 15;

//Velocidades de las entidades
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;

//Entidades múltiples
var bullets = [];
var enemies = [];
var explosions = [];

//Estado general
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var backgroundPattern;

//Carga los recursos en cache
resources.load([
    'resources/maps/level1-tileset.png',
    'resources/sprites/hero-sprite-walking.png',
    'resources/maps/level1-map.png',
    'resources/maps/level1-map-grid.png'
]);

var playerSizeX = 64;
var playerSizeY = 64;

var initialPlayerPositionX = 0;
var initialPlayerPositionY = 0;

//Jugador principal
var player = {
    pos: [initialPlayerPositionX, initialPlayerPositionY],
    previousPos: [], //Una foto de la posición inmediata anterior para resolver las colisiones
    sprite: new Sprite('resources/sprites/hero-sprite-walking.png', [initialPlayerPositionX, initialPlayerPositionY], [playerSizeX, playerSizeY], 16, [0, 1, 2, 3, 4, 5, 6, 7])
};

//Para que el objeto Sprite dibuje sobre el canvas, es necesario cargar primero todas las imagenes antes de comenzar con el bucle principal
resources.onReady(init);

//Inicializacion: Dibujo de la escena.
function init() {

    lastTime = Date.now();
    
    backgroundPattern = ctx.createPattern(resources.get('resources/maps/level1-map-grid.png'), 'no-repeat');

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

    requestAnimFrame(main);
};

function update(dt) {

    //gameTime += dt;

    handleInput(dt);

    checkCollisions();
};

function checkCollisions() {

    checkPlayerBounds();
    
    if (scene.tilesetInfo !== undefined) 
    {
        var wallBlocks = scene.tilesetInfo.layers[1].data;

        for (var i = 0; i < wallBlocks.length; i++)
        {
            //Si hay un bloque colisionable
            if (wallBlocks[i] != 0) {

                var blockPosition = [];
                var blockSize = [];
                var playerSize = [];

                //Calcula la posicion del bloque colisionable dado el indice de la matriz del mapa.
                blockPosition = CalculateTilePositionByIndex(i);
                
                blockSize[0] = tileSize;
                blockSize[1] = tileSize;
                
                playerSize[0] = playerSizeX;
                playerSize[1] = playerSizeY;
                
                if (boxCollides(blockPosition, blockSize, player.pos, playerSize)) {
                    player.pos[0] = player.previousPos[0];
                    player.pos[1] = player.previousPos[1];
                }
            }
        }
    }


//// Run collision detection for all enemies and bullets
    //for (var i = 0; i < enemies.length; i++) {
    //    var pos = enemies[i].pos;
    //    var size = enemies[i].sprite.size;

    //    for (var j = 0; j < bullets.length; j++) {
    //        var pos2 = bullets[j].pos;
    //        var size2 = bullets[j].sprite.size;

    //        if (boxCollides(pos, size, pos2, size2)) {
    //            // Remove the enemy
    //            enemies.splice(i, 1);
    //            i--;

    //            // Add score
    //            score += 100;

    //            // Add an explosion
    //            explosions.push({
    //                pos: pos,
    //                sprite: new Sprite('img/sprites.png',
    //                                   [0, 117],
    //                                   [39, 39],
    //                                   16,
    //                                   [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    //                                   null,
    //                                   true)
    //            });

    //            // Remove the bullet and stop this iteration
    //            bullets.splice(j, 1);
    //            break;
    //        }
    //    }

    //    if (boxCollides(pos, size, player.pos, player.sprite.size)) {
    //        gameOver();
    //    }
    //}
}

//Calcula la posicion del Tile (extremo superior izquierdo) dado su índice en la matriz del mapa.
function CalculateTilePositionByIndex(index) {

    var blockPosition = [];

    //Ubica la fila en la matriz de bloques
    var row = Math.floor(index / amountTilesHorizontal);
    var column = index - (2 * row * 10);

    //Toma el punto que representa la esquina superior izquierda del Tile colisionable en curso
    var posYColisionableTile = row * tileSize;
    var posXColisionableTile = column * tileSize;

    blockPosition[0] = posXColisionableTile;
    blockPosition[1] = posYColisionableTile;

    return blockPosition;
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

//Mantiene al jugador dentro del canvas
function checkPlayerBounds() {

    if (player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if (player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }

    if (player.pos[1] < 0) {
        player.pos[1] = 0;
    }
    else if (player.pos[1] > canvas.height - player.sprite.size[1]) {
        player.pos[1] = canvas.height - player.sprite.size[1];
    }
}

// Dibuja
function render() {
   
    //Redibuja la escena completa en cada frame
    //El redibujo es un fillRect con el fillstyle que representa la imagen de fondo
    ctx.fillStyle = backgroundPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
   
    //Redibuja la entidad
    renderEntity(player);

    // Render the player if the game isn't over
    //if (!isGameOver) {
        //renderEntity(player);
    //}
};

// Actualiza el estado de todas las entidades
function updateEntities(dt) {
    
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
    //ctx.rotate(-180 + Math.PI / 2.0);
    entity.sprite.render(ctx);
    ctx.restore();
}

function StorePreviousPosition(player) {
    player.previousPos = player.pos.slice();
}

//Controller para los input
function handleInput(dt) {
    
    if (input.isDown('RIGHT')) { // || input.isDown('d')) {
        StorePreviousPosition(player);
        
        if (!input.anyKeyPressed()) {
            player.pos[0] += playerSpeed * dt;
        }
        updateEntities(dt);
    }

    if (input.isDown('UP') || input.isDown('w')) {
        StorePreviousPosition(player);

        if (!input.anyKeyPressed()) {
            player.pos[1] -= playerSpeed * dt;
        }
        
        updateEntities(dt);
    }
    
    if (input.isDown('DOWN') || input.isDown('w')) {
        StorePreviousPosition(player);

        if (!input.anyKeyPressed()) {
            player.pos[1] += playerSpeed * dt;
        }
        
        updateEntities(dt);
    }

    if (input.isDown('LEFT') || input.isDown('a')) {
        StorePreviousPosition(player);

        if (!input.anyKeyPressed()) {
            player.pos[0] -= playerSpeed * dt;
        }
        
        updateEntities(dt);
    }

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
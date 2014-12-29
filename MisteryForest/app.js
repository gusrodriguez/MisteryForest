//Variables globales

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
var gridSufix = "";

//Velocidades de las entidades
var playerSpeed = 200;
var bulletSpeed = 500;
var enemySpeed = 100;

//Entidades múltiples
var bullets = [];
var enemies = [];
var explosions = [];

//Estado del juego
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var backgroundPattern;

var tilesetUrl = 'resources/maps/level1-tileset.png';
var playerSpriteUrlRight = 'resources/sprites/hero-sprite-walking-right.png';
var playerSpriteUrlLeft = 'resources/sprites/hero-sprite-walking-left.png';
var stage1Url = 'resources/maps/level1-map.png';

//Carga los recursos
resources.load([
    tilesetUrl,
    playerSpriteUrlRight,
    playerSpriteUrlLeft,
    stage1Url
]);

//Para que el objeto Sprite dibuje sobre el canvas, es necesario cargar primero todas las imagenes antes de comenzar con el bucle principal
resources.onReady(init);

//Inicializacion: Dibujo de la escena.
function init() {

    lastTime = Date.now();
    
    backgroundPattern = ctx.createPattern(resources.get(stage1Url), 'no-repeat');

    scene.load("level1-map");

    main();
}

// Bucle principal
var lastTime;

function main() {

    var now = Date.now();

    var dt = (now - lastTime) / 1000.0;

    update(dt);

    scene.render();

    player.render();
    
    lastTime = now;

    requestAnimFrame(main);
};

function update(dt) {

    //gameTime += dt;

    //Si el personaje está detenido, no ejecuta la animación
    player.sprite.animate(false);

    //Aplica gravedad
    scene.applyGravity(dt, player);
    
    handleInput(dt);
    
    scene.updateEntities(dt, player);
 };

//Controller para los input
function handleInput(dt) {
    
    //Se registra el input
    if (input.isDown('RIGHT')) {

        //Toma el sprite para la animación
        player.sprite.changeUrl(playerSpriteUrlRight);

        //Se almacena la posicion anterior del jugador
        player.savePreviousPosition();

        //Se recalcula la nueva posición del jugador
        player.moveRight(dt);

        //Se valida que en la nueva posición del jugador, no haya ninguna colisión en la escena
        if (scene.collided(player)) {

            //Si hubo colisión, se restaura la posición inmediata anterior para redibujar al personaje detenido ante la colisión
            player.restorePreviousPosition();
        }
    }

    if (input.isDown('UP')) {

        player.savePreviousPosition();

        player.moveUp(dt);
        
        if (scene.collided(player)) {
            player.restorePreviousPosition();
        }
    }
    
    if (input.isDown('DOWN')) {
        
        player.savePreviousPosition();

        player.moveDown(dt);
        
        if (scene.collided(player)) {
            player.restorePreviousPosition();
        }
    }

    if (input.isDown('LEFT')) {
        
        player.sprite.changeUrl(playerSpriteUrlLeft);

        player.savePreviousPosition();

        player.moveLeft(dt);
        
        if (scene.collided(player)) {
            player.restorePreviousPosition();
        }
    }

    //if (input.isDown('SPACE') &&
    //    !isGameOver &&
    //    Date.now() - lastFire > 100) {
    //    var x = player.position[0] + player.sprite.size[0] / 2;
    //    var y = player.position[1] + player.sprite.size[1] / 2;

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
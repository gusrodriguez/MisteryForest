//requestAnimationFrame cross browser
var requestAnimFrame = (function () {

    return window.requestAnimationFrame       ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame    ||
           window.oRequestAnimationFrame      ||
           window.msRequestAnimationFrame     ||

        function (callback) {

            window.setTimeout(callback, 1000 / 60);

        };
})();

//Canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");

canvas.width = 640;
canvas.height = 480
document.body.appendChild(canvas);

//Entidades múltiples
var bullets    = [];
var enemies    = [];
var explosions = [];

//Estado del juego
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var backgroundPattern;

//Ubicación de los recursos
var tilesetUrl = 'resources/maps/level1-tileset.png';
var stage1Url  = 'resources/maps/level1-map.png';
var playerSpriteUrlWalkRight  = 'resources/sprites/hero-sprite-walking-right.png';
var playerSpriteUrlWalkLeft   = 'resources/sprites/hero-sprite-walking-left.png';
var playerSpriteUrlJumpRight  = 'resources/sprites/hero-sprite-jumping-right.png';
var playerSpriteUrlJumpLeft   = 'resources/sprites/hero-sprite-jumping-left.png';
var playerSpriteUrlShootRight = 'resources/sprites/hero-sprite-shooting-right.png';

//Matriz del mapa del nivel
var level;

//Carga los recursos
resources.load([
    tilesetUrl,
    stage1Url,
    playerSpriteUrlWalkRight,
    playerSpriteUrlWalkLeft,
    playerSpriteUrlJumpRight,
    playerSpriteUrlJumpLeft,
    playerSpriteUrlShootRight
]);

//Para que el objeto Sprite dibuje sobre el canvas, es necesario cargar primero todas las imagenes antes de comenzar con el bucle principal
resources.onReady(init);

//Inicializacion: Dibujo de la escena.
function init() {

    lastTime = Date.now();

    backgroundPattern = ctx.createPattern(resources.get(stage1Url), 'no-repeat');

    //Cuando se termina de cargar la escena, da inicio al bucle principal
    scene.load("level1-map").done(function () {

        //Matriz de 20 x 15 que representa el mapa del nivel y la ubicación de los tiles colisionables
        level = listToMatrix(scene.tilesetInfo.layers[1].data, 20);

        main();
    });
}

// Bucle principal
var lastTime;

function main() {

    var now = Date.now();
    
    dt = (now - lastTime) / 1000.0;
    
    update();
    
    lastTime = now;
    
    requestAnimFrame(main);
};

function update() {

    //Dibuja el mapa
    scene.render();

    //Dibuja al jugador
    player.render();

    //No hay friccion ni inercia, entonces en cada frame la velocidad inicial del jugador en X es cero
    player.speedX = 0;

    //La velocidad en Y del jugador siempre es afectada por la gravedad
    player.speedY += scene.gravity;

    // Limita la velocidad de la caída en el eje Y
    player.speedY = Math.min(player.speedY, player.maxFallingSpeed);
    
    //Si está en el piso, anula la secuencia lineal de animación
    if (player.onTheGround) {
        player.sprite.linearSequence = false;
    }

    //Si está detenido, cancela la animación
    if (player.speedX == 0) {
        player.sprite.animate(false);
    }

    //Captura el input
    inputHandler.handle(player);

    //Guarda la posición del jugador antes de modificarla
    player.savePreviousPosition();

    //Actualiza la posición del jugador
    player.positionX += player.speedX;
    player.positionY += player.speedY;

    //Mantiene al jugador dentro del canvas
    player.keepInsideCanvas();

    //Detección y resolución de colisiones
    scene.handleCollisions(player);

    //Actualiza el estado de todas las entidades en la escena
    scene.updateEntities(player);
};


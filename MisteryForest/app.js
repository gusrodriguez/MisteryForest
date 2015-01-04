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
canvas.height = 480
document.body.appendChild(canvas);
var gridSufix = "";

//Entidades múltiples
var bullets = [];
var enemies = [];
var explosions = [];

//Estado del juego
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var backgroundPattern;

//Ubicación de los recursos
var tilesetUrl = 'resources/maps/level1-tileset.png';
var playerSpriteUrlRight = 'resources/sprites/hero-sprite-walking-right.png';
var playerSpriteUrlLeft = 'resources/sprites/hero-sprite-walking-left.png';
var stage1Url = 'resources/maps/level1-map.png';

var level;

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

    //No hay friccion ni inercia, entonces en cada frame la velocidad inicial del jugador es cero
    player.speedX = 0;

    //La velocidad en Y del jugador siempre es afectada por la gravedad
    player.speedY += scene.gravity;

    // Limita la velocidad de la caída en el eje Y
    player.speedY = Math.min(player.speedY, player.maxFallingSpeed);

    // Actualiza la velocidad del jugador de acuerdo a la tecla presionada
    if (rightPressed) {
        player.speedX = player.movementSpeed;

        //Cambia los recursos para que se muestre el sprite del personaje caminando hacia la derecha
        player.sprite.changeUrl('resources/sprites/hero-sprite-walking-right.png');

        //Inicia la animación del sprite
        player.sprite.animate(true);
    }
    else {
        //Cancela la animación si el personaje está detenido
        player.sprite.animate(false);

        if (leftPressed) {
            player.speedX = -player.movementSpeed;

            player.sprite.changeUrl('resources/sprites/hero-sprite-walking-left.png');

            player.sprite.animate(true);

        }
        else {
            player.sprite.animate(false);

            //TODO
            if (upPressed) {
                /*player.speedY=-movementSpeed;*/
            }
            else {
                if (downPressed) {
                    /*player.speedY=movementSpeed;*/
                }
            }
        }
    }

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
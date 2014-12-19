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

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}

function handleInput(dt) {
    if (input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }
}
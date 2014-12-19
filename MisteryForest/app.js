//Creacion del canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

$(function () {
    init();
});

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

    requestAnimFrame(main);
};
//Estado del juego
var player = {
    pos: [64, 64],
    sprite: new Sprite('resources/sprites/hero-sprite-walking.png', [0, 0], [64, 64], 16, [0, 1, 2, 3, 4, 5, 6, 7])
};

var bullets = [];
var enemies = [];
var explosions = [];

var lastFire = Date.now();
var gameTime = 0;
var isGameOver;
var terrainPattern;
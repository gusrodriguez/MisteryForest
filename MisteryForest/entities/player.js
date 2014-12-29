var playerSizeX = 64;
var playerSizeY = 64;

var initialPlayerPositionX = 0;
var initialPlayerPositionY = 0;

//Jugador principal
var player = {
    
    gravity: 0.5,
    
    fallSpeed: 200,
        
    position: [initialPlayerPositionX, initialPlayerPositionY],

    previousPosition: [], 

    sprite: new Sprite('resources/sprites/hero-sprite-walking-right.png', [initialPlayerPositionX, initialPlayerPositionY], [playerSizeX, playerSizeY], 16, [0, 1, 2, 3, 4, 5, 6, 7]),
    
    //Mantiene al jugador dentro del canvas
    keepInsideCanvas: function () {
        
        if (this.position[0] < 0) {
            this.position[0] = 0;
        }
        else if (this.position[0] > canvas.width - this.sprite.size[0]) {
            this.position[0] = canvas.width - this.sprite.size[0];
        }

        if (this.position[1] < 0) {
            this.position[1] = 0;
        }
        else if (this.position[1] > canvas.height - this.sprite.size[1]) {
            this.position[1] = canvas.height - this.sprite.size[1];
        }
    },
    
    //Toma una foto de la posicion anterior inmediata
    savePreviousPosition: function() {
        this.previousPosition = this.position.slice();
    },
    
    //Dibuja al jugador
    render: function () {
        
        ctx.save();

        ctx.translate(this.position[0], this.position[1]);

        //ctx.rotate(-180 + Math.PI / 2.0);

        this.sprite.render(ctx);

        ctx.restore();
    },
    
    moveRight: function (dt) {
        player.position[0] += playerSpeed * dt;
    },
    
    moveLeft: function (dt) {
        player.position[0] -= playerSpeed * dt;
    },
    
    moveUp: function (dt) {
        player.position[1] -= playerSpeed * dt;
    },
    
    moveDown: function (dt) {
        player.position[1] += playerSpeed * dt;
    },
    
    restorePreviousPosition: function () {
        player.position[0] = player.previousPosition[0];
        player.position[1] = player.previousPosition[1];
    },
    applyGravity: function (dt) {

        if (!this.isOnTheGround()) {
            this.fallSpeed += this.gravity;
        }
        player.position[1] += this.fallSpeed * dt;
    },
    
    isOnTheGround: function () {
        
        player.savePreviousPosition();

        var isOnTheGround = false;

        this.moveDown();
        
        if (scene.collided(player)) {
            isOnTheGround = true;
            player.restorePreviousPosition();
        }
        
        return isOnTheGround;
    }
};
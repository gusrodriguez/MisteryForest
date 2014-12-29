var playerSizeX = 64;
var playerSizeY = 64;

var initialPlayerPositionX = 0;
var initialPlayerPositionY = 0;

//Jugador principal
var player = {
    
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
        
        this.sprite.render(ctx);

        ctx.restore();
    },
    
    moveRight: function (dt) {
        
        if (player.isOnTheGround(dt)) {
            player.position[0] += playerSpeed * dt;
            this.sprite.animate(true);
        }
    },
    
    moveLeft: function (dt) {

        if (player.isOnTheGround(dt)) {
            player.position[0] -= playerSpeed * dt;
            this.sprite.animate(true);
        }
    },
    
    moveUp: function (dt) {

        if (player.isOnTheGround(dt)) {
            player.position[1] -= playerSpeed * dt;
            this.sprite.animate(true);
        }
    },
    
    moveDown: function (dt) {
        player.position[1] += playerSpeed * dt;
        this.sprite.animate(true);
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
    
    isOnTheGround: function (dt) {
        
        player.savePreviousPosition();

        var isOnTheGround = false;

        this.moveDown(dt);
        
        if (scene.collided(player)) {
            isOnTheGround = true;
            player.restorePreviousPosition();
        }
        
        //Anula la animación del sprite en la comprobación del movimiento hacia abajo
        this.sprite.animate(false);
        
        return isOnTheGround;
    }
};
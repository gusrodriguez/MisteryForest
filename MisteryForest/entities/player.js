var initialPlayerPositionX = 0;
var initialPlayerPositionY = 0;

//Jugador principal
var player = {
    
    //Indica si el jugador está en modo asesino
    killerMode: false,

    //Indica si el jugador está en el piso
    onTheGround: false,

    //Indica si finalizó el salto
    jumped: false,
    
    //Indica si está disparando
    firing: false,

    //Timestamps del último salto, cuando el jugador tocó el suelo
    lastTouch: 0,

    //Delay en milisegundos entre un salto y otro, para poder hacer un supersalto
    doubleJumpDelay: 50,

    //La velocidad máxima de caída
    maxFallingSpeed: 10,

    //Tamaño del jugador
    size: playerSizeX,

    //Velocidad de movimiento, en pixels/frame
    movementSpeed: 3,

    //Velocidad horizontal, en pixels/frame
    speedX: 0,

    //Velocidad horizontal, en pixels/frame
    speedY: 0,

    //Convierte la posición Y del jugador de tiles a pixels
    positionY: initialPlayerPositionX * scene.tileSize + scene.sizeDiff / 2,

    //Convierte la posición X del jugador de tiles a pixels
    positionX: initialPlayerPositionY * scene.tileSize + scene.sizeDiff / 2,

    //Posición X del jugador anterior al movimiento, para resolver la colisión
    previousPositionX: 0,

    //Posición Y del jugador anterior al movimiento, para resolver la colisión
    previousPositionY: 0,

    //Velocidad del salto
    jumpSpeed: 9,

    //Velocidad del supersalto
    superJumpSpeed: 15,
    
    //Si está mirando hacia la derecha
    isFacingRight: true,
    
    //Si está mirando hacia la izquierda
    isFacingLeft: false,

    sprite: new Sprite('resources/sprites/hero-sprite-walking-right.png', [initialPlayerPositionX, initialPlayerPositionY], [playerSizeX, playerSizeY], 16, [0, 1, 2, 3, 4, 5, 6, 7]),
    
    faceRight: function () {
        this.isFacingRight = true;
        this.isFacingLeft = false;
    },

    faceLeft: function () {
        this.isFacingRight = false;
        this.isFacingLeft = true;
    },

    savePreviousPosition: function () {
        this.previousPositionX = this.positionX;
        this.previousPositionY = this.positionY;
    },

    restorePreviousPositionX: function () {
        this.positionX = this.previousPositionX;
    },

    restorePreviousPositionY: function () {
        this.positionY = this.previousPositionY;
    },

    //Mantiene al jugador dentro del canvas
    keepInsideCanvas: function () {

        if (this.positionX < 0) {
            this.speedX = 0;
            this.positionX = 0;
        }
        else if (this.positionX > canvas.width - this.sprite.size[0]) {
            this.speedX = 0;
            this.positionX = canvas.width - this.sprite.size[0];
        }

        if (this.positionY < 0) {
            this.speedY = 0;
            this.positionY = 0;
        }
        else if (this.positionY > canvas.height - this.sprite.size[1]) {
            this.positionY = canvas.height - this.sprite.size[1];
            this.speedY = 0;
        }
    },
    
    changeToKillerMode: function () {

        this.killerMode = true;

        if (this.isFacingRight)
        {
            this.sprite.changeUrl('resources/sprites/hero-sprite-walking-killer-right.png');
        }
        else if(this.isFacingLeft)
        {
            this.sprite.changeUrl('resources/sprites/hero-sprite-walking-killer-left.png');
        }
    },
    
    changeToNormalMode: function () {

        this.killerMode = false;

        if (this.isFacingRight) {
            this.sprite.changeUrl('resources/sprites/hero-sprite-walking-right.png');
        }
        else if (this.isFacingLeft) {
            this.sprite.changeUrl('resources/sprites/hero-sprite-walking-left.png');
        }
    },

        //Dibuja al jugador
    render: function () {

        ctx.save();

        ctx.translate(this.positionX, this.positionY);

        this.sprite.render(ctx);

        ctx.restore();
    },
};
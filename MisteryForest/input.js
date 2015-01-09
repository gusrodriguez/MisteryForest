var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

document.addEventListener("keydown", function (ev) {
    switch (ev.keyCode) {
        case 37:

            leftPressed = true;
            break;

        case 32:

            // El salto se produce cuando se satisfacen estas tres condiciones.
            // 1 - El jugador está en el piso.
            // 2 - La velocidad en Y es igual a cero.
            // 3 - El botón de salto está liberado.
            if (player.onTheGround && player.speedY == 0 && !upPressed) {

                //console.log(new Date().getTime() - player.lastTouch);
                if (new Date().getTime() - player.lastTouch < player.doubleJumpDelay) {
                    player.speedY = -player.superJumpSpeed;
                }
                else {
                    player.speedY = -player.jumpSpeed;
                }

                player.jumped = true;
                player.onTheGround = false;

                //Recursos y cantidad de frames para la secuencia de animacion del salto
                var resourceUrl;

                if (player.isFacingRight) 
                {
                    resourceUrl = 'resources/sprites/hero-sprite-jumping-right.png';
                }
                else if (player.isFacingLeft)
                {
                    resourceUrl = 'resources/sprites/hero-sprite-jumping-left.png';
                }

                var framesNumberToAnimate = 8;
                player.sprite.animate(true);
                player.sprite.animateLinearSequence(resourceUrl, framesNumberToAnimate);
            }

            upPressed = true;
            break;

        case 39:

            rightPressed = true;
            break;

        case 40:

            downPressed = true;
            break;
    }
}, false);

document.addEventListener("keyup", function (ev) {
    switch (ev.keyCode) {
        case 37:
            leftPressed = false;
            break;
        case 32:
            upPressed = false;
            break;
        case 39:
            rightPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
    }
}, false);

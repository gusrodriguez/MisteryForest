var leftPressed = false;
var rightPressed = false;
var jumpPressed = false;
var downPressed = false;
var firePressed = false;

document.addEventListener("keydown", function (ev) {
    
    var resourceUrl;
    var framesNumberToAnimate;

    switch (ev.keyCode) {
    
        case 37:

            leftPressed = true;
            break;

        //Salto
        case 32:

            // El salto se produce cuando se satisfacen estas tres condiciones.
            // 1 - El jugador está en el piso.
            // 2 - La velocidad en Y es igual a cero.
            // 3 - El botón de salto está liberado.
            if (player.onTheGround && player.speedY == 0 && !jumpPressed) {
                
                if (new Date().getTime() - player.lastTouch < player.doubleJumpDelay) {
                    player.speedY = -player.superJumpSpeed;
                }
                else {
                    player.speedY = -player.jumpSpeed;
                }

                player.jumped = true;
                player.onTheGround = false;

                //Recursos y cantidad de frames para la secuencia de animacion del salto
                if (player.isFacingRight) 
                {
                    resourceUrl = 'resources/sprites/hero-sprite-jumping-right.png';
                }
                else if (player.isFacingLeft)
                {
                    resourceUrl = 'resources/sprites/hero-sprite-jumping-left.png';
                }
                framesNumberToAnimate = 8;
                player.sprite.animate(true);
                player.sprite.animateLinearSequence(resourceUrl, framesNumberToAnimate);
            }

            jumpPressed = true;
            break;

        case 39:

            rightPressed = true;
            break;

        case 40:

            downPressed = true;
            break;
            
        case 65:
            if (!firePressed)
            {
                player.firing = true;

                if (player.isFacingRight)
                {
                    resourceUrl = 'resources/sprites/hero-sprite-shooting-right.png';
                }
                else if (player.isFacingLeft)
                {
                    //resourceUrl = 'resources/sprites/hero-sprite-jumping-left.png';
                }
                framesNumberToAnimate = 16;
                player.sprite.animate(true);
                player.sprite.animateLinearSequence(resourceUrl, framesNumberToAnimate);
            }
            
            firePressed = true;
            break;
    }
}, false);

document.addEventListener("keyup", function (ev) {
    
    switch (ev.keyCode) {
        case 37:
            leftPressed = false;
            break;
        case 32:
            jumpPressed = false;
            break;
        case 39:
            rightPressed = false;
            break;
        case 40:
            downPressed = false;
            break;
        case 65:
            firePressed = false;
            player.firing = false;
            break;
    }
}, false);

//El inputhandler está dentro del bucle principal
var inputHandler = {
    
    handle: function (player) {

        if (rightPressed) {

            player.speedX = player.movementSpeed;

            player.faceRight();

            //Cambia los recursos para que se muestre el sprite del personaje caminando hacia la derecha
            if (player.killerMode)
            {
                player.sprite.changeUrl('resources/sprites/hero-sprite-walking-killer-right.png');
            }
            else
            {
                player.sprite.changeUrl('resources/sprites/hero-sprite-walking-right.png');
            }

            //Inicia la animación del sprite
            player.sprite.animate(true);
        }

        if (leftPressed) {

            player.speedX = -player.movementSpeed;

            player.faceLeft();

            if (player.killerMode)
            {
                player.sprite.changeUrl('resources/sprites/hero-sprite-walking-killer-left.png');
            }
            else
            {
                player.sprite.changeUrl('resources/sprites/hero-sprite-walking-left.png');
            }

            player.sprite.animate(true);

        }

        if (jumpPressed) {
            player.sprite.animate(true);
        }

        if (firePressed) {
            player.sprite.animate(true);
        } 

        //TODO: Agacharse
        if (downPressed) {
        }
    }
}
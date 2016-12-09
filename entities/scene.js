var playerSizeX = 64;
var playerSizeY = 64;
var tileSize = 32;
var sizeDiff = playerSizeX - tileSize;

var scene = {

    //Aceleración de la gravedad, en pixels / frame x frame
    gravity: 0.5,

    tileSize: tileSize,

    sizeDiff: Math.abs(sizeDiff),

    layers: [],
    
    //El número de Tile en el TileMap donde está ubicada el arma en el nivel
    weaponTileNumber: 92,

    renderLayer: function (layer) {

        // data: arrays de tiles, 1-based, posición del sprite desde la esquina superior izquierda
        // height: numero de sprites
        // name: nombre interno de la capa
        // type: tipo de capa (tile, object)
        // width: ancho en numero de sprites
        // x: posición inicial en X
        // y: posición inicial en Y

        if (layer.type !== "tilelayer" || !layer.opacity) {
            return;
        }

        var clonedContext = canvas.cloneNode();

        var size = scene.data.tilewidth;

        clonedContext = clonedContext.getContext("2d");

        if (scene.layers.length < scene.data.layers.length)
        {
            layer.data.forEach(function (tileIndex, i) {

                if (!tileIndex)
                {
                    return;
                }

                var imageX, imageY, sceneX, sceneY;
                var tile = scene.data.tilesets[0];

                tileIndex--;

                imageX = (tileIndex % (tile.imagewidth / size)) * size;
                imageY = ~~(tileIndex / (tile.imagewidth / size)) * size;
                sceneX = (i % layer.width) * size;
                sceneY = ~~(i / layer.width) * size;

                clonedContext.drawImage(scene.tileset, imageX, imageY, size, size,
                            sceneX, sceneY, size, size);
            });

            scene.layers.push(clonedContext.canvas.toDataURL());

            ctx.drawImage(clonedContext.canvas, 0, 0);
        }
        else
        {
            scene.layers.forEach(function (src) {
                var i = $("<img />", { src: src })[0];
                ctx.drawImage(i, 0, 0);
            });
        }
    },

    renderLayers: function (layers) {
        layers = $.isArray(layers) ? layers : this.data.layers;
        layers.forEach(this.renderLayer);
    },

    loadTileset: function (json) {
        this.data = json;
        this.tileset = $("<img />", { src: '../resources/maps/' + json.tilesets[0].image })[0];
        this.tileset.onload = $.proxy(this.renderLayers, this);
    }, 

    load: function (name) {
        //Si el tileset no se cargó, lo va a buscar al servidor.
        if (scene.tilesetInfo === undefined){

            return $.getJSON('../resources/maps/level1-tilemap.json').done(function (json) {

                scene.tilesetInfo = json;

                $.proxy(this.loadTileset, this);
            });
        } else {
            //Si el tileset está cacheado, redibuja la escena con la información en memoria
            scene.data = scene.tilesetInfo;

            scene.renderLayers(scene.layers);
        }
    },   

    //Dibuja la escena
    render: function () {

        //Redibuja la escena completa en cada frame
        //El redibujo es un fillRect con el fillstyle que representa la imagen de fondo
        ctx.fillStyle = backgroundPattern;

        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //TODO: Preguntar si el juego no terminó antes de dibujar al jugador
        //if (!isGameOver) {
        //  renderEntity(player);
        //}
    },

    //Detección y resolución de colisiones.
    //La detección se realiza usando la matriz del nivel, y detectando los elementos colisionables en la vecindad de la dirección a la que se intenta moverse
    //La resolución se realiza seteando la velocidad del jugador en cero y restaurando su posición a la anterior
    handleCollisions: function (player) {

        var mapElement = 0;

        //La columna en la matriz del nivel en la que el jugador se encuentra posicionado
        var baseCol = Math.floor((player.positionX + player.size) / tileSize) - 1;

        //La fila en la matriz del nivel en la que el jugador se encuentra posicionado
        var baseRow = Math.floor((player.positionY + player.size) / tileSize) - 1;

        var colOverlap = (player.positionX + player.size) % scene.tileSize > scene.sizeDiff;
        var rowOverlap = (player.positionY + player.size) % scene.tileSize > scene.sizeDiff;

        if (player.speedY > 0) {
            //TODO: ver solapamientos
            //if ((level[baseRow+1][baseCol] && !level[baseRow][baseCol]) || (level[baseRow+1][baseCol+1] && !level[baseRow][baseCol+1] && colOverlap && rowOverlap)) {

            //Detección de la colisión en el eje Y ascendente (dirección hacia abajo).
            //Si en el vecino hacia abajo hay un elemento distinto de cero, o sea colisionable, entonces hay colisión.
            // 0 0 0                 
            // 0 P 0   P = player    
            // 0 1 0
            if ((level[baseRow + 1][baseCol])) {
                //Resolución de la colisión
                player.restorePreviousPositionY();
                player.speedY = 0;

                //Si hay colisión hacia abajo, entonces está en el piso
                player.onTheGround = true;

                if (player.jumped) {

                    player.lastTouch = new Date().getTime();
                    player.jumped = false;
                }
            }
        }

        if (player.speedY < 0) {
            //if ((!level[baseRow + 1][baseCol] && level[baseRow][baseCol]) || (!level[baseRow + 1][baseCol + 1] && level[baseRow][baseCol + 1])) {

            //Detección de la colisión en el eje Y descendente (dirección hacia arriba)
            if (level[baseRow - 1][baseCol]) {
                //Resolución de la colisión
                player.restorePreviousPositionY();
                player.speedY = 0;
            }
        }

        if (player.speedX > 0) {
            //if ((level[baseRow][baseCol] && !level[baseRow][baseCol] && colOverlap) || (level[baseRow + 1][baseCol + 1] && !level[baseRow + 1][baseCol] && rowOverlap && colOverlap)) {

            mapElement = level[baseRow][baseCol + 1];

            //Si el jugador agarró el arma, la resolución de la colisión no es frenarlo sino transformarlo
            if (this.playerGetsWeapon(mapElement))
            {
                player.changeToKillerMode();
            } 
            else
            {
                //Detección de la colisión en el eje X ascendente (dirección hacia la derecha)
                if (mapElement) {
                    //Resolución de la colisión
                    player.restorePreviousPositionX();
                    player.speedX = 0;
                }
            }
        }

        if (player.speedX < 0) {
            
            mapElement = level[baseRow][baseCol - 1];
            
            //if ((!level[baseRow][baseCol] && level[baseRow][baseCol]) || (!level[baseRow + 1][baseCol + 1] && level[baseRow + 1][baseCol] && rowOverlap)) {

            //Si el jugador agarró el arma, la resolución de la colisión no es frenarlo sino transformarlo
            if (this.playerGetsWeapon(mapElement))
            {
                player.changeToKillerMode();
            }
            else
            {
                //Detección de la colisión en el eje X descendente (dirección hacia la izquierda)
                if (mapElement) {
                    //Resolución de la colisión
                    player.restorePreviousPositionX();
                    player.speedX = 0;
                }
            }
        }
    },

    playerGetsWeapon: function (mapElement) {

        var getsWeapon = false;

        if (mapElement == this.weaponTileNumber) {
            getsWeapon = true;
        }

        return getsWeapon;
    },

    // Actualiza el estado de todas las entidades
    updateEntities: function (player) {
        player.sprite.update(dt);

        //// TODO: Update all the bullets
        //for(var i=0; i<bullets.length; i++) {
        //    var bullet = bullets[i];

        //    switch(bullet.dir) {
        //        case 'up': bullet.position[1] -= bulletSpeed * dt; break;
        //        case 'down': bullet.position[1] += bulletSpeed * dt; break;
        //        default:
        //            bullet.position[0] += bulletSpeed * dt;
        //    }

        //    // Remove the bullet if it goes offscreen
        //    if(bullet.position[1] < 0 || bullet.position[1] > canvas.height ||
        //       bullet.position[0] > canvas.width) {
        //        bullets.splice(i, 1);
        //        i--;
        //    }
        //}

        //// TODO: Update all the enemies
        //for(var i=0; i<enemies.length; i++) {
        //    enemies[i].position[0] -= enemySpeed * dt;
        //    enemies[i].sprite.update(dt);

        //    // Remove if offscreen
        //    if(enemies[i].position[0] + enemies[i].sprite.size[0] < 0) {
        //        enemies.splice(i, 1);
        //        i--;
        //    }
        //}

        //// Update all the explosions
        //for(var i=0; i<explosions.length; i++) {
        //    explosions[i].sprite.update(dt);

        //    // Remove if animation is done
        //    if(explosions[i].sprite.done) {
        //        explosions.splice(i, 1);
        //        i--;
        //    }
        //}
    }
};
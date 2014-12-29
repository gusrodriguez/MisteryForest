var tileSize = 32;

var scene = {
    
    amountTilesHorizontal: 20, 

    amountTilesVertical: 15,

    layers: [],
    
    renderLayer: function (layer) {
        // data: [array of tiles, 1-based, position of sprite from top-left]
        // height: integer, height in number of sprites
        // name: "string", internal name of layer
        // opacity: integer
        // type: "string", layer type (tile, object)
        // visible: boolean
        // width: integer, width in number of sprites
        // x: integer, starting x position
        // y: integer, starting y position
        
        if (layer.type !== "tilelayer" || !layer.opacity) {
            return;
        }
        
        var s = canvas.cloneNode();
        
        var size = scene.data.tilewidth;

        s = s.getContext("2d");
        
        if (scene.layers.length < scene.data.layers.length) {
            
            layer.data.forEach(function (tileIndex, i) {
                
                if (!tileIndex) { return; }

                var imageX, imageY, sceneX, sceneY;
                
                var tile = scene.data.tilesets[0];
                
                tileIndex--;
                imageX = (tileIndex % (tile.imagewidth / size)) * size;
                imageY = ~~(tileIndex / (tile.imagewidth / size)) * size;
                sceneX = (i % layer.width) * size;
                sceneY = ~~(i / layer.width) * size;
                
                s.drawImage(scene.tileset, imageX, imageY, size, size,
                            sceneX, sceneY, size, size);
            });
            
            scene.layers.push(s.canvas.toDataURL());
            
            ctx.drawImage(s.canvas, 0, 0);
        }
        else {
            
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
        
        this.tileset = $("<img />", { src: json.tilesets[0].image })[0];
        
        this.tileset.onload = $.proxy(this.renderLayers, this);
    },
    load: function (name) {
        
        //Si el tileset no se cargó, lo va a buscar al servidor.
        if (scene.tilesetInfo === undefined) {
            
            return $.ajax({
                
                url: "/Api/Map",
                
                type: "POST"
                
            }).done(function (json) {
                
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

        //Preguntar si el juego no terminó antes de dibujar al jugador
        //if (!isGameOver) {
        //renderEntity(player);
        //}
    },
    
    //Chequea si en la nueva posición del personaje, hay colisión en la escena
    collided: function (player) {

        var collides = false;

        player.keepInsideCanvas();

        if (scene.tilesetInfo !== undefined) {
            var wallBlocks = scene.tilesetInfo.layers[1].data;

            for (var i = 0; i < wallBlocks.length; i++) {
                //Si hay un bloque colisionable
                if (wallBlocks[i] != 0) {

                    var blockPosition = [];
                    var blockSize = [];
                    var playerSize = [];

                    //Calcula la posicion del bloque colisionable dado el indice de la matriz del mapa.
                    blockPosition = this.calculateTilePositionByIndex(i);

                    blockSize[0] = tileSize;
                    blockSize[1] = tileSize;

                    playerSize[0] = playerSizeX;
                    playerSize[1] = playerSizeY;

                    if (this.boxCollides(blockPosition, blockSize, player.position, playerSize)) {
                        collides = true;
                    }
                }
            }
        }

        return collides;
    },
    
    boxCollides: function(pos, size, pos2, size2) {

        //if (this.isCollision(pos[0], pos[1],
        //    pos[0] + size[0], pos[1] + size[1],
        //    pos2[0], pos2[1],
        //    pos2[0] + size2[0], pos2[1] + size2[1])) {
        //    console.log("colision");
        //}

        return this.isCollision(pos[0], pos[1],
                        pos[0] + size[0], pos[1] + size[1],
                        pos2[0], pos2[1],
                        pos2[0] + size2[0], pos2[1] + size2[1]);
    },

    isCollision: function (x, y, r, b, x2, y2, r2, b2) {
        return !(r <= x2 || x > r2 ||
                 b <= y2 || y > b2);
    },
    
    //Calcula la posicion del Tile (extremo superior izquierdo) dado su índice en la matriz del mapa.
    calculateTilePositionByIndex: function(index) {

        var blockPosition = [];

        //Ubica la fila en la matriz de bloques
        var row = Math.floor(index / this.amountTilesHorizontal);
        var column = index - (2 * row * 10);

        //Toma el punto que representa la esquina superior izquierda del Tile colisionable en curso
        var posYColisionableTile = row * tileSize;
        var posXColisionableTile = column * tileSize;

        blockPosition[0] = posXColisionableTile;
        blockPosition[1] = posYColisionableTile;

        return blockPosition;
    },
    
    // Actualiza el estado de todas las entidades
    updateEntities: function(dt, player) {
    
        player.sprite.update(dt);

        //// Update all the bullets
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

        //// Update all the enemies
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
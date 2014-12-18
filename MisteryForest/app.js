var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 640;
canvas.height = 480;
document.body.appendChild(canvas);

$(function () {
    init();
});

// The main game loop
var lastTime;
function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;

    //update(dt);
    //render();

    //lastTime = now;
    //requestAnimFrame(main);
};

function init() {
    lastTime = Date.now();

    var scene = {
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
            if (layer.type !== "tilelayer" || !layer.opacity) { return; }
            var s = canvas.cloneNode(),
                size = scene.data.tilewidth;
            s = s.getContext("2d");
            if (scene.layers.length < scene.data.layers.length) {
                layer.data.forEach(function (tile_idx, i) {
                    if (!tile_idx) { return; }
                    var img_x, img_y, s_x, s_y,
                        tile = scene.data.tilesets[0];
                    tile_idx--;
                    img_x = (tile_idx % (tile.imagewidth / size)) * size;
                    img_y = ~~(tile_idx / (tile.imagewidth / size)) * size;
                    s_x = (i % layer.width) * size;
                    s_y = ~~(i / layer.width) * size;
                    s.drawImage(scene.tileset, img_x, img_y, size, size,
                                s_x, s_y, size, size);
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
            this.tileset = $("<img />", { src: json.tilesets[0].image })[0]
            this.tileset.onload = $.proxy(this.renderLayers, this);
        },
        load: function (name) {
            return $.ajax({
                url: "/Api/Map",
                type: "POST"
            }).done($.proxy(this.loadTileset, this));
        }
    };

    scene.load("map");

    main();
}
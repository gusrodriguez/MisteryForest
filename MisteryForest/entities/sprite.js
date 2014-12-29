﻿(function () {
    function Sprite(url, pos, size, speed, frames, dir, once, isMoving) {
        
        this.pos = pos;
        this.size = size;
        this.speed = typeof speed === 'number' ? speed : 0;
        this.frames = frames;
        this._index = 0;
        this.url = url;
        this.dir = dir || 'horizontal';
        this.once = once;
        this.isMoving = isMoving || false;
    };

    Sprite.prototype = {
        
        animate: function(value) {
            this.isMoving = value;
        },
        
        changeUrl: function(newUrl) {
            this.url = newUrl;
        },

        update: function (dt) {
            this._index += this.speed * dt;
        },

        render: function (ctx) {
            var frame;

            if (this.isMoving) {
                var max = this.frames.length;
                var idx = Math.floor(this._index);

                frame = this.frames[idx % max];
                
                if (this.once && idx >= max) {
                    this.done = true;
                    return;
                }
            }
            else {
                frame = 0;
            }
            
            var x = this.pos[0];
            var y = this.pos[1];

            if (this.dir == 'vertical') {
                y += frame * this.size[1];
            }
            else {
                x += frame * this.size[0];
            }

            //Dibuja el nuevo frame
            ctx.drawImage(resources.get(this.url),
                          x, y,
                          this.size[0], this.size[1],
                          0, 0,
                          this.size[0], this.size[1]);
        }
    };

    window.Sprite = Sprite;
    
})();
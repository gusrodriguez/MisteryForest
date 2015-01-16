(function () {
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
        this.linearSequence = false;
        this.counterFramesInLinearSequence = 0;
        this.framesNumberToAnimateInLinearSequence = 0;
    };

    Sprite.prototype = {

        animate: function (value) {
            this.isMoving = value;
        },

        changeUrl: function (newUrl) {
            this.url = newUrl;
        },

        update: function (dt) {
            this._index += this.speed * dt;
        },

        render: function (ctx) {

            var frame;

            if (this.isMoving)
            {
                var max = this.frames.length;
                var idx = Math.floor(this._index);
                frame = this.frames[idx % max];

                if (this.once && idx >= max)
                {

                    this.done = true;
                    return;
                }
            }
            else
            {
                frame = 0;
            }

            var x = this.pos[0];
            var y = this.pos[1];

            if (this.dir == 'vertical')
            {
                y += frame * this.size[1];
            }
            else
            {
                x += frame * this.size[0];
            }
            
            //Si la secuencia es lineal. Es decir si no es recursiva, sino que la animación llega al último elemento del sprite y se detiene.
            if (this.linearSequence) {
                
                this.counterFramesInLinearSequence++;

                if (this.counterFramesInLinearSequence < this.framesNumberToAnimateInLinearSequence) {

                    this.draw(player.size * this.counterFramesInLinearSequence, y);
                }
                else
                {
                    //Cuando llega al último frame del sprite, lo dibuja en todas las iteraciones y se vé como si quedara fijo
                    this.draw(player.size * this.framesNumberToAnimateInLinearSequence, y);
                }
            }
            else
            {
                //dibuja recursivamente
                this.draw(x, y);
            }
            
        },
        
        draw: function (x, y) {
            
            ctx.drawImage(resources.get(this.url),
                         x, y,
                         this.size[0], this.size[1],
                         0, 0,
                         this.size[0], this.size[1]);
            
        },
        
        animateLinearSequence: function (resourceUrl, framesNumberToAnimate) {

            this.counterFramesInLinearSequence = 0;

            this.changeUrl(resourceUrl);

            this.linearSequence = true;

            this.framesNumberToAnimateInLinearSequence = framesNumberToAnimate;

            this.isMoving = true;
        }
    };

    window.Sprite = Sprite;
})();
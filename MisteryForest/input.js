(function () {
    var pressedKeys = {};

    function setKey(event, status) {
        var code = event.keyCode;
        var key;

        switch (code) {
            case 32:
                key = 'SPACE'; break;
            case 37:
                key = 'LEFT'; break;
            case 38:
                key = 'UP'; break;
            case 39:
                key = 'RIGHT'; break;
            case 40:
                key = 'DOWN'; break;
            default:
                // Convierte el ASCII a letras
                key = String.fromCharCode(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function (e) {
        setKey(e, true);
        e.preventDefault();
    });

    document.addEventListener('keyup', function (e) {
        setKey(e, false);
        e.preventDefault();
    });

    window.addEventListener('blur', function () {
        pressedKeys = {};
    });

    window.input = {
        isDown: function(key) {
            return pressedKeys[key.toUpperCase()];
        },
        anyKeyPressed: function () {
            
            var any = false;

            var pressed = $.grep(pressedKeys, function (n, i) {
                return n == true;
            });

            if (pressed.length > 0) {
                any = true;
                console.log("oo");
            }

            console.log("uu");

            return any;
        }
};
})();
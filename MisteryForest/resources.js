(function () {

    var resourceCache = {};

    var loading = [];

    var readyCallbacks = [];

    // Lee una imagen desde una url
    function load(urlOrArr) {

        if (urlOrArr instanceof Array) {
            urlOrArr.forEach(function (url) {
                loadFromUrlOrCache(url);
            });
        }
        else {
            loadFromUrlOrCache(urlOrArr);
        }
    }

    function loadFromUrlOrCache(url) {

        if (resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            var img = new Image();

            img.onload = function () {

                resourceCache[url] = img;

                if (isReady()) {
                    readyCallbacks.forEach(function (func) { func(); });
                }
            };

            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {

        var ready = true;

        for (var k in resourceCache) {

            if (resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
                ready = false;
            }
        }

        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    window.resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
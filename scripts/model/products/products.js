define(['utility/map'], function (map) {
        var model = function () {
            this.products = [];
            map.apply(this, arguments);
        };
        return model;
    });
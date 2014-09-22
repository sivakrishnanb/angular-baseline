define(['utility/map'], function (map) {
        var model = function () {
            this.orders = [];
            map.apply(this, arguments);
        };
        return model;
    });
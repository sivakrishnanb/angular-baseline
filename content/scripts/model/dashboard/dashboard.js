define(['utility/map'], function (map) {
        var model = function () {
            this.message = 'Hello';
            this.name = '';
            this.age = 0;
            this.dob = new Date();
            this.designation = '';
            map.apply(this, arguments);
        };
        return model;
    });
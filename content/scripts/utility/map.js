define([], function () {

    var model = function (options) {
        var options = options || {};

        for (prop in this) {
            if (this.hasOwnProperty(prop) && typeof(this[prop]) !== 'function') {
                if (options[prop]) {
                    this[prop] = options[prop];
                } else {
                    this[prop] = this[prop];
                }
            }
        }
    }

    return model;
})

var Di = function(rootPath) {

    this._rootPath = rootPath;
    this._cache = {};
    this.require = require;


};

Di.prototype.get = function *(what, options) {

    var cachedService = this.getInCache(what);
    if(cachedService) {
        return cachedService;
    }

    var service = this.require(this._rootPath + '/' + what);

    if(typeof service.options !== 'object') {
        service.options = {
            cache: false,
            dependencies: {}
        };
    }

    var dependencies = {};
    for(var i in service.options.dependencies) {
        dependencies[i] = yield this.get(service.options.dependencies[i]);
    }

    var ctx = {
        di: this,
        dependencies: dependencies
    };

    var result = yield service.call(ctx, options);

    if(service.options.cache) {
        this._cache[what] = result;
    }

    return result;
};

Di.prototype.getInCache = function(what) {
    if(typeof this._cache[what] !== 'undefined') {
        return this._cache[what];
    }
    return false;
};

Di.prototype.set = function(serviceName, serviceInstance) {
    if(typeof this._cache[serviceName] === 'undefined') {
        this._cache[serviceName] = serviceInstance;
    }
};

Di.prototype.getNames = function() {
    var names = [];
    for(var i in this._cache) {
        names.push(i);
    }
    return names;
};


module.exports = Di;
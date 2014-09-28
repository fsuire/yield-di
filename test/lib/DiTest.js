var _path = (process.env.COVER)? '../../lib-cov' : '../../lib';

var Di = require(_path + '/Di'),
    co = require('co'),
    assert = require('assert'),
    sinon = require('sinon');

describe('li/Di', function() {

    var di;

    beforeEach(function() {
        di = new Di('/path/to/service');
        di.require = function(what) {};
    });

    afterEach(function() {
        di = null;
    });

    // -----------------------------------------------------------------------------------------------------------------
    // -----------------------------------------------------------------------------------------------------------------

    it('should throw an exception if the service file is not found', function(done) {

        sinon.stub(di, 'require')
            .withArgs('/path/to/service/does/not/exist')
            .throws(new Error('Cannot find module \'/path/to/service/does/not/exist\''));

        co(function *() {

            try {
                yield di.get('does/not/exist');
                assert.fail('An exception should have been sent');
            } catch(error) {
                assert.equal(error.message, 'Cannot find module \'/path/to/service/does/not/exist\'');
            }

            di.require.restore();

        })(done);
    });

    // -----------------------------------------------------------------------------------------------------------------


    it('should return a service', function(done) {

        sinon.stub(di, 'require')
            .withArgs('/path/to/service/exists')
            .returns(function *(){
                return 'i am the service';
            });

        co(function *() {

            var service = yield di.get('exists');

            assert.equal(service, 'i am the service');

            di.require.restore();


        })(done);
    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should cache a service', function(done) {

        var service = function *(){
            return Math.random();
        };

        service.options = {
            cache: true
        };

        sinon.stub(di, 'require')
            .withArgs('/path/to/service/cache')
            .returns(service);

        co(function *() {
            var cachedService1 = yield di.get('cache');
            var cachedService2 = yield di.get('cache');

            assert.equal(cachedService1, cachedService2);

            di.require.restore();
        })(done);
    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should get a service that use dependencies', function(done) {

        var service = function *() {
            return 'i use a ' + this.dependencies.dep;
        };

        service.options = {
            cache: true,
            dependencies: {
                dep: 'depService'
            }
        };

        var depService = function *() {
            return 'dependency';
        };

        sinon.stub(di, 'require')
            .withArgs('/path/to/service/service')
            .returns(service)
            .withArgs('/path/to/service/depService')
            .returns(depService);

        co(function *() {

            var instance = yield di.get('service');

            assert.equal(instance, 'i use a dependency');

            di.require.restore();

        })(done);

    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should set a service, but cannot change an already set service', function(done) {

        co(function *() {

            di.set('testService', 'test service !!');
            var setService = yield di.get('testService');
            assert.equal(setService, 'test service !!');

            di.set('testService', 'cannot be set');
            setService = yield di.get('testService');
            assert.equal(setService, 'test service !!');

        })(done);

    });

    // -----------------------------------------------------------------------------------------------------------------

    it('should return the names of all services in cache', function(done) {

        co(function *() {

            var names = di.getNames();
            assert.equal(0, names.length);

            di.set('testService', 'test service !!');
            names = di.getNames();
            assert.equal(1, names.length);
            assert.equal('testService', names[0]);

        })(done);

    });

});
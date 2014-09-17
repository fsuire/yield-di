## yield-di

a simple node.js DI that uses generators

## Exemple

```js
var Di = require('yield-di');

/////////////////////
// create a new di //
/////////////////////

// the argument used for construction points to your service directory
var myServiceDirectory = __dirname + '/services';
var di = new Di(myServiceDirectory);

///////////////////////////////
// get a service from a file //
///////////////////////////////

// will use the service file {your service directory}/bar.js
var bar = yield di.get('bar');

// will use the service file {your service directory}/foo/bar.js
var fooBar = yield di.get('foo/bar');

```

The services are node.js modules that simply returns a generator function :

```js
// {your service directory}/foo.js

// your service function
var foo = function *() {
  return 'whatever you want';
};

module.exports = foo;
```
```js
// {your service directory}/foo/bar.js

// your service function
var fooBar = function *() {

  var foo = this.dependencies.foo;
  // foo is our service foo.js
  // foo === 'whatever you want'
  
  var baz = this.dependencies.baz;
  // baz is another service, located in {your service directory}/foo/bar/baz.js
  
  return 'whatever you want';
};

// you can eventually add options to your service
fooBar.options = {
  // cache: defaults to false. If true, the service function will be executed once. All other call will return the result of the first execution
  cache: true, 
  // dependencies: default to {}. Each service declared there will be accessible in the service function within this.dependencies
  dependencies: {
    foo: 'foo',
    baz: 'foo/bar/baz'
  }
};

module.exports = fooBar;
```
You also can register a service instance at run time
```js
var something = 'something';
di.set('something', something);
var srv = yield di.get('something');
// srv === 'something'
```

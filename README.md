## yield-di
========

a simple node.js di, using generators

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


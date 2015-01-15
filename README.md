Modules Bundles
===============

This package provides a javascript implementation to analyze a module topology (modules and their dependencies) in any form, analyze them and provides a way to fold, group or organize those modules in an optimal way.

This is suppose to provide a building block for others tools like `browserify`, `es6-module-transpiler`, etc., in order to analyze javascript modules, and their dependencies to provide a way to bundle them into less number of files for performance reasons.

## Installation

Install using npm:

```shell
$ npm install modules-bundles
```

## Usage

This NPM `modules-bundles` provides a class that can be used to analyze a module topology and group modules in bundles in an optimal way.

### Basic Usage

The default configuration will try to generate bundles and compute a common (shared)
bundle, e.g.:

```javascript
var ModulesBundles = require('./');
var mb = new ModulesBundles();
mb.addNode('module-a', ['module-x', 'module-y']);
mb.addNode('module-b', ['module-y']);
mb.addNode('module-x', ['module-z']);
mb.addNode('module-y', []);
mb.addNode('module-z');
console.log(mb.bundles);
```

The output is:

```json
{
  "module-a": [ "module-z", "module-x", "module-a" ],
  "module-b": [ "module-b" ],
  "*": [ "module-y" ]
}
```

Which means all those 5 modules can be bundled up into 3 bundles, one of them is an special bundle called `*`, which is composed of a group of shared modules
that are used by the other two.

### Advanced Usage

The default configuration will try to generate bundles and compute a common (shared)
bundle, e.g.:

```javascript
var ModulesBundles = require('./');
var mb = new ModulesBundles({ optimize: false });
mb.addNode('module-a', ['module-x', 'module-y']);
mb.addNode('module-b', ['module-y']);
mb.addNode('module-x', ['module-z']);
mb.addNode('module-y', []);
mb.addNode('module-z');
console.log(mb.bundles);
```

The output is:

```json
{
  "module-a": [ "module-y", "module-z", "module-x", "module-a" ],
  "module-b": [ "module-y", "module-b" ]
}
```

Which means all those 5 modules can be bundled up into 2 bundles, even thought some modules will be part of both bundles, like `module-y` in this case.

License
-------

This software is free to use under the Yahoo! Inc. BSD license.
See the [LICENSE file][] for license text and copyright information.

[LICENSE file]: https://github.com/caridy/modules-bundles/blob/master/LICENSE

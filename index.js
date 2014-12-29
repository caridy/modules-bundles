/* jshint node:true, undef:true, unused:true */

function Graph(options) {
    options = options || {};
    this._vortex = null;
    this._core = null;
    this._bundles = null;
    this._nodes = Object.create(null);

    Object.defineProperties(this, {
        bundles: {
            get: function () {
                return this._bundles ? this._bundles : this.reduce();
            }
        },
        optimize: {
            get: function () {
                return typeof options.optimize === 'boolean' ? options.optimize : true;
            }
        }
    });
}

Graph.prototype = {

    addNode: function (name, deps) {
        var nodes = this._nodes;
        var n = Object.create(null);
        (deps || []).forEach(function (dep) {
            n[dep] = true;
        });
        nodes[name] = n;
    },

    reduce: function () {
        var nodes = this._nodes;
        var vortex = this._vortex = [];
        var core = this._core = [];
        var bundles = this._bundles = Object.create(null);
        var dependants = Object.create(null);
        var visits = Object.create(null);

        // count the number of dependants
        Object.keys(nodes).forEach(function (name) {
            Object.getOwnPropertyNames(nodes[name]).forEach(function (i) {
                dependants[i] = (dependants[i] || 0) + 1;
            });
        });

        // identify vortex modules
        Object.keys(nodes).forEach(function (name) {
            if (!dependants[name]) {
                vortex.push(name);
            }
        });

        function walk(name, visited) {
            var deps = [];
            if (typeof visited[name] === 'undefined') {
                visited[name] = true;
                visits[name] = (visits[name] || 0) + 1;
                // identify core modules
                if (visits[name] === 2) {
                    core.push(name);
                }
                deps.push(name);
                if (nodes[name]) { // ignoring external deps
                    Object.getOwnPropertyNames(nodes[name]).forEach(function (i) {
                        deps.unshift.apply(deps, walk(i, visited));
                    });
                }
            }
            return deps;
        }

        // walk the dep tree to find shared modules
        vortex.forEach(function (name) {
            bundles[name] = walk(name, Object.create(null));
        });

        if (this.optimize) {
            // reduce bundles by removing core modules from each bundle
            Object.keys(bundles).forEach(function (name) {
                bundles[name] = bundles[name].filter(function (dep) {
                    return !~core.indexOf(dep);
                });
            });

            // if not vortex, all modules are part of core
            core = vortex.length ? core : Object.keys(nodes);

            if (core.length) {
                bundles['*'] = core;
            }
        }

        // console.log('vortex : ', vortex);
        // console.log('core   : ', core);
        // console.log('bundles: ', bundles);
        // console.log('depdts : ', dependants);
        // console.log('visits : ', visits);
        return bundles;
    }
};

module.exports = Graph;

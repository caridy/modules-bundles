/*jshint node:true */
/*global describe, it */

'use strict';

var chai = require('chai'),
    expect = chai.expect,
    Graph = require('../');

describe('graph', function () {

    describe('single node', function () {

        var g = new Graph();
        g.addNode('foo', []);

        it('has node', function () {
            expect(Object.keys(g._nodes).length).to.equal(1);
        });

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(1);
        });

        it('produces no core', function () {
            expect(g.bundles['*']).to.equal(undefined);
        });
    });

    describe('basic', function () {

        var g = new Graph();
        g.addNode('foo', []);
        g.addNode('bar', ['foo']);

        it('has nodes', function () {
            expect(Object.keys(g._nodes).length).to.equal(2);
        });

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(1);
        });

        it('produces no core', function () {
            expect(g.bundles['*']).to.equal(undefined);
        });
    });

    describe('circular', function () {

        var g = new Graph();
        g.addNode('foo', ['baz']);
        g.addNode('baz', ['foo']);

        it('has nodes', function () {
            expect(Object.keys(g._nodes).length).to.equal(2);
        });

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(1);
        });

        it('produces core', function () {
            expect(g.bundles['*'].length).to.equal(2);
        });
    });

    describe('complex', function () {

        var g = new Graph();
        g.addNode('a', ['x', 'y']);
        g.addNode('b', ['x', 'y']);
        g.addNode('x', ['y']);
        g.addNode('y', ['x']);

        it('has nodes', function () {
            expect(Object.keys(g._nodes).length).to.equal(4);
        });

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(3);
        });

        it('produces core', function () {
            expect(g.bundles['*'].length).to.equal(2);
        });
    });

    describe('complex without optimization', function () {

        var g = new Graph({
            optimize: false
        });
        g.addNode('a', ['x', 'y']);
        g.addNode('b', ['x', 'y']);
        g.addNode('x', ['y']);
        g.addNode('y', ['x']);

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(2);
            expect(g.bundles.a.length).to.equal(3);
            expect(g.bundles.b.length).to.equal(3);
        });
    });

    describe('complex', function () {

        var g = new Graph();
        g.addNode('a', ['x', 'w']);
        g.addNode('b', ['w', 'v']);
        g.addNode('c', ['v', 'z']);
        g.addNode('d', ['z', 'y']);
        g.addNode('e', ['y', 'x']);
        g.addNode('x', ['w', 'y', 'base']);
        g.addNode('y', ['x', 'z', 'base']);
        g.addNode('z', ['y', 'v', 'base']);
        g.addNode('v', ['z', 'w', 'base']);
        g.addNode('w', ['x', 'v', 'base']);
        g.addNode('base', []);

        it('has nodes', function () {
            expect(Object.keys(g._nodes).length).to.equal(11);
        });

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(6);
        });

        it('produces core', function () {
            expect(g.bundles['*'].length).to.equal(6);
        });
    });

    describe('external', function () {

        var g = new Graph();
        g.addNode('bar', ['external']);

        it('has node', function () {
            expect(Object.keys(g._nodes).length).to.equal(1);
        });

        it('produces bundles', function () {
            expect(Object.keys(g.bundles).length).to.equal(1);
        });

        it('produces no core', function () {
            expect(g.bundles['*']).to.equal(undefined);
        });
    });

});

var test = require('node:test');
var assert = require('node:assert/strict');
var geo = require('../assets/trail-geometry.js');

var RANKS = [
  { id: 0, state: 'done' },
  { id: 1, state: 'done' },
  { id: 2, state: 'current' },
  { id: 3, state: 'locked' },
  { id: 4, state: 'locked' }
];

test('progressIndex is the current rank id', function () {
  assert.equal(geo.progressIndex(RANKS), 2);
});

test('lineFromCenters spans first seal to current seal', function () {
  var line = geo.lineFromCenters([20, 60, 100, 140, 180], 2);
  assert.equal(line.left, 20);
  assert.equal(line.width, 80);
});

test('beadOpacity is 0.7 only when scouting a locked rank', function () {
  assert.equal(geo.beadOpacity('locked'), 0.7);
  assert.equal(geo.beadOpacity('done'), 1);
  assert.equal(geo.beadOpacity('current'), 1);
});

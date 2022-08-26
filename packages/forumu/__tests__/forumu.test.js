'use strict';

const forumu = require('..');
const assert = require('assert').strict;

assert.strictEqual(forumu(), 'Hello from forumu');
console.info("forumu tests passed");

(function(undefined) {
var rebuild=function(mkc_masterSeedPhrase) {

mkc_masterSeedPhrase=mkc_masterSeedPhrase||'Bitcoin seed';

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.bitcoinjs = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

// compare and isBuffer taken from https://github.com/feross/buffer/blob/680e9e5e488f22aac27599a57dc844a6315928dd/index.js
// original notice:

/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
function compare(a, b) {
  if (a === b) {
    return 0;
  }

  var x = a.length;
  var y = b.length;

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i];
      y = b[i];
      break;
    }
  }

  if (x < y) {
    return -1;
  }
  if (y < x) {
    return 1;
  }
  return 0;
}
function isBuffer(b) {
  if (global.Buffer && typeof global.Buffer.isBuffer === 'function') {
    return global.Buffer.isBuffer(b);
  }
  return !!(b != null && b._isBuffer);
}

// based on node assert, original notice:

// http://wiki.commonjs.org/wiki/Unit_Testing/1.0
//
// THIS IS NOT TESTED NOR LIKELY TO WORK OUTSIDE V8!
//
// Originally from narwhal.js (http://narwhaljs.org)
// Copyright (c) 2009 Thomas Robinson <280north.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

var util = require('util/');
var hasOwn = Object.prototype.hasOwnProperty;
var pSlice = Array.prototype.slice;
var functionsHaveNames = (function () {
  return function foo() {}.name === 'foo';
}());
function pToString (obj) {
  return Object.prototype.toString.call(obj);
}
function isView(arrbuf) {
  if (isBuffer(arrbuf)) {
    return false;
  }
  if (typeof global.ArrayBuffer !== 'function') {
    return false;
  }
  if (typeof ArrayBuffer.isView === 'function') {
    return ArrayBuffer.isView(arrbuf);
  }
  if (!arrbuf) {
    return false;
  }
  if (arrbuf instanceof DataView) {
    return true;
  }
  if (arrbuf.buffer && arrbuf.buffer instanceof ArrayBuffer) {
    return true;
  }
  return false;
}
// 1. The assert module provides functions that throw
// AssertionError's when particular conditions are not met. The
// assert module must conform to the following interface.

var assert = module.exports = ok;

// 2. The AssertionError is defined in assert.
// new assert.AssertionError({ message: message,
//                             actual: actual,
//                             expected: expected })

var regex = /\s*function\s+([^\(\s]*)\s*/;
// based on https://github.com/ljharb/function.prototype.name/blob/adeeeec8bfcc6068b187d7d9fb3d5bb1d3a30899/implementation.js
function getName(func) {
  if (!util.isFunction(func)) {
    return;
  }
  if (functionsHaveNames) {
    return func.name;
  }
  var str = func.toString();
  var match = str.match(regex);
  return match && match[1];
}
assert.AssertionError = function AssertionError(options) {
  this.name = 'AssertionError';
  this.actual = options.actual;
  this.expected = options.expected;
  this.operator = options.operator;
  if (options.message) {
    this.message = options.message;
    this.generatedMessage = false;
  } else {
    this.message = getMessage(this);
    this.generatedMessage = true;
  }
  var stackStartFunction = options.stackStartFunction || fail;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, stackStartFunction);
  } else {
    // non v8 browsers so we can have a stacktrace
    var err = new Error();
    if (err.stack) {
      var out = err.stack;

      // try to strip useless frames
      var fn_name = getName(stackStartFunction);
      var idx = out.indexOf('\n' + fn_name);
      if (idx >= 0) {
        // once we have located the function frame
        // we need to strip out everything before it (and its line)
        var next_line = out.indexOf('\n', idx + 1);
        out = out.substring(next_line + 1);
      }

      this.stack = out;
    }
  }
};

// assert.AssertionError instanceof Error
util.inherits(assert.AssertionError, Error);

function truncate(s, n) {
  if (typeof s === 'string') {
    return s.length < n ? s : s.slice(0, n);
  } else {
    return s;
  }
}
function inspect(something) {
  if (functionsHaveNames || !util.isFunction(something)) {
    return util.inspect(something);
  }
  var rawname = getName(something);
  var name = rawname ? ': ' + rawname : '';
  return '[Function' +  name + ']';
}
function getMessage(self) {
  return truncate(inspect(self.actual), 128) + ' ' +
         self.operator + ' ' +
         truncate(inspect(self.expected), 128);
}

// At present only the three keys mentioned above are used and
// understood by the spec. Implementations or sub modules can pass
// other keys to the AssertionError's constructor - they will be
// ignored.

// 3. All of the following functions must throw an AssertionError
// when a corresponding condition is not met, with a message that
// may be undefined if not provided.  All assertion methods provide
// both the actual and expected values to the assertion error for
// display purposes.

function fail(actual, expected, message, operator, stackStartFunction) {
  throw new assert.AssertionError({
    message: message,
    actual: actual,
    expected: expected,
    operator: operator,
    stackStartFunction: stackStartFunction
  });
}

// EXTENSION! allows for well behaved errors defined elsewhere.
assert.fail = fail;

// 4. Pure assertion tests whether a value is truthy, as determined
// by !!guard.
// assert.ok(guard, message_opt);
// This statement is equivalent to assert.equal(true, !!guard,
// message_opt);. To test strictly for the value true, use
// assert.strictEqual(true, guard, message_opt);.

function ok(value, message) {
  if (!value) fail(value, true, message, '==', assert.ok);
}
assert.ok = ok;

// 5. The equality assertion tests shallow, coercive equality with
// ==.
// assert.equal(actual, expected, message_opt);

assert.equal = function equal(actual, expected, message) {
  if (actual != expected) fail(actual, expected, message, '==', assert.equal);
};

// 6. The non-equality assertion tests for whether two objects are not equal
// with != assert.notEqual(actual, expected, message_opt);

assert.notEqual = function notEqual(actual, expected, message) {
  if (actual == expected) {
    fail(actual, expected, message, '!=', assert.notEqual);
  }
};

// 7. The equivalence assertion tests a deep equality relation.
// assert.deepEqual(actual, expected, message_opt);

assert.deepEqual = function deepEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'deepEqual', assert.deepEqual);
  }
};

assert.deepStrictEqual = function deepStrictEqual(actual, expected, message) {
  if (!_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'deepStrictEqual', assert.deepStrictEqual);
  }
};

function _deepEqual(actual, expected, strict, memos) {
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (isBuffer(actual) && isBuffer(expected)) {
    return compare(actual, expected) === 0;

  // 7.2. If the expected value is a Date object, the actual value is
  // equivalent if it is also a Date object that refers to the same time.
  } else if (util.isDate(actual) && util.isDate(expected)) {
    return actual.getTime() === expected.getTime();

  // 7.3 If the expected value is a RegExp object, the actual value is
  // equivalent if it is also a RegExp object with the same source and
  // properties (`global`, `multiline`, `lastIndex`, `ignoreCase`).
  } else if (util.isRegExp(actual) && util.isRegExp(expected)) {
    return actual.source === expected.source &&
           actual.global === expected.global &&
           actual.multiline === expected.multiline &&
           actual.lastIndex === expected.lastIndex &&
           actual.ignoreCase === expected.ignoreCase;

  // 7.4. Other pairs that do not both pass typeof value == 'object',
  // equivalence is determined by ==.
  } else if ((actual === null || typeof actual !== 'object') &&
             (expected === null || typeof expected !== 'object')) {
    return strict ? actual === expected : actual == expected;

  // If both values are instances of typed arrays, wrap their underlying
  // ArrayBuffers in a Buffer each to increase performance
  // This optimization requires the arrays to have the same type as checked by
  // Object.prototype.toString (aka pToString). Never perform binary
  // comparisons for Float*Arrays, though, since e.g. +0 === -0 but their
  // bit patterns are not identical.
  } else if (isView(actual) && isView(expected) &&
             pToString(actual) === pToString(expected) &&
             !(actual instanceof Float32Array ||
               actual instanceof Float64Array)) {
    return compare(new Uint8Array(actual.buffer),
                   new Uint8Array(expected.buffer)) === 0;

  // 7.5 For all other Object pairs, including Array objects, equivalence is
  // determined by having the same number of owned properties (as verified
  // with Object.prototype.hasOwnProperty.call), the same set of keys
  // (although not necessarily the same order), equivalent values for every
  // corresponding key, and an identical 'prototype' property. Note: this
  // accounts for both named and indexed properties on Arrays.
  } else if (isBuffer(actual) !== isBuffer(expected)) {
    return false;
  } else {
    memos = memos || {actual: [], expected: []};

    var actualIndex = memos.actual.indexOf(actual);
    if (actualIndex !== -1) {
      if (actualIndex === memos.expected.indexOf(expected)) {
        return true;
      }
    }

    memos.actual.push(actual);
    memos.expected.push(expected);

    return objEquiv(actual, expected, strict, memos);
  }
}

function isArguments(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
}

function objEquiv(a, b, strict, actualVisitedObjects) {
  if (a === null || a === undefined || b === null || b === undefined)
    return false;
  // if one is a primitive, the other must be same
  if (util.isPrimitive(a) || util.isPrimitive(b))
    return a === b;
  if (strict && Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
    return false;
  var aIsArgs = isArguments(a);
  var bIsArgs = isArguments(b);
  if ((aIsArgs && !bIsArgs) || (!aIsArgs && bIsArgs))
    return false;
  if (aIsArgs) {
    a = pSlice.call(a);
    b = pSlice.call(b);
    return _deepEqual(a, b, strict);
  }
  var ka = objectKeys(a);
  var kb = objectKeys(b);
  var key, i;
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length !== kb.length)
    return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] !== kb[i])
      return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!_deepEqual(a[key], b[key], strict, actualVisitedObjects))
      return false;
  }
  return true;
}

// 8. The non-equivalence assertion tests for any deep inequality.
// assert.notDeepEqual(actual, expected, message_opt);

assert.notDeepEqual = function notDeepEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, false)) {
    fail(actual, expected, message, 'notDeepEqual', assert.notDeepEqual);
  }
};

assert.notDeepStrictEqual = notDeepStrictEqual;
function notDeepStrictEqual(actual, expected, message) {
  if (_deepEqual(actual, expected, true)) {
    fail(actual, expected, message, 'notDeepStrictEqual', notDeepStrictEqual);
  }
}


// 9. The strict equality assertion tests strict equality, as determined by ===.
// assert.strictEqual(actual, expected, message_opt);

assert.strictEqual = function strictEqual(actual, expected, message) {
  if (actual !== expected) {
    fail(actual, expected, message, '===', assert.strictEqual);
  }
};

// 10. The strict non-equality assertion tests for strict inequality, as
// determined by !==.  assert.notStrictEqual(actual, expected, message_opt);

assert.notStrictEqual = function notStrictEqual(actual, expected, message) {
  if (actual === expected) {
    fail(actual, expected, message, '!==', assert.notStrictEqual);
  }
};

function expectedException(actual, expected) {
  if (!actual || !expected) {
    return false;
  }

  if (Object.prototype.toString.call(expected) == '[object RegExp]') {
    return expected.test(actual);
  }

  try {
    if (actual instanceof expected) {
      return true;
    }
  } catch (e) {
    // Ignore.  The instanceof check doesn't work for arrow functions.
  }

  if (Error.isPrototypeOf(expected)) {
    return false;
  }

  return expected.call({}, actual) === true;
}

function _tryBlock(block) {
  var error;
  try {
    block();
  } catch (e) {
    error = e;
  }
  return error;
}

function _throws(shouldThrow, block, expected, message) {
  var actual;

  if (typeof block !== 'function') {
    throw new TypeError('"block" argument must be a function');
  }

  if (typeof expected === 'string') {
    message = expected;
    expected = null;
  }

  actual = _tryBlock(block);

  message = (expected && expected.name ? ' (' + expected.name + ').' : '.') +
            (message ? ' ' + message : '.');

  if (shouldThrow && !actual) {
    fail(actual, expected, 'Missing expected exception' + message);
  }

  var userProvidedMessage = typeof message === 'string';
  var isUnwantedException = !shouldThrow && util.isError(actual);
  var isUnexpectedException = !shouldThrow && actual && !expected;

  if ((isUnwantedException &&
      userProvidedMessage &&
      expectedException(actual, expected)) ||
      isUnexpectedException) {
    fail(actual, expected, 'Got unwanted exception' + message);
  }

  if ((shouldThrow && actual && expected &&
      !expectedException(actual, expected)) || (!shouldThrow && actual)) {
    throw actual;
  }
}

// 11. Expected to throw an error:
// assert.throws(block, Error_opt, message_opt);

assert.throws = function(block, /*optional*/error, /*optional*/message) {
  _throws(true, block, error, message);
};

// EXTENSION! This is annoying to write outside this module.
assert.doesNotThrow = function(block, /*optional*/error, /*optional*/message) {
  _throws(false, block, error, message);
};

assert.ifError = function(err) { if (err) throw err; };

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    if (hasOwn.call(obj, key)) keys.push(key);
  }
  return keys;
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"util/":33}],2:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],3:[function(require,module,exports){

},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var buffer = require('buffer');
var Buffer = buffer.Buffer;
var SlowBuffer = buffer.SlowBuffer;
var MAX_LEN = buffer.kMaxLength || 2147483647;
exports.alloc = function alloc(size, fill, encoding) {
  if (typeof Buffer.alloc === 'function') {
    return Buffer.alloc(size, fill, encoding);
  }
  if (typeof encoding === 'number') {
    throw new TypeError('encoding must not be number');
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  var enc = encoding;
  var _fill = fill;
  if (_fill === undefined) {
    enc = undefined;
    _fill = 0;
  }
  var buf = new Buffer(size);
  if (typeof _fill === 'string') {
    var fillBuf = new Buffer(_fill, enc);
    var flen = fillBuf.length;
    var i = -1;
    while (++i < size) {
      buf[i] = fillBuf[i % flen];
    }
  } else {
    buf.fill(_fill);
  }
  return buf;
}
exports.allocUnsafe = function allocUnsafe(size) {
  if (typeof Buffer.allocUnsafe === 'function') {
    return Buffer.allocUnsafe(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size > MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new Buffer(size);
}
exports.from = function from(value, encodingOrOffset, length) {
  if (typeof Buffer.from === 'function' && (!global.Uint8Array || Uint8Array.from !== Buffer.from)) {
    return Buffer.from(value, encodingOrOffset, length);
  }
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof value === 'string') {
    return new Buffer(value, encodingOrOffset);
  }
  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    var offset = encodingOrOffset;
    if (arguments.length === 1) {
      return new Buffer(value);
    }
    if (typeof offset === 'undefined') {
      offset = 0;
    }
    var len = length;
    if (typeof len === 'undefined') {
      len = value.byteLength - offset;
    }
    if (offset >= value.byteLength) {
      throw new RangeError('\'offset\' is out of bounds');
    }
    if (len > value.byteLength - offset) {
      throw new RangeError('\'length\' is out of bounds');
    }
    return new Buffer(value.slice(offset, offset + len));
  }
  if (Buffer.isBuffer(value)) {
    var out = new Buffer(value.length);
    value.copy(out, 0, 0, value.length);
    return out;
  }
  if (value) {
    if (Array.isArray(value) || (typeof ArrayBuffer !== 'undefined' && value.buffer instanceof ArrayBuffer) || 'length' in value) {
      return new Buffer(value);
    }
    if (value.type === 'Buffer' && Array.isArray(value.data)) {
      return new Buffer(value.data);
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ' + 'ArrayBuffer, Array, or array-like object.');
}
exports.allocUnsafeSlow = function allocUnsafeSlow(size) {
  if (typeof Buffer.allocUnsafeSlow === 'function') {
    return Buffer.allocUnsafeSlow(size);
  }
  if (typeof size !== 'number') {
    throw new TypeError('size must be a number');
  }
  if (size >= MAX_LEN) {
    throw new RangeError('size is too large');
  }
  return new SlowBuffer(size);
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"buffer":5}],5:[function(require,module,exports){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

var K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('Invalid typed array length')
  }
  // Return an augmented `Uint8Array` instance
  var buf = new Uint8Array(length)
  buf.__proto__ = Buffer.prototype
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

// Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
if (typeof Symbol !== 'undefined' && Symbol.species &&
    Buffer[Symbol.species] === Buffer) {
  Object.defineProperty(Buffer, Symbol.species, {
    value: null,
    configurable: true,
    enumerable: false,
    writable: false
  })
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (value instanceof ArrayBuffer) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  return fromObject(value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Buffer.prototype.__proto__ = Uint8Array.prototype
Buffer.__proto__ = Uint8Array

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  var buf = createBuffer(length)

  var actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  var buf = createBuffer(length)
  for (var i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  var buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  buf.__proto__ = Buffer.prototype
  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    var buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj) {
    if (isArrayBufferView(obj) || 'length' in obj) {
      if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
        return createBuffer(0)
      }
      return fromArrayLike(obj)
    }

    if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
      return fromArrayLike(obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (isArrayBufferView(string) || string instanceof ArrayBuffer) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  newBuf.__proto__ = Buffer.prototype
  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    var limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : new Buffer(val, encoding)
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// Node 0.10 supports `ArrayBuffer` but lacks `ArrayBuffer.isView`
function isArrayBufferView (obj) {
  return (typeof ArrayBuffer.isView === 'function') && ArrayBuffer.isView(obj)
}

function numberIsNaN (obj) {
  return obj !== obj // eslint-disable-line no-self-compare
}

},{"base64-js":2,"ieee754":8}],6:[function(require,module,exports){
(function (Buffer){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.

function isArray(arg) {
  if (Array.isArray) {
    return Array.isArray(arg);
  }
  return objectToString(arg) === '[object Array]';
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = Buffer.isBuffer;

function objectToString(o) {
  return Object.prototype.toString.call(o);
}

}).call(this,{"isBuffer":require("../../is-buffer/index.js")})
},{"../../is-buffer/index.js":10}],7:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],8:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],9:[function(require,module,exports){
if (typeof Object.create === 'function') {
  // implementation from standard node.js 'util' module
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    ctor.prototype = Object.create(superCtor.prototype, {
      constructor: {
        value: ctor,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
  };
} else {
  // old school shim for old browsers
  module.exports = function inherits(ctor, superCtor) {
    ctor.super_ = superCtor
    var TempCtor = function () {}
    TempCtor.prototype = superCtor.prototype
    ctor.prototype = new TempCtor()
    ctor.prototype.constructor = ctor
  }
}

},{}],10:[function(require,module,exports){
/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}

},{}],11:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],12:[function(require,module,exports){
(function (process){
'use strict';

if (!process.version ||
    process.version.indexOf('v0.') === 0 ||
    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
  module.exports = nextTick;
} else {
  module.exports = process.nextTick;
}

function nextTick(fn, arg1, arg2, arg3) {
  if (typeof fn !== 'function') {
    throw new TypeError('"callback" argument must be a function');
  }
  var len = arguments.length;
  var args, i;
  switch (len) {
  case 0:
  case 1:
    return process.nextTick(fn);
  case 2:
    return process.nextTick(function afterTickOne() {
      fn.call(null, arg1);
    });
  case 3:
    return process.nextTick(function afterTickTwo() {
      fn.call(null, arg1, arg2);
    });
  case 4:
    return process.nextTick(function afterTickThree() {
      fn.call(null, arg1, arg2, arg3);
    });
  default:
    args = new Array(len - 1);
    i = 0;
    while (i < args.length) {
      args[i++] = arguments[i];
    }
    return process.nextTick(function afterTick() {
      fn.apply(null, args);
    });
  }
}

}).call(this,require('_process'))
},{"_process":13}],13:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],14:[function(require,module,exports){
module.exports = require('./lib/_stream_duplex.js');

},{"./lib/_stream_duplex.js":15}],15:[function(require,module,exports){
// a duplex stream is just a stream that is both readable and writable.
// Since JS doesn't have multiple prototypal inheritance, this class
// prototypally inherits from Readable, and then parasitically from
// Writable.

'use strict';

/*<replacement>*/

var objectKeys = Object.keys || function (obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
};
/*</replacement>*/

module.exports = Duplex;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

var Readable = require('./_stream_readable');
var Writable = require('./_stream_writable');

util.inherits(Duplex, Readable);

var keys = objectKeys(Writable.prototype);
for (var v = 0; v < keys.length; v++) {
  var method = keys[v];
  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
}

function Duplex(options) {
  if (!(this instanceof Duplex)) return new Duplex(options);

  Readable.call(this, options);
  Writable.call(this, options);

  if (options && options.readable === false) this.readable = false;

  if (options && options.writable === false) this.writable = false;

  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

  this.once('end', onend);
}

// the no-half-open enforcer
function onend() {
  // if we allow half-open state, or if the writable side ended,
  // then we're ok.
  if (this.allowHalfOpen || this._writableState.ended) return;

  // no more data can be written.
  // But allow more writes to happen in this tick.
  processNextTick(onEndNT, this);
}

function onEndNT(self) {
  self.end();
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
},{"./_stream_readable":17,"./_stream_writable":19,"core-util-is":6,"inherits":9,"process-nextick-args":12}],16:[function(require,module,exports){
// a passthrough stream.
// basically just the most minimal sort of Transform stream.
// Every written chunk gets output as-is.

'use strict';

module.exports = PassThrough;

var Transform = require('./_stream_transform');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(PassThrough, Transform);

function PassThrough(options) {
  if (!(this instanceof PassThrough)) return new PassThrough(options);

  Transform.call(this, options);
}

PassThrough.prototype._transform = function (chunk, encoding, cb) {
  cb(null, chunk);
};
},{"./_stream_transform":18,"core-util-is":6,"inherits":9}],17:[function(require,module,exports){
(function (process){
'use strict';

module.exports = Readable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var isArray = require('isarray');
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Readable.ReadableState = ReadableState;

/*<replacement>*/
var EE = require('events').EventEmitter;

var EElistenerCount = function (emitter, type) {
  return emitter.listeners(type).length;
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var debugUtil = require('util');
var debug = void 0;
if (debugUtil && debugUtil.debuglog) {
  debug = debugUtil.debuglog('stream');
} else {
  debug = function () {};
}
/*</replacement>*/

var BufferList = require('./internal/streams/BufferList');
var StringDecoder;

util.inherits(Readable, Stream);

var kProxyEvents = ['error', 'close', 'destroy', 'pause', 'resume'];

function prependListener(emitter, event, fn) {
  // Sadly this is not cacheable as some libraries bundle their own
  // event emitter implementation with them.
  if (typeof emitter.prependListener === 'function') {
    return emitter.prependListener(event, fn);
  } else {
    // This is a hack to make sure that our error handler is attached before any
    // userland ones.  NEVER DO THIS. This is here only because this code needs
    // to continue to work with older versions of Node.js that do not include
    // the prependListener() method. The goal is to eventually remove this hack.
    if (!emitter._events || !emitter._events[event]) emitter.on(event, fn);else if (isArray(emitter._events[event])) emitter._events[event].unshift(fn);else emitter._events[event] = [fn, emitter._events[event]];
  }
}

function ReadableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag. Used to make read(n) ignore n and to
  // make all the buffer merging and length checks go away
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;

  // the point at which it stops calling _read() to fill the buffer
  // Note: 0 is a valid value, means "don't call _read preemptively ever"
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // A linked list is used to store data chunks instead of an array because the
  // linked list can remove elements from the beginning faster than
  // array.shift()
  this.buffer = new BufferList();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // whenever we return null, then we set a flag to say
  // that we're awaiting a 'readable' event emission.
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // when piping, we only care about 'readable' events that happen
  // after read()ing all the bytes and not getting any pushback.
  this.ranOut = false;

  // the number of writers that are awaiting a drain event in .pipe()s
  this.awaitDrain = 0;

  // if true, a maybeReadMore has been scheduled
  this.readingMore = false;

  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}

function Readable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  if (!(this instanceof Readable)) return new Readable(options);

  this._readableState = new ReadableState(options, this);

  // legacy
  this.readable = true;

  if (options && typeof options.read === 'function') this._read = options.read;

  Stream.call(this);
}

// Manually shove something into the read() buffer.
// This returns true if the highWaterMark has not been hit yet,
// similar to how Writable.write() returns true if you should
// write() some more.
Readable.prototype.push = function (chunk, encoding) {
  var state = this._readableState;

  if (!state.objectMode && typeof chunk === 'string') {
    encoding = encoding || state.defaultEncoding;
    if (encoding !== state.encoding) {
      chunk = bufferShim.from(chunk, encoding);
      encoding = '';
    }
  }

  return readableAddChunk(this, state, chunk, encoding, false);
};

// Unshift should *always* be something directly out of read()
Readable.prototype.unshift = function (chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

Readable.prototype.isPaused = function () {
  return this._readableState.flowing === false;
};

function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit('error', er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error('stream.push() after EOF');
      stream.emit('error', e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error('stream.unshift() after end event');
      stream.emit('error', _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }

      if (!addToFront) state.reading = false;

      // Don't add to the buffer if we've decoded to an empty string chunk and
      // we're not in object mode
      if (!skipAdd) {
        // if we want the data now, just emit it.
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit('data', chunk);
          stream.read(0);
        } else {
          // update the buffer info.
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

          if (state.needReadable) emitReadable(stream);
        }
      }

      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }

  return needMoreData(state);
}

// if it's past the high water mark, we can push in some more.
// Also, if we have no data yet, we can stand some
// more bytes.  This is to work around cases where hwm=0,
// such as the repl.  Also, if the push() triggered a
// readable event, and the user called read(largeNumber) such that
// needReadable was set, then we ought to push more, so that another
// 'readable' event will be triggered.
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}

// backwards compatibility.
Readable.prototype.setEncoding = function (enc) {
  if (!StringDecoder) StringDecoder = require('string_decoder/').StringDecoder;
  this._readableState.decoder = new StringDecoder(enc);
  this._readableState.encoding = enc;
  return this;
};

// Don't raise the hwm > 8MB
var MAX_HWM = 0x800000;
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    // Get the next highest power of 2 to prevent increasing hwm excessively in
    // tiny amounts
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}

// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended) return 0;
  if (state.objectMode) return 1;
  if (n !== n) {
    // Only flow one buffer at a time
    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
  }
  // If we're asking for more than the current hwm, then raise the hwm.
  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length) return n;
  // Don't have enough
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}

// you can override either this method, or the async _read(n) below.
Readable.prototype.read = function (n) {
  debug('read', n);
  n = parseInt(n, 10);
  var state = this._readableState;
  var nOrig = n;

  if (n !== 0) state.emittedReadable = false;

  // if we're doing read(0) to trigger a readable event, but we
  // already have a bunch of data in the buffer, then just trigger
  // the 'readable' event and move on.
  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
    debug('read: emitReadable', state.length, state.ended);
    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
    return null;
  }

  n = howMuchToRead(n, state);

  // if we've ended, and we're now clear, then finish it up.
  if (n === 0 && state.ended) {
    if (state.length === 0) endReadable(this);
    return null;
  }

  // All the actual chunk generation logic needs to be
  // *below* the call to _read.  The reason is that in certain
  // synthetic stream cases, such as passthrough streams, _read
  // may be a completely synchronous operation which may change
  // the state of the read buffer, providing enough data when
  // before there was *not* enough.
  //
  // So, the steps are:
  // 1. Figure out what the state of things will be after we do
  // a read from the buffer.
  //
  // 2. If that resulting state will trigger a _read, then call _read.
  // Note that this may be asynchronous, or synchronous.  Yes, it is
  // deeply ugly to write APIs this way, but that still doesn't mean
  // that the Readable class should behave improperly, as streams are
  // designed to be sync/async agnostic.
  // Take note if the _read call is sync or async (ie, if the read call
  // has returned yet), so that we know whether or not it's safe to emit
  // 'readable' etc.
  //
  // 3. Actually pull the requested chunks out of the buffer and return.

  // if we need a readable event, then we need to do some reading.
  var doRead = state.needReadable;
  debug('need readable', doRead);

  // if we currently have less than the highWaterMark, then also read some
  if (state.length === 0 || state.length - n < state.highWaterMark) {
    doRead = true;
    debug('length less than watermark', doRead);
  }

  // however, if we've ended, then there's no point, and if we're already
  // reading, then it's unnecessary.
  if (state.ended || state.reading) {
    doRead = false;
    debug('reading or ended', doRead);
  } else if (doRead) {
    debug('do read');
    state.reading = true;
    state.sync = true;
    // if the length is currently zero, then we *need* a readable event.
    if (state.length === 0) state.needReadable = true;
    // call internal read method
    this._read(state.highWaterMark);
    state.sync = false;
    // If _read pushed data synchronously, then `reading` will be false,
    // and we need to re-evaluate how much data we can return to the user.
    if (!state.reading) n = howMuchToRead(nOrig, state);
  }

  var ret;
  if (n > 0) ret = fromList(n, state);else ret = null;

  if (ret === null) {
    state.needReadable = true;
    n = 0;
  } else {
    state.length -= n;
  }

  if (state.length === 0) {
    // If we have nothing in the buffer, then we want to know
    // as soon as we *do* get something into the buffer.
    if (!state.ended) state.needReadable = true;

    // If we tried to read() past the EOF, then emit end on the next tick.
    if (nOrig !== n && state.ended) endReadable(this);
  }

  if (ret !== null) this.emit('data', ret);

  return ret;
};

function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  return er;
}

function onEofChunk(stream, state) {
  if (state.ended) return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;

  // emit 'readable' now to make sure it gets picked up.
  emitReadable(stream);
}

// Don't emit readable right away in sync mode, because this can trigger
// another read() call => stack overflow.  This way, it might trigger
// a nextTick recursion warning, but that's not so bad.
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug('emitReadable', state.flowing);
    state.emittedReadable = true;
    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
  }
}

function emitReadable_(stream) {
  debug('emit readable');
  stream.emit('readable');
  flow(stream);
}

// at this point, the user has presumably seen the 'readable' event,
// and called read() to consume some data.  that may have triggered
// in turn another _read(n) call, in which case reading = true if
// it's in progress.
// However, if we're not ended, or reading, and the length < hwm,
// then go ahead and try to read some more preemptively.
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    processNextTick(maybeReadMore_, stream, state);
  }
}

function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug('maybeReadMore read 0');
    stream.read(0);
    if (len === state.length)
      // didn't get any data, stop spinning.
      break;else len = state.length;
  }
  state.readingMore = false;
}

// abstract method.  to be overridden in specific implementation classes.
// call cb(er, data) where data is <= n in length.
// for virtual (non-string, non-buffer) streams, "length" is somewhat
// arbitrary, and perhaps not very meaningful.
Readable.prototype._read = function (n) {
  this.emit('error', new Error('_read() is not implemented'));
};

Readable.prototype.pipe = function (dest, pipeOpts) {
  var src = this;
  var state = this._readableState;

  switch (state.pipesCount) {
    case 0:
      state.pipes = dest;
      break;
    case 1:
      state.pipes = [state.pipes, dest];
      break;
    default:
      state.pipes.push(dest);
      break;
  }
  state.pipesCount += 1;
  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;

  var endFn = doEnd ? onend : cleanup;
  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);

  dest.on('unpipe', onunpipe);
  function onunpipe(readable) {
    debug('onunpipe');
    if (readable === src) {
      cleanup();
    }
  }

  function onend() {
    debug('onend');
    dest.end();
  }

  // when the dest drains, it reduces the awaitDrain counter
  // on the source.  This would be more elegant with a .once()
  // handler in flow(), but adding and removing repeatedly is
  // too slow.
  var ondrain = pipeOnDrain(src);
  dest.on('drain', ondrain);

  var cleanedUp = false;
  function cleanup() {
    debug('cleanup');
    // cleanup event handlers once the pipe is broken
    dest.removeListener('close', onclose);
    dest.removeListener('finish', onfinish);
    dest.removeListener('drain', ondrain);
    dest.removeListener('error', onerror);
    dest.removeListener('unpipe', onunpipe);
    src.removeListener('end', onend);
    src.removeListener('end', cleanup);
    src.removeListener('data', ondata);

    cleanedUp = true;

    // if the reader is waiting for a drain event from this
    // specific writer, then it would cause it to never start
    // flowing again.
    // So, if this is awaiting a drain, then we just call it now.
    // If we don't know, then assume that we are waiting for one.
    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
  }

  // If the user pushes more data while we're writing to dest then we'll end up
  // in ondata again. However, we only want to increase awaitDrain once because
  // dest will only emit one 'drain' event for the multiple writes.
  // => Introduce a guard on increasing awaitDrain.
  var increasedAwaitDrain = false;
  src.on('data', ondata);
  function ondata(chunk) {
    debug('ondata');
    increasedAwaitDrain = false;
    var ret = dest.write(chunk);
    if (false === ret && !increasedAwaitDrain) {
      // If the user unpiped during `dest.write()`, it is possible
      // to get stuck in a permanently paused state if that write
      // also returned false.
      // => Check whether `dest` is still a piping destination.
      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf(state.pipes, dest) !== -1) && !cleanedUp) {
        debug('false write response, pause', src._readableState.awaitDrain);
        src._readableState.awaitDrain++;
        increasedAwaitDrain = true;
      }
      src.pause();
    }
  }

  // if the dest has an error, then stop piping into it.
  // however, don't suppress the throwing behavior for this.
  function onerror(er) {
    debug('onerror', er);
    unpipe();
    dest.removeListener('error', onerror);
    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
  }

  // Make sure our error handler is attached before userland ones.
  prependListener(dest, 'error', onerror);

  // Both close and finish should trigger unpipe, but only once.
  function onclose() {
    dest.removeListener('finish', onfinish);
    unpipe();
  }
  dest.once('close', onclose);
  function onfinish() {
    debug('onfinish');
    dest.removeListener('close', onclose);
    unpipe();
  }
  dest.once('finish', onfinish);

  function unpipe() {
    debug('unpipe');
    src.unpipe(dest);
  }

  // tell the dest that it's being piped to
  dest.emit('pipe', src);

  // start the flow if it hasn't been started already.
  if (!state.flowing) {
    debug('pipe resume');
    src.resume();
  }

  return dest;
};

function pipeOnDrain(src) {
  return function () {
    var state = src._readableState;
    debug('pipeOnDrain', state.awaitDrain);
    if (state.awaitDrain) state.awaitDrain--;
    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
      state.flowing = true;
      flow(src);
    }
  };
}

Readable.prototype.unpipe = function (dest) {
  var state = this._readableState;

  // if we're not piping anywhere, then do nothing.
  if (state.pipesCount === 0) return this;

  // just one destination.  most common case.
  if (state.pipesCount === 1) {
    // passed in one, but it's not the right one.
    if (dest && dest !== state.pipes) return this;

    if (!dest) dest = state.pipes;

    // got a match.
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;
    if (dest) dest.emit('unpipe', this);
    return this;
  }

  // slow case. multiple pipe destinations.

  if (!dest) {
    // remove all.
    var dests = state.pipes;
    var len = state.pipesCount;
    state.pipes = null;
    state.pipesCount = 0;
    state.flowing = false;

    for (var i = 0; i < len; i++) {
      dests[i].emit('unpipe', this);
    }return this;
  }

  // try to find the right one.
  var index = indexOf(state.pipes, dest);
  if (index === -1) return this;

  state.pipes.splice(index, 1);
  state.pipesCount -= 1;
  if (state.pipesCount === 1) state.pipes = state.pipes[0];

  dest.emit('unpipe', this);

  return this;
};

// set up data events if they are asked for
// Ensure readable listeners eventually get something
Readable.prototype.on = function (ev, fn) {
  var res = Stream.prototype.on.call(this, ev, fn);

  if (ev === 'data') {
    // Start flowing on next tick if stream isn't explicitly paused
    if (this._readableState.flowing !== false) this.resume();
  } else if (ev === 'readable') {
    var state = this._readableState;
    if (!state.endEmitted && !state.readableListening) {
      state.readableListening = state.needReadable = true;
      state.emittedReadable = false;
      if (!state.reading) {
        processNextTick(nReadingNextTick, this);
      } else if (state.length) {
        emitReadable(this, state);
      }
    }
  }

  return res;
};
Readable.prototype.addListener = Readable.prototype.on;

function nReadingNextTick(self) {
  debug('readable nexttick read 0');
  self.read(0);
}

// pause() and resume() are remnants of the legacy readable stream API
// If the user uses them, then switch into old mode.
Readable.prototype.resume = function () {
  var state = this._readableState;
  if (!state.flowing) {
    debug('resume');
    state.flowing = true;
    resume(this, state);
  }
  return this;
};

function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    processNextTick(resume_, stream, state);
  }
}

function resume_(stream, state) {
  if (!state.reading) {
    debug('resume read 0');
    stream.read(0);
  }

  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit('resume');
  flow(stream);
  if (state.flowing && !state.reading) stream.read(0);
}

Readable.prototype.pause = function () {
  debug('call pause flowing=%j', this._readableState.flowing);
  if (false !== this._readableState.flowing) {
    debug('pause');
    this._readableState.flowing = false;
    this.emit('pause');
  }
  return this;
};

function flow(stream) {
  var state = stream._readableState;
  debug('flow', state.flowing);
  while (state.flowing && stream.read() !== null) {}
}

// wrap an old-style stream as the async data source.
// This is *not* part of the readable stream interface.
// It is an ugly unfortunate mess of history.
Readable.prototype.wrap = function (stream) {
  var state = this._readableState;
  var paused = false;

  var self = this;
  stream.on('end', function () {
    debug('wrapped end');
    if (state.decoder && !state.ended) {
      var chunk = state.decoder.end();
      if (chunk && chunk.length) self.push(chunk);
    }

    self.push(null);
  });

  stream.on('data', function (chunk) {
    debug('wrapped data');
    if (state.decoder) chunk = state.decoder.write(chunk);

    // don't skip over falsy values in objectMode
    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

    var ret = self.push(chunk);
    if (!ret) {
      paused = true;
      stream.pause();
    }
  });

  // proxy all the other methods.
  // important when wrapping filters and duplexes.
  for (var i in stream) {
    if (this[i] === undefined && typeof stream[i] === 'function') {
      this[i] = function (method) {
        return function () {
          return stream[method].apply(stream, arguments);
        };
      }(i);
    }
  }

  // proxy certain important events.
  for (var n = 0; n < kProxyEvents.length; n++) {
    stream.on(kProxyEvents[n], self.emit.bind(self, kProxyEvents[n]));
  }

  // when we try to consume some more bytes, simply unpause the
  // underlying stream.
  self._read = function (n) {
    debug('wrapped _read', n);
    if (paused) {
      paused = false;
      stream.resume();
    }
  };

  return self;
};

// exposed for testing purposes only.
Readable._fromList = fromList;

// Pluck off n bytes from an array of buffers.
// Length is the combined lengths of all the buffers in the list.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromList(n, state) {
  // nothing buffered
  if (state.length === 0) return null;

  var ret;
  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
    // read it all, truncate the list
    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    // read part of list
    ret = fromListPartial(n, state.buffer, state.decoder);
  }

  return ret;
}

// Extracts only enough buffered data to satisfy the amount requested.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    // slice is the same for buffers and strings
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    // first chunk is a perfect match
    ret = list.shift();
  } else {
    // result spans more than one buffer
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}

// Copies a specified amount of characters from the list of buffered data
// chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length) ret += str;else ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

// Copies a specified amount of bytes from the list of buffered data chunks.
// This function is designed to be inlinable, so please take care when making
// changes to the function body.
function copyFromBuffer(n, list) {
  var ret = bufferShim.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next) list.head = p.next;else list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}

function endReadable(stream) {
  var state = stream._readableState;

  // If we get here before consuming all the bytes, then that is a
  // bug in node.  Should never happen.
  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

  if (!state.endEmitted) {
    state.ended = true;
    processNextTick(endReadableNT, state, stream);
  }
}

function endReadableNT(state, stream) {
  // Check that we didn't get one last unshift.
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit('end');
  }
}

function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}

function indexOf(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x) return i;
  }
  return -1;
}
}).call(this,require('_process'))
},{"./_stream_duplex":15,"./internal/streams/BufferList":20,"./internal/streams/stream":21,"_process":13,"buffer":5,"buffer-shims":4,"core-util-is":6,"events":7,"inherits":9,"isarray":11,"process-nextick-args":12,"string_decoder/":22,"util":3}],18:[function(require,module,exports){
// a transform stream is a readable/writable stream where you do
// something with the data.  Sometimes it's called a "filter",
// but that's not a great name for it, since that implies a thing where
// some bits pass through, and others are simply ignored.  (That would
// be a valid example of a transform, of course.)
//
// While the output is causally related to the input, it's not a
// necessarily symmetric or synchronous transformation.  For example,
// a zlib stream might take multiple plain-text writes(), and then
// emit a single compressed chunk some time in the future.
//
// Here's how this works:
//
// The Transform stream has all the aspects of the readable and writable
// stream classes.  When you write(chunk), that calls _write(chunk,cb)
// internally, and returns false if there's a lot of pending writes
// buffered up.  When you call read(), that calls _read(n) until
// there's enough pending readable data buffered up.
//
// In a transform stream, the written data is placed in a buffer.  When
// _read(n) is called, it transforms the queued up data, calling the
// buffered _write cb's as it consumes chunks.  If consuming a single
// written chunk would result in multiple output chunks, then the first
// outputted bit calls the readcb, and subsequent chunks just go into
// the read buffer, and will cause it to emit 'readable' if necessary.
//
// This way, back-pressure is actually determined by the reading side,
// since _read has to be called to start processing a new chunk.  However,
// a pathological inflate type of transform can cause excessive buffering
// here.  For example, imagine a stream where every byte of input is
// interpreted as an integer from 0-255, and then results in that many
// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
// 1kb of data being output.  In this case, you could write a very small
// amount of input, and end up with a very large amount of output.  In
// such a pathological inflating mechanism, there'd be no way to tell
// the system to stop doing the transform.  A single 4MB write could
// cause the system to run out of memory.
//
// However, even in such a pathological case, only a single written chunk
// would be consumed, and then the rest would wait (un-transformed) until
// the results of the previous transformed chunk were consumed.

'use strict';

module.exports = Transform;

var Duplex = require('./_stream_duplex');

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

util.inherits(Transform, Duplex);

function TransformState(stream) {
  this.afterTransform = function (er, data) {
    return afterTransform(stream, er, data);
  };

  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}

function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;

  var cb = ts.writecb;

  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

  ts.writechunk = null;
  ts.writecb = null;

  if (data !== null && data !== undefined) stream.push(data);

  cb(er);

  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}

function Transform(options) {
  if (!(this instanceof Transform)) return new Transform(options);

  Duplex.call(this, options);

  this._transformState = new TransformState(this);

  var stream = this;

  // start out asking for a readable event once data is transformed.
  this._readableState.needReadable = true;

  // we have implemented the _read method, and done the other things
  // that Readable wants before the first _read call, so unset the
  // sync guard flag.
  this._readableState.sync = false;

  if (options) {
    if (typeof options.transform === 'function') this._transform = options.transform;

    if (typeof options.flush === 'function') this._flush = options.flush;
  }

  // When the writable side finishes, then flush out anything remaining.
  this.once('prefinish', function () {
    if (typeof this._flush === 'function') this._flush(function (er, data) {
      done(stream, er, data);
    });else done(stream);
  });
}

Transform.prototype.push = function (chunk, encoding) {
  this._transformState.needTransform = false;
  return Duplex.prototype.push.call(this, chunk, encoding);
};

// This is the part where you do stuff!
// override this function in implementation classes.
// 'chunk' is an input chunk.
//
// Call `push(newChunk)` to pass along transformed output
// to the readable side.  You may call 'push' zero or more times.
//
// Call `cb(err)` when you are done with this chunk.  If you pass
// an error, then that'll put the hurt on the whole operation.  If you
// never call cb(), then you'll never get another chunk.
Transform.prototype._transform = function (chunk, encoding, cb) {
  throw new Error('_transform() is not implemented');
};

Transform.prototype._write = function (chunk, encoding, cb) {
  var ts = this._transformState;
  ts.writecb = cb;
  ts.writechunk = chunk;
  ts.writeencoding = encoding;
  if (!ts.transforming) {
    var rs = this._readableState;
    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
  }
};

// Doesn't matter what the args are here.
// _transform does all the work.
// That we got here means that the readable side wants more data.
Transform.prototype._read = function (n) {
  var ts = this._transformState;

  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
    ts.transforming = true;
    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
  } else {
    // mark that we need a transform, so that any data that comes in
    // will get processed, now that we've asked for it.
    ts.needTransform = true;
  }
};

function done(stream, er, data) {
  if (er) return stream.emit('error', er);

  if (data !== null && data !== undefined) stream.push(data);

  // if there's nothing in the write buffer, then that means
  // that nothing more will ever be provided
  var ws = stream._writableState;
  var ts = stream._transformState;

  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

  if (ts.transforming) throw new Error('Calling transform done when still transforming');

  return stream.push(null);
}
},{"./_stream_duplex":15,"core-util-is":6,"inherits":9}],19:[function(require,module,exports){
(function (process){
// A bit simpler than readable streams.
// Implement an async ._write(chunk, encoding, cb), and it'll handle all
// the drain event emission and buffering.

'use strict';

module.exports = Writable;

/*<replacement>*/
var processNextTick = require('process-nextick-args');
/*</replacement>*/

/*<replacement>*/
var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
/*</replacement>*/

/*<replacement>*/
var Duplex;
/*</replacement>*/

Writable.WritableState = WritableState;

/*<replacement>*/
var util = require('core-util-is');
util.inherits = require('inherits');
/*</replacement>*/

/*<replacement>*/
var internalUtil = {
  deprecate: require('util-deprecate')
};
/*</replacement>*/

/*<replacement>*/
var Stream = require('./internal/streams/stream');
/*</replacement>*/

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

util.inherits(Writable, Stream);

function nop() {}

function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}

function WritableState(options, stream) {
  Duplex = Duplex || require('./_stream_duplex');

  options = options || {};

  // object stream flag to indicate whether or not this stream
  // contains buffers or objects.
  this.objectMode = !!options.objectMode;

  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;

  // the point at which write() starts returning false
  // Note: 0 is a valid value, means that we always return false if
  // the entire buffer is not flushed immediately on write()
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

  // cast to ints.
  this.highWaterMark = ~~this.highWaterMark;

  // drain event flag.
  this.needDrain = false;
  // at the start of calling end()
  this.ending = false;
  // when end() has been called, and returned
  this.ended = false;
  // when 'finish' is emitted
  this.finished = false;

  // should we decode strings into buffers before passing to _write?
  // this is here so that some node-core streams can optimize string
  // handling at a lower level.
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;

  // Crypto is kind of old and crusty.  Historically, its default string
  // encoding is 'binary' so we have to make this configurable.
  // Everything else in the universe uses 'utf8', though.
  this.defaultEncoding = options.defaultEncoding || 'utf8';

  // not an actual buffer we keep track of, but a measurement
  // of how much we're waiting to get pushed to some underlying
  // socket or file.
  this.length = 0;

  // a flag to see when we're in the middle of a write.
  this.writing = false;

  // when true all writes will be buffered until .uncork() call
  this.corked = 0;

  // a flag to be able to tell if the onwrite cb is called immediately,
  // or on a later tick.  We set this to true at first, because any
  // actions that shouldn't happen until "later" should generally also
  // not happen before the first write call.
  this.sync = true;

  // a flag to know if we're processing previously buffered items, which
  // may call the _write() callback in the same tick, so that we don't
  // end up in an overlapped onwrite situation.
  this.bufferProcessing = false;

  // the callback that's passed to _write(chunk,cb)
  this.onwrite = function (er) {
    onwrite(stream, er);
  };

  // the callback that the user supplies to write(chunk,encoding,cb)
  this.writecb = null;

  // the amount that is being written when _write is called.
  this.writelen = 0;

  this.bufferedRequest = null;
  this.lastBufferedRequest = null;

  // number of pending user-supplied write callbacks
  // this must be 0 before 'finish' can be emitted
  this.pendingcb = 0;

  // emit prefinish if the only thing we're waiting for is _write cbs
  // This is relevant for synchronous Transform streams
  this.prefinished = false;

  // True if the error was already emitted and should not be thrown again
  this.errorEmitted = false;

  // count buffered requests
  this.bufferedRequestCount = 0;

  // allocate the first CorkedRequest, there is always
  // one allocated and free to use, and we maintain at most two
  this.corkedRequestsFree = new CorkedRequest(this);
}

WritableState.prototype.getBuffer = function getBuffer() {
  var current = this.bufferedRequest;
  var out = [];
  while (current) {
    out.push(current);
    current = current.next;
  }
  return out;
};

(function () {
  try {
    Object.defineProperty(WritableState.prototype, 'buffer', {
      get: internalUtil.deprecate(function () {
        return this.getBuffer();
      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
    });
  } catch (_) {}
})();

// Test _writableState for inheritance to account for Duplex streams,
// whose prototype chain only points to Readable.
var realHasInstance;
if (typeof Symbol === 'function' && Symbol.hasInstance && typeof Function.prototype[Symbol.hasInstance] === 'function') {
  realHasInstance = Function.prototype[Symbol.hasInstance];
  Object.defineProperty(Writable, Symbol.hasInstance, {
    value: function (object) {
      if (realHasInstance.call(this, object)) return true;

      return object && object._writableState instanceof WritableState;
    }
  });
} else {
  realHasInstance = function (object) {
    return object instanceof this;
  };
}

function Writable(options) {
  Duplex = Duplex || require('./_stream_duplex');

  // Writable ctor is applied to Duplexes, too.
  // `realHasInstance` is necessary because using plain `instanceof`
  // would return false, as no `_writableState` property is attached.

  // Trying to use the custom `instanceof` for Writable here will also break the
  // Node.js LazyTransform implementation, which has a non-trivial getter for
  // `_writableState` that would lead to infinite recursion.
  if (!realHasInstance.call(Writable, this) && !(this instanceof Duplex)) {
    return new Writable(options);
  }

  this._writableState = new WritableState(options, this);

  // legacy.
  this.writable = true;

  if (options) {
    if (typeof options.write === 'function') this._write = options.write;

    if (typeof options.writev === 'function') this._writev = options.writev;
  }

  Stream.call(this);
}

// Otherwise people can pipe Writable streams, which is just wrong.
Writable.prototype.pipe = function () {
  this.emit('error', new Error('Cannot pipe, not readable'));
};

function writeAfterEnd(stream, cb) {
  var er = new Error('write after end');
  // TODO: defer error events consistently everywhere, not just the cb
  stream.emit('error', er);
  processNextTick(cb, er);
}

// Checks that a user-supplied chunk is valid, especially for the particular
// mode the stream is in. Currently this means that `null` is never accepted
// and undefined/non-string values are only allowed in object mode.
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;

  if (chunk === null) {
    er = new TypeError('May not write null values to stream');
  } else if (typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
    er = new TypeError('Invalid non-string/buffer chunk');
  }
  if (er) {
    stream.emit('error', er);
    processNextTick(cb, er);
    valid = false;
  }
  return valid;
}

Writable.prototype.write = function (chunk, encoding, cb) {
  var state = this._writableState;
  var ret = false;
  var isBuf = Buffer.isBuffer(chunk);

  if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (isBuf) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

  if (typeof cb !== 'function') cb = nop;

  if (state.ended) writeAfterEnd(this, cb);else if (isBuf || validChunk(this, state, chunk, cb)) {
    state.pendingcb++;
    ret = writeOrBuffer(this, state, isBuf, chunk, encoding, cb);
  }

  return ret;
};

Writable.prototype.cork = function () {
  var state = this._writableState;

  state.corked++;
};

Writable.prototype.uncork = function () {
  var state = this._writableState;

  if (state.corked) {
    state.corked--;

    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
  }
};

Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
  // node::ParseEncoding() requires lower case.
  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
  this._writableState.defaultEncoding = encoding;
  return this;
};

function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
    chunk = bufferShim.from(chunk, encoding);
  }
  return chunk;
}

// if we're already writing something, then just put this
// in the queue, and wait our turn.  Otherwise, call _write
// If we return false, then we need a drain event, so set that flag.
function writeOrBuffer(stream, state, isBuf, chunk, encoding, cb) {
  if (!isBuf) {
    chunk = decodeChunk(state, chunk, encoding);
    if (Buffer.isBuffer(chunk)) encoding = 'buffer';
  }
  var len = state.objectMode ? 1 : chunk.length;

  state.length += len;

  var ret = state.length < state.highWaterMark;
  // we must ensure that previous needDrain will not be reset to false.
  if (!ret) state.needDrain = true;

  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }

  return ret;
}

function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}

function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync) processNextTick(cb, er);else cb(er);

  stream._writableState.errorEmitted = true;
  stream.emit('error', er);
}

function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}

function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;

  onwriteStateUpdate(state);

  if (er) onwriteError(stream, state, sync, er, cb);else {
    // Check if we're actually ready to finish, but don't emit yet
    var finished = needFinish(state);

    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }

    if (sync) {
      /*<replacement>*/
      asyncWrite(afterWrite, stream, state, finished, cb);
      /*</replacement>*/
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}

function afterWrite(stream, state, finished, cb) {
  if (!finished) onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}

// Must force callback to be called on nextTick, so that we don't
// emit 'drain' before the write() consumer gets the 'false' return
// value, and has a chance to attach a 'drain' listener.
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit('drain');
  }
}

// if there's something in the buffer waiting, then process it
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;

  if (stream._writev && entry && entry.next) {
    // Fast case, write everything using _writev()
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;

    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }

    doWrite(stream, state, true, state.length, buffer, '', holder.finish);

    // doWrite is almost always async, defer these to save a bit of time
    // as the hot path ends with doWrite
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    // Slow case, write chunks one-by-one
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;

      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      // if we didn't call the onwrite immediately, then
      // it means that we need to wait until it does.
      // also, that means that the chunk and cb are currently
      // being processed, so move the buffer counter past them.
      if (state.writing) {
        break;
      }
    }

    if (entry === null) state.lastBufferedRequest = null;
  }

  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}

Writable.prototype._write = function (chunk, encoding, cb) {
  cb(new Error('_write() is not implemented'));
};

Writable.prototype._writev = null;

Writable.prototype.end = function (chunk, encoding, cb) {
  var state = this._writableState;

  if (typeof chunk === 'function') {
    cb = chunk;
    chunk = null;
    encoding = null;
  } else if (typeof encoding === 'function') {
    cb = encoding;
    encoding = null;
  }

  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

  // .end() fully uncorks
  if (state.corked) {
    state.corked = 1;
    this.uncork();
  }

  // ignore unnecessary end() calls.
  if (!state.ending && !state.finished) endWritable(this, state, cb);
};

function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}

function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit('prefinish');
  }
}

function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit('finish');
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}

function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
  }
  state.ended = true;
  stream.writable = false;
}

// It seems a linked list but it is not
// there will be only 2 of these for each stream
function CorkedRequest(state) {
  var _this = this;

  this.next = null;
  this.entry = null;
  this.finish = function (err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
}).call(this,require('_process'))
},{"./_stream_duplex":15,"./internal/streams/stream":21,"_process":13,"buffer":5,"buffer-shims":4,"core-util-is":6,"inherits":9,"process-nextick-args":12,"util-deprecate":30}],20:[function(require,module,exports){
'use strict';

var Buffer = require('buffer').Buffer;
/*<replacement>*/
var bufferShim = require('buffer-shims');
/*</replacement>*/

module.exports = BufferList;

function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}

BufferList.prototype.push = function (v) {
  var entry = { data: v, next: null };
  if (this.length > 0) this.tail.next = entry;else this.head = entry;
  this.tail = entry;
  ++this.length;
};

BufferList.prototype.unshift = function (v) {
  var entry = { data: v, next: this.head };
  if (this.length === 0) this.tail = entry;
  this.head = entry;
  ++this.length;
};

BufferList.prototype.shift = function () {
  if (this.length === 0) return;
  var ret = this.head.data;
  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
  --this.length;
  return ret;
};

BufferList.prototype.clear = function () {
  this.head = this.tail = null;
  this.length = 0;
};

BufferList.prototype.join = function (s) {
  if (this.length === 0) return '';
  var p = this.head;
  var ret = '' + p.data;
  while (p = p.next) {
    ret += s + p.data;
  }return ret;
};

BufferList.prototype.concat = function (n) {
  if (this.length === 0) return bufferShim.alloc(0);
  if (this.length === 1) return this.head.data;
  var ret = bufferShim.allocUnsafe(n >>> 0);
  var p = this.head;
  var i = 0;
  while (p) {
    p.data.copy(ret, i);
    i += p.data.length;
    p = p.next;
  }
  return ret;
};
},{"buffer":5,"buffer-shims":4}],21:[function(require,module,exports){
module.exports = require('events').EventEmitter;

},{"events":7}],22:[function(require,module,exports){
'use strict';

var Buffer = require('safe-buffer').Buffer;

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return -1;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// UTF-8 replacement characters ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd'.repeat(p);
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd'.repeat(p + 1);
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd'.repeat(p + 2);
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character for each buffered byte of a (partial)
// character needs to be added to the output.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd'.repeat(this.lastTotal - this.lastNeed);
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}
},{"safe-buffer":27}],23:[function(require,module,exports){
module.exports = require('./readable').PassThrough

},{"./readable":24}],24:[function(require,module,exports){
exports = module.exports = require('./lib/_stream_readable.js');
exports.Stream = exports;
exports.Readable = exports;
exports.Writable = require('./lib/_stream_writable.js');
exports.Duplex = require('./lib/_stream_duplex.js');
exports.Transform = require('./lib/_stream_transform.js');
exports.PassThrough = require('./lib/_stream_passthrough.js');

},{"./lib/_stream_duplex.js":15,"./lib/_stream_passthrough.js":16,"./lib/_stream_readable.js":17,"./lib/_stream_transform.js":18,"./lib/_stream_writable.js":19}],25:[function(require,module,exports){
module.exports = require('./readable').Transform

},{"./readable":24}],26:[function(require,module,exports){
module.exports = require('./lib/_stream_writable.js');

},{"./lib/_stream_writable.js":19}],27:[function(require,module,exports){
module.exports = require('buffer')

},{"buffer":5}],28:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

module.exports = Stream;

var EE = require('events').EventEmitter;
var inherits = require('inherits');

inherits(Stream, EE);
Stream.Readable = require('readable-stream/readable.js');
Stream.Writable = require('readable-stream/writable.js');
Stream.Duplex = require('readable-stream/duplex.js');
Stream.Transform = require('readable-stream/transform.js');
Stream.PassThrough = require('readable-stream/passthrough.js');

// Backwards-compat with node 0.4.x
Stream.Stream = Stream;



// old-style streams.  Note that the pipe method (the only relevant
// part of this class) is overridden in the Readable class.

function Stream() {
  EE.call(this);
}

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (EE.listenerCount(this, 'error') === 0) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.removeListener('data', ondata);
    dest.removeListener('drain', ondrain);

    source.removeListener('end', onend);
    source.removeListener('close', onclose);

    source.removeListener('error', onerror);
    dest.removeListener('error', onerror);

    source.removeListener('end', cleanup);
    source.removeListener('close', cleanup);

    dest.removeListener('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
};

},{"events":7,"inherits":9,"readable-stream/duplex.js":14,"readable-stream/passthrough.js":23,"readable-stream/readable.js":24,"readable-stream/transform.js":25,"readable-stream/writable.js":26}],29:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Buffer = require('buffer').Buffer;

var isBufferEncoding = Buffer.isEncoding
  || function(encoding) {
       switch (encoding && encoding.toLowerCase()) {
         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
         default: return false;
       }
     }


function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error('Unknown encoding: ' + encoding);
  }
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters. CESU-8 is handled as part of the UTF-8 encoding.
//
// @TODO Handling all encodings inside a single object makes it very difficult
// to reason about this code, so it should be split up in the future.
// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
// points as used by CESU-8.
var StringDecoder = exports.StringDecoder = function(encoding) {
  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
  assertEncoding(encoding);
  switch (this.encoding) {
    case 'utf8':
      // CESU-8 represents each of Surrogate Pair by 3-bytes
      this.surrogateSize = 3;
      break;
    case 'ucs2':
    case 'utf16le':
      // UTF-16 represents each of Surrogate Pair by 2-bytes
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case 'base64':
      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }

  // Enough space to store all bytes of a single character. UTF-8 needs 4
  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
  this.charBuffer = new Buffer(6);
  // Number of bytes received for the current incomplete multi-byte character.
  this.charReceived = 0;
  // Number of bytes expected for the current incomplete multi-byte character.
  this.charLength = 0;
};


// write decodes the given buffer and returns it as JS string that is
// guaranteed to not contain any partial multi-byte characters. Any partial
// character found at the end of the buffer is buffered up, and will be
// returned when calling write again with the remaining bytes.
//
// Note: Converting a Buffer containing an orphan surrogate to a String
// currently works, but converting a String to a Buffer (via `new Buffer`, or
// Buffer#write) will replace incomplete surrogates with the unicode
// replacement character. See https://codereview.chromium.org/121173009/ .
StringDecoder.prototype.write = function(buffer) {
  var charStr = '';
  // if our last write ended with an incomplete multibyte character
  while (this.charLength) {
    // determine how many remaining bytes this buffer has to offer for this char
    var available = (buffer.length >= this.charLength - this.charReceived) ?
        this.charLength - this.charReceived :
        buffer.length;

    // add the new bytes to the char buffer
    buffer.copy(this.charBuffer, this.charReceived, 0, available);
    this.charReceived += available;

    if (this.charReceived < this.charLength) {
      // still not enough chars in this buffer? wait for more ...
      return '';
    }

    // remove bytes belonging to the current character from the buffer
    buffer = buffer.slice(available, buffer.length);

    // get the character that was split
    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
    var charCode = charStr.charCodeAt(charStr.length - 1);
    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
      this.charLength += this.surrogateSize;
      charStr = '';
      continue;
    }
    this.charReceived = this.charLength = 0;

    // if there are no more bytes in this buffer, just emit our char
    if (buffer.length === 0) {
      return charStr;
    }
    break;
  }

  // determine and set charLength / charReceived
  this.detectIncompleteChar(buffer);

  var end = buffer.length;
  if (this.charLength) {
    // buffer the incomplete character bytes we got
    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
    end -= this.charReceived;
  }

  charStr += buffer.toString(this.encoding, 0, end);

  var end = charStr.length - 1;
  var charCode = charStr.charCodeAt(end);
  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
    var size = this.surrogateSize;
    this.charLength += size;
    this.charReceived += size;
    this.charBuffer.copy(this.charBuffer, size, 0, size);
    buffer.copy(this.charBuffer, 0, 0, size);
    return charStr.substring(0, end);
  }

  // or just emit the charStr
  return charStr;
};

// detectIncompleteChar determines if there is an incomplete UTF-8 character at
// the end of the given buffer. If so, it sets this.charLength to the byte
// length that character, and sets this.charReceived to the number of bytes
// that are available for this character.
StringDecoder.prototype.detectIncompleteChar = function(buffer) {
  // determine how many bytes we have to check at the end of this buffer
  var i = (buffer.length >= 3) ? 3 : buffer.length;

  // Figure out if one of the last i bytes of our buffer announces an
  // incomplete char.
  for (; i > 0; i--) {
    var c = buffer[buffer.length - i];

    // See http://en.wikipedia.org/wiki/UTF-8#Description

    // 110XXXXX
    if (i == 1 && c >> 5 == 0x06) {
      this.charLength = 2;
      break;
    }

    // 1110XXXX
    if (i <= 2 && c >> 4 == 0x0E) {
      this.charLength = 3;
      break;
    }

    // 11110XXX
    if (i <= 3 && c >> 3 == 0x1E) {
      this.charLength = 4;
      break;
    }
  }
  this.charReceived = i;
};

StringDecoder.prototype.end = function(buffer) {
  var res = '';
  if (buffer && buffer.length)
    res = this.write(buffer);

  if (this.charReceived) {
    var cr = this.charReceived;
    var buf = this.charBuffer;
    var enc = this.encoding;
    res += buf.slice(0, cr).toString(enc);
  }

  return res;
};

function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}

function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}

function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}

},{"buffer":5}],30:[function(require,module,exports){
(function (global){

/**
 * Module exports.
 */

module.exports = deprecate;

/**
 * Mark that a method should not be used.
 * Returns a modified function which warns once by default.
 *
 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
 *
 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
 * will throw an Error when invoked.
 *
 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
 * will invoke `console.trace()` instead of `console.error()`.
 *
 * @param {Function} fn - the function to deprecate
 * @param {String} msg - the string to print to the console when `fn` is invoked
 * @returns {Function} a new "deprecated" version of `fn`
 * @api public
 */

function deprecate (fn, msg) {
  if (config('noDeprecation')) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (config('throwDeprecation')) {
        throw new Error(msg);
      } else if (config('traceDeprecation')) {
        console.trace(msg);
      } else {
        console.warn(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
}

/**
 * Checks `localStorage` for boolean values for the given `name`.
 *
 * @param {String} name
 * @returns {Boolean}
 * @api private
 */

function config (name) {
  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
  try {
    if (!global.localStorage) return false;
  } catch (_) {
    return false;
  }
  var val = global.localStorage[name];
  if (null == val) return false;
  return String(val).toLowerCase() === 'true';
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],31:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],32:[function(require,module,exports){
module.exports = function isBuffer(arg) {
  return arg && typeof arg === 'object'
    && typeof arg.copy === 'function'
    && typeof arg.fill === 'function'
    && typeof arg.readUInt8 === 'function';
}
},{}],33:[function(require,module,exports){
(function (process,global){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var formatRegExp = /%[sdj%]/g;
exports.format = function(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect(arguments[i]));
    }
    return objects.join(' ');
  }

  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x) {
    if (x === '%%') return '%';
    if (i >= len) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += ' ' + x;
    } else {
      str += ' ' + inspect(x);
    }
  }
  return str;
};


// Mark that a method should not be used.
// Returns a modified function which warns once by default.
// If --no-deprecation is set, then it is a no-op.
exports.deprecate = function(fn, msg) {
  // Allow for deprecating things in the process of starting up.
  if (isUndefined(global.process)) {
    return function() {
      return exports.deprecate(fn, msg).apply(this, arguments);
    };
  }

  if (process.noDeprecation === true) {
    return fn;
  }

  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process.throwDeprecation) {
        throw new Error(msg);
      } else if (process.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }

  return deprecated;
};


var debugs = {};
var debugEnviron;
exports.debuglog = function(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process.env.NODE_DEBUG || '';
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
      var pid = process.pid;
      debugs[set] = function() {
        var msg = exports.format.apply(exports, arguments);
        console.error('%s %d: %s', set, pid, msg);
      };
    } else {
      debugs[set] = function() {};
    }
  }
  return debugs[set];
};


/**
 * Echos the value of a value. Trys to print the value out
 * in the best way possible given the different types.
 *
 * @param {Object} obj The object to print out.
 * @param {Object} opts Optional options object that alters the output.
 */
/* legacy: obj, showHidden, depth, colors*/
function inspect(obj, opts) {
  // default options
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  // legacy...
  if (arguments.length >= 3) ctx.depth = arguments[2];
  if (arguments.length >= 4) ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    // legacy...
    ctx.showHidden = opts;
  } else if (opts) {
    // got an "options" object
    exports._extend(ctx, opts);
  }
  // set default options
  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
  if (isUndefined(ctx.depth)) ctx.depth = 2;
  if (isUndefined(ctx.colors)) ctx.colors = false;
  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
  if (ctx.colors) ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
exports.inspect = inspect;


// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
inspect.colors = {
  'bold' : [1, 22],
  'italic' : [3, 23],
  'underline' : [4, 24],
  'inverse' : [7, 27],
  'white' : [37, 39],
  'grey' : [90, 39],
  'black' : [30, 39],
  'blue' : [34, 39],
  'cyan' : [36, 39],
  'green' : [32, 39],
  'magenta' : [35, 39],
  'red' : [31, 39],
  'yellow' : [33, 39]
};

// Don't use 'blue' not visible on cmd.exe
inspect.styles = {
  'special': 'cyan',
  'number': 'yellow',
  'boolean': 'yellow',
  'undefined': 'grey',
  'null': 'bold',
  'string': 'green',
  'date': 'magenta',
  // "name": intentionally not styling
  'regexp': 'red'
};


function stylizeWithColor(str, styleType) {
  var style = inspect.styles[styleType];

  if (style) {
    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
           '\u001b[' + inspect.colors[style][1] + 'm';
  } else {
    return str;
  }
}


function stylizeNoColor(str, styleType) {
  return str;
}


function arrayToHash(array) {
  var hash = {};

  array.forEach(function(val, idx) {
    hash[val] = true;
  });

  return hash;
}


function formatValue(ctx, value, recurseTimes) {
  // Provide a hook for user-specified inspect functions.
  // Check that value is an object with an inspect function on it
  if (ctx.customInspect &&
      value &&
      isFunction(value.inspect) &&
      // Filter out the util module, it's inspect function is special
      value.inspect !== exports.inspect &&
      // Also filter out any prototype objects using the circular check.
      !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }

  // Primitive types cannot have properties
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }

  // Look up the keys of the object.
  var keys = Object.keys(value);
  var visibleKeys = arrayToHash(keys);

  if (ctx.showHidden) {
    keys = Object.getOwnPropertyNames(value);
  }

  // IE doesn't make error fields non-enumerable
  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
  if (isError(value)
      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
    return formatError(value);
  }

  // Some type of object without properties can be shortcutted.
  if (keys.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ': ' + value.name : '';
      return ctx.stylize('[Function' + name + ']', 'special');
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), 'date');
    }
    if (isError(value)) {
      return formatError(value);
    }
  }

  var base = '', array = false, braces = ['{', '}'];

  // Make Array say that they are Array
  if (isArray(value)) {
    array = true;
    braces = ['[', ']'];
  }

  // Make functions say that they are functions
  if (isFunction(value)) {
    var n = value.name ? ': ' + value.name : '';
    base = ' [Function' + n + ']';
  }

  // Make RegExps say that they are RegExps
  if (isRegExp(value)) {
    base = ' ' + RegExp.prototype.toString.call(value);
  }

  // Make dates with properties first say the date
  if (isDate(value)) {
    base = ' ' + Date.prototype.toUTCString.call(value);
  }

  // Make error with message first say the error
  if (isError(value)) {
    base = ' ' + formatError(value);
  }

  if (keys.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }

  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
    } else {
      return ctx.stylize('[Object]', 'special');
    }
  }

  ctx.seen.push(value);

  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
  } else {
    output = keys.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }

  ctx.seen.pop();

  return reduceToSingleString(output, base, braces);
}


function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize('undefined', 'undefined');
  if (isString(value)) {
    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                             .replace(/'/g, "\\'")
                                             .replace(/\\"/g, '"') + '\'';
    return ctx.stylize(simple, 'string');
  }
  if (isNumber(value))
    return ctx.stylize('' + value, 'number');
  if (isBoolean(value))
    return ctx.stylize('' + value, 'boolean');
  // For some reason typeof null is "object", so special case here.
  if (isNull(value))
    return ctx.stylize('null', 'null');
}


function formatError(value) {
  return '[' + Error.prototype.toString.call(value) + ']';
}


function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          String(i), true));
    } else {
      output.push('');
    }
  }
  keys.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
          key, true));
    }
  });
  return output;
}


function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize('[Getter/Setter]', 'special');
    } else {
      str = ctx.stylize('[Getter]', 'special');
    }
  } else {
    if (desc.set) {
      str = ctx.stylize('[Setter]', 'special');
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = '[' + key + ']';
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf('\n') > -1) {
        if (array) {
          str = str.split('\n').map(function(line) {
            return '  ' + line;
          }).join('\n').substr(2);
        } else {
          str = '\n' + str.split('\n').map(function(line) {
            return '   ' + line;
          }).join('\n');
        }
      }
    } else {
      str = ctx.stylize('[Circular]', 'special');
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify('' + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, 'name');
    } else {
      name = name.replace(/'/g, "\\'")
                 .replace(/\\"/g, '"')
                 .replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, 'string');
    }
  }

  return name + ': ' + str;
}


function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf('\n') >= 0) numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
  }, 0);

  if (length > 60) {
    return braces[0] +
           (base === '' ? '' : base + '\n ') +
           ' ' +
           output.join(',\n  ') +
           ' ' +
           braces[1];
  }

  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}


// NOTE: These type checking functions intentionally don't use `instanceof`
// because it is fragile and can be easily faked with `Object.create()`.
function isArray(ar) {
  return Array.isArray(ar);
}
exports.isArray = isArray;

function isBoolean(arg) {
  return typeof arg === 'boolean';
}
exports.isBoolean = isBoolean;

function isNull(arg) {
  return arg === null;
}
exports.isNull = isNull;

function isNullOrUndefined(arg) {
  return arg == null;
}
exports.isNullOrUndefined = isNullOrUndefined;

function isNumber(arg) {
  return typeof arg === 'number';
}
exports.isNumber = isNumber;

function isString(arg) {
  return typeof arg === 'string';
}
exports.isString = isString;

function isSymbol(arg) {
  return typeof arg === 'symbol';
}
exports.isSymbol = isSymbol;

function isUndefined(arg) {
  return arg === void 0;
}
exports.isUndefined = isUndefined;

function isRegExp(re) {
  return isObject(re) && objectToString(re) === '[object RegExp]';
}
exports.isRegExp = isRegExp;

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}
exports.isObject = isObject;

function isDate(d) {
  return isObject(d) && objectToString(d) === '[object Date]';
}
exports.isDate = isDate;

function isError(e) {
  return isObject(e) &&
      (objectToString(e) === '[object Error]' || e instanceof Error);
}
exports.isError = isError;

function isFunction(arg) {
  return typeof arg === 'function';
}
exports.isFunction = isFunction;

function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||  // ES6 symbol
         typeof arg === 'undefined';
}
exports.isPrimitive = isPrimitive;

exports.isBuffer = require('./support/isBuffer');

function objectToString(o) {
  return Object.prototype.toString.call(o);
}


function pad(n) {
  return n < 10 ? '0' + n.toString(10) : n.toString(10);
}


var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
              'Oct', 'Nov', 'Dec'];

// 26 Feb 16:19:34
function timestamp() {
  var d = new Date();
  var time = [pad(d.getHours()),
              pad(d.getMinutes()),
              pad(d.getSeconds())].join(':');
  return [d.getDate(), months[d.getMonth()], time].join(' ');
}


// log is just a thin wrapper to console.log that prepends a timestamp
exports.log = function() {
  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
};


/**
 * Inherit the prototype methods from one constructor into another.
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
exports.inherits = require('inherits');

exports._extend = function(origin, add) {
  // Don't do anything if add isn't an object
  if (!add || !isObject(add)) return origin;

  var keys = Object.keys(add);
  var i = keys.length;
  while (i--) {
    origin[keys[i]] = add[keys[i]];
  }
  return origin;
};

function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./support/isBuffer":32,"_process":13,"inherits":31}],34:[function(require,module,exports){
let bitcoin = require('bitcoinjs-lib');

module.exports = {
    bitcoin
}

},{"bitcoinjs-lib":52}],35:[function(require,module,exports){
// base-x encoding
// Forked from https://github.com/cryptocoinjs/bs58
// Originally written by Mike Hearn for BitcoinJ
// Copyright (c) 2011 Google Inc
// Ported to JavaScript by Stefan Thomas
// Merged Buffer refactorings from base58-native by Stephen Pair
// Copyright (c) 2013 BitPay Inc

var Buffer = require('safe-buffer').Buffer

module.exports = function base (ALPHABET) {
  var ALPHABET_MAP = {}
  var BASE = ALPHABET.length
  var LEADER = ALPHABET.charAt(0)

  // pre-compute lookup table
  for (var z = 0; z < ALPHABET.length; z++) {
    var x = ALPHABET.charAt(z)

    if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
    ALPHABET_MAP[x] = z
  }

  function encode (source) {
    if (source.length === 0) return ''

    var digits = [0]
    for (var i = 0; i < source.length; ++i) {
      for (var j = 0, carry = source[i]; j < digits.length; ++j) {
        carry += digits[j] << 8
        digits[j] = carry % BASE
        carry = (carry / BASE) | 0
      }

      while (carry > 0) {
        digits.push(carry % BASE)
        carry = (carry / BASE) | 0
      }
    }

    var string = ''

    // deal with leading zeros
    for (var k = 0; source[k] === 0 && k < source.length - 1; ++k) string += LEADER
    // convert digits to a string
    for (var q = digits.length - 1; q >= 0; --q) string += ALPHABET[digits[q]]

    return string
  }

  function decodeUnsafe (string) {
    if (typeof string !== 'string') throw new TypeError('Expected String')
    if (string.length === 0) return Buffer.allocUnsafe(0)

    var bytes = [0]
    for (var i = 0; i < string.length; i++) {
      var value = ALPHABET_MAP[string[i]]
      if (value === undefined) return

      for (var j = 0, carry = value; j < bytes.length; ++j) {
        carry += bytes[j] * BASE
        bytes[j] = carry & 0xff
        carry >>= 8
      }

      while (carry > 0) {
        bytes.push(carry & 0xff)
        carry >>= 8
      }
    }

    // deal with leading zeros
    for (var k = 0; string[k] === LEADER && k < string.length - 1; ++k) {
      bytes.push(0)
    }

    return Buffer.from(bytes.reverse())
  }

  function decode (string) {
    var buffer = decodeUnsafe(string)
    if (buffer) return buffer

    throw new Error('Non-base' + BASE + ' character')
  }

  return {
    encode: encode,
    decodeUnsafe: decodeUnsafe,
    decode: decode
  }
}

},{"safe-buffer":101}],36:[function(require,module,exports){
'use strict'
var ALPHABET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l'

// pre-compute lookup table
var ALPHABET_MAP = {}
for (var z = 0; z < ALPHABET.length; z++) {
  var x = ALPHABET.charAt(z)

  if (ALPHABET_MAP[x] !== undefined) throw new TypeError(x + ' is ambiguous')
  ALPHABET_MAP[x] = z
}

function polymodStep (pre) {
  var b = pre >> 25
  return ((pre & 0x1FFFFFF) << 5) ^
    (-((b >> 0) & 1) & 0x3b6a57b2) ^
    (-((b >> 1) & 1) & 0x26508e6d) ^
    (-((b >> 2) & 1) & 0x1ea119fa) ^
    (-((b >> 3) & 1) & 0x3d4233dd) ^
    (-((b >> 4) & 1) & 0x2a1462b3)
}

function prefixChk (prefix) {
  var chk = 1
  for (var i = 0; i < prefix.length; ++i) {
    var c = prefix.charCodeAt(i)
    if (c < 33 || c > 126) throw new Error('Invalid prefix (' + prefix + ')')

    chk = polymodStep(chk) ^ (c >> 5)
  }
  chk = polymodStep(chk)

  for (i = 0; i < prefix.length; ++i) {
    var v = prefix.charCodeAt(i)
    chk = polymodStep(chk) ^ (v & 0x1f)
  }
  return chk
}

function encode (prefix, words, LIMIT) {
  LIMIT = LIMIT || 90
  if ((prefix.length + 7 + words.length) > LIMIT) throw new TypeError('Exceeds length limit')

  prefix = prefix.toLowerCase()

  // determine chk mod
  var chk = prefixChk(prefix)
  var result = prefix + '1'
  for (var i = 0; i < words.length; ++i) {
    var x = words[i]
    if ((x >> 5) !== 0) throw new Error('Non 5-bit word')

    chk = polymodStep(chk) ^ x
    result += ALPHABET.charAt(x)
  }

  for (i = 0; i < 6; ++i) {
    chk = polymodStep(chk)
  }
  chk ^= 1

  for (i = 0; i < 6; ++i) {
    var v = (chk >> ((5 - i) * 5)) & 0x1f
    result += ALPHABET.charAt(v)
  }

  return result
}

function decode (str, LIMIT) {
  LIMIT = LIMIT || 90
  if (str.length < 8) throw new TypeError(str + ' too short')
  if (str.length > LIMIT) throw new TypeError('Exceeds length limit')

  // don't allow mixed case
  var lowered = str.toLowerCase()
  var uppered = str.toUpperCase()
  if (str !== lowered && str !== uppered) throw new Error('Mixed-case string ' + str)
  str = lowered

  var split = str.lastIndexOf('1')
  if (split === -1) throw new Error('No separator character for ' + str)
  if (split === 0) throw new Error('Missing prefix for ' + str)

  var prefix = str.slice(0, split)
  var wordChars = str.slice(split + 1)
  if (wordChars.length < 6) throw new Error('Data too short')

  var chk = prefixChk(prefix)
  var words = []
  for (var i = 0; i < wordChars.length; ++i) {
    var c = wordChars.charAt(i)
    var v = ALPHABET_MAP[c]
    if (v === undefined) throw new Error('Unknown character ' + c)
    chk = polymodStep(chk) ^ v

    // not in the checksum?
    if (i + 6 >= wordChars.length) continue
    words.push(v)
  }

  if (chk !== 1) throw new Error('Invalid checksum for ' + str)
  return { prefix: prefix, words: words }
}

function convert (data, inBits, outBits, pad) {
  var value = 0
  var bits = 0
  var maxV = (1 << outBits) - 1

  var result = []
  for (var i = 0; i < data.length; ++i) {
    value = (value << inBits) | data[i]
    bits += inBits

    while (bits >= outBits) {
      bits -= outBits
      result.push((value >> bits) & maxV)
    }
  }

  if (pad) {
    if (bits > 0) {
      result.push((value << (outBits - bits)) & maxV)
    }
  } else {
    if (bits >= inBits) throw new Error('Excess padding')
    if ((value << (outBits - bits)) & maxV) throw new Error('Non-zero padding')
  }

  return result
}

function toWords (bytes) {
  return convert(bytes, 8, 5, true)
}

function fromWords (words) {
  return convert(words, 5, 8, false)
}

module.exports = {
  decode: decode,
  encode: encode,
  toWords: toWords,
  fromWords: fromWords
}

},{}],37:[function(require,module,exports){
// (public) Constructor
function BigInteger(a, b, c) {
  if (!(this instanceof BigInteger))
    return new BigInteger(a, b, c)

  if (a != null) {
    if ("number" == typeof a) this.fromNumber(a, b, c)
    else if (b == null && "string" != typeof a) this.fromString(a, 256)
    else this.fromString(a, b)
  }
}

var proto = BigInteger.prototype

// duck-typed isBigInteger
proto.__bigi = require('../package.json').version
BigInteger.isBigInteger = function (obj, check_ver) {
  return obj && obj.__bigi && (!check_ver || obj.__bigi === proto.__bigi)
}

// Bits per digit
var dbits

// am: Compute w_j += (x*this_i), propagate carries,
// c is initial carry, returns final carry.
// c < 3*dvalue, x < 2*dvalue, this_i < dvalue
// We need to select the fastest one that works in this environment.

// am1: use a single mult and divide to get the high bits,
// max digit bits should be 26 because
// max internal value = 2*dvalue^2-2*dvalue (< 2^53)
function am1(i, x, w, j, c, n) {
  while (--n >= 0) {
    var v = x * this[i++] + w[j] + c
    c = Math.floor(v / 0x4000000)
    w[j++] = v & 0x3ffffff
  }
  return c
}
// am2 avoids a big mult-and-extract completely.
// Max digit bits should be <= 30 because we do bitwise ops
// on values up to 2*hdvalue^2-hdvalue-1 (< 2^31)
function am2(i, x, w, j, c, n) {
  var xl = x & 0x7fff,
    xh = x >> 15
  while (--n >= 0) {
    var l = this[i] & 0x7fff
    var h = this[i++] >> 15
    var m = xh * l + h * xl
    l = xl * l + ((m & 0x7fff) << 15) + w[j] + (c & 0x3fffffff)
    c = (l >>> 30) + (m >>> 15) + xh * h + (c >>> 30)
    w[j++] = l & 0x3fffffff
  }
  return c
}
// Alternately, set max digit bits to 28 since some
// browsers slow down when dealing with 32-bit numbers.
function am3(i, x, w, j, c, n) {
  var xl = x & 0x3fff,
    xh = x >> 14
  while (--n >= 0) {
    var l = this[i] & 0x3fff
    var h = this[i++] >> 14
    var m = xh * l + h * xl
    l = xl * l + ((m & 0x3fff) << 14) + w[j] + c
    c = (l >> 28) + (m >> 14) + xh * h
    w[j++] = l & 0xfffffff
  }
  return c
}

// wtf?
BigInteger.prototype.am = am1
dbits = 26

BigInteger.prototype.DB = dbits
BigInteger.prototype.DM = ((1 << dbits) - 1)
var DV = BigInteger.prototype.DV = (1 << dbits)

var BI_FP = 52
BigInteger.prototype.FV = Math.pow(2, BI_FP)
BigInteger.prototype.F1 = BI_FP - dbits
BigInteger.prototype.F2 = 2 * dbits - BI_FP

// Digit conversions
var BI_RM = "0123456789abcdefghijklmnopqrstuvwxyz"
var BI_RC = new Array()
var rr, vv
rr = "0".charCodeAt(0)
for (vv = 0; vv <= 9; ++vv) BI_RC[rr++] = vv
rr = "a".charCodeAt(0)
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv
rr = "A".charCodeAt(0)
for (vv = 10; vv < 36; ++vv) BI_RC[rr++] = vv

function int2char(n) {
  return BI_RM.charAt(n)
}

function intAt(s, i) {
  var c = BI_RC[s.charCodeAt(i)]
  return (c == null) ? -1 : c
}

// (protected) copy this to r
function bnpCopyTo(r) {
  for (var i = this.t - 1; i >= 0; --i) r[i] = this[i]
  r.t = this.t
  r.s = this.s
}

// (protected) set from integer value x, -DV <= x < DV
function bnpFromInt(x) {
  this.t = 1
  this.s = (x < 0) ? -1 : 0
  if (x > 0) this[0] = x
  else if (x < -1) this[0] = x + DV
  else this.t = 0
}

// return bigint initialized to value
function nbv(i) {
  var r = new BigInteger()
  r.fromInt(i)
  return r
}

// (protected) set from string and radix
function bnpFromString(s, b) {
  var self = this

  var k
  if (b == 16) k = 4
  else if (b == 8) k = 3
  else if (b == 256) k = 8; // byte array
  else if (b == 2) k = 1
  else if (b == 32) k = 5
  else if (b == 4) k = 2
  else {
    self.fromRadix(s, b)
    return
  }
  self.t = 0
  self.s = 0
  var i = s.length,
    mi = false,
    sh = 0
  while (--i >= 0) {
    var x = (k == 8) ? s[i] & 0xff : intAt(s, i)
    if (x < 0) {
      if (s.charAt(i) == "-") mi = true
      continue
    }
    mi = false
    if (sh == 0)
      self[self.t++] = x
    else if (sh + k > self.DB) {
      self[self.t - 1] |= (x & ((1 << (self.DB - sh)) - 1)) << sh
      self[self.t++] = (x >> (self.DB - sh))
    } else
      self[self.t - 1] |= x << sh
    sh += k
    if (sh >= self.DB) sh -= self.DB
  }
  if (k == 8 && (s[0] & 0x80) != 0) {
    self.s = -1
    if (sh > 0) self[self.t - 1] |= ((1 << (self.DB - sh)) - 1) << sh
  }
  self.clamp()
  if (mi) BigInteger.ZERO.subTo(self, self)
}

// (protected) clamp off excess high words
function bnpClamp() {
  var c = this.s & this.DM
  while (this.t > 0 && this[this.t - 1] == c)--this.t
}

// (public) return string representation in given radix
function bnToString(b) {
  var self = this
  if (self.s < 0) return "-" + self.negate()
    .toString(b)
  var k
  if (b == 16) k = 4
  else if (b == 8) k = 3
  else if (b == 2) k = 1
  else if (b == 32) k = 5
  else if (b == 4) k = 2
  else return self.toRadix(b)
  var km = (1 << k) - 1,
    d, m = false,
    r = "",
    i = self.t
  var p = self.DB - (i * self.DB) % k
  if (i-- > 0) {
    if (p < self.DB && (d = self[i] >> p) > 0) {
      m = true
      r = int2char(d)
    }
    while (i >= 0) {
      if (p < k) {
        d = (self[i] & ((1 << p) - 1)) << (k - p)
        d |= self[--i] >> (p += self.DB - k)
      } else {
        d = (self[i] >> (p -= k)) & km
        if (p <= 0) {
          p += self.DB
          --i
        }
      }
      if (d > 0) m = true
      if (m) r += int2char(d)
    }
  }
  return m ? r : "0"
}

// (public) -this
function bnNegate() {
  var r = new BigInteger()
  BigInteger.ZERO.subTo(this, r)
  return r
}

// (public) |this|
function bnAbs() {
  return (this.s < 0) ? this.negate() : this
}

// (public) return + if this > a, - if this < a, 0 if equal
function bnCompareTo(a) {
  var r = this.s - a.s
  if (r != 0) return r
  var i = this.t
  r = i - a.t
  if (r != 0) return (this.s < 0) ? -r : r
  while (--i >= 0)
    if ((r = this[i] - a[i]) != 0) return r
  return 0
}

// returns bit length of the integer x
function nbits(x) {
  var r = 1,
    t
  if ((t = x >>> 16) != 0) {
    x = t
    r += 16
  }
  if ((t = x >> 8) != 0) {
    x = t
    r += 8
  }
  if ((t = x >> 4) != 0) {
    x = t
    r += 4
  }
  if ((t = x >> 2) != 0) {
    x = t
    r += 2
  }
  if ((t = x >> 1) != 0) {
    x = t
    r += 1
  }
  return r
}

// (public) return the number of bits in "this"
function bnBitLength() {
  if (this.t <= 0) return 0
  return this.DB * (this.t - 1) + nbits(this[this.t - 1] ^ (this.s & this.DM))
}

// (public) return the number of bytes in "this"
function bnByteLength() {
  return this.bitLength() >> 3
}

// (protected) r = this << n*DB
function bnpDLShiftTo(n, r) {
  var i
  for (i = this.t - 1; i >= 0; --i) r[i + n] = this[i]
  for (i = n - 1; i >= 0; --i) r[i] = 0
  r.t = this.t + n
  r.s = this.s
}

// (protected) r = this >> n*DB
function bnpDRShiftTo(n, r) {
  for (var i = n; i < this.t; ++i) r[i - n] = this[i]
  r.t = Math.max(this.t - n, 0)
  r.s = this.s
}

// (protected) r = this << n
function bnpLShiftTo(n, r) {
  var self = this
  var bs = n % self.DB
  var cbs = self.DB - bs
  var bm = (1 << cbs) - 1
  var ds = Math.floor(n / self.DB),
    c = (self.s << bs) & self.DM,
    i
  for (i = self.t - 1; i >= 0; --i) {
    r[i + ds + 1] = (self[i] >> cbs) | c
    c = (self[i] & bm) << bs
  }
  for (i = ds - 1; i >= 0; --i) r[i] = 0
  r[ds] = c
  r.t = self.t + ds + 1
  r.s = self.s
  r.clamp()
}

// (protected) r = this >> n
function bnpRShiftTo(n, r) {
  var self = this
  r.s = self.s
  var ds = Math.floor(n / self.DB)
  if (ds >= self.t) {
    r.t = 0
    return
  }
  var bs = n % self.DB
  var cbs = self.DB - bs
  var bm = (1 << bs) - 1
  r[0] = self[ds] >> bs
  for (var i = ds + 1; i < self.t; ++i) {
    r[i - ds - 1] |= (self[i] & bm) << cbs
    r[i - ds] = self[i] >> bs
  }
  if (bs > 0) r[self.t - ds - 1] |= (self.s & bm) << cbs
  r.t = self.t - ds
  r.clamp()
}

// (protected) r = this - a
function bnpSubTo(a, r) {
  var self = this
  var i = 0,
    c = 0,
    m = Math.min(a.t, self.t)
  while (i < m) {
    c += self[i] - a[i]
    r[i++] = c & self.DM
    c >>= self.DB
  }
  if (a.t < self.t) {
    c -= a.s
    while (i < self.t) {
      c += self[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += self.s
  } else {
    c += self.s
    while (i < a.t) {
      c -= a[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c -= a.s
  }
  r.s = (c < 0) ? -1 : 0
  if (c < -1) r[i++] = self.DV + c
  else if (c > 0) r[i++] = c
  r.t = i
  r.clamp()
}

// (protected) r = this * a, r != this,a (HAC 14.12)
// "this" should be the larger one if appropriate.
function bnpMultiplyTo(a, r) {
  var x = this.abs(),
    y = a.abs()
  var i = x.t
  r.t = i + y.t
  while (--i >= 0) r[i] = 0
  for (i = 0; i < y.t; ++i) r[i + x.t] = x.am(0, y[i], r, i, 0, x.t)
  r.s = 0
  r.clamp()
  if (this.s != a.s) BigInteger.ZERO.subTo(r, r)
}

// (protected) r = this^2, r != this (HAC 14.16)
function bnpSquareTo(r) {
  var x = this.abs()
  var i = r.t = 2 * x.t
  while (--i >= 0) r[i] = 0
  for (i = 0; i < x.t - 1; ++i) {
    var c = x.am(i, x[i], r, 2 * i, 0, 1)
    if ((r[i + x.t] += x.am(i + 1, 2 * x[i], r, 2 * i + 1, c, x.t - i - 1)) >= x.DV) {
      r[i + x.t] -= x.DV
      r[i + x.t + 1] = 1
    }
  }
  if (r.t > 0) r[r.t - 1] += x.am(i, x[i], r, 2 * i, 0, 1)
  r.s = 0
  r.clamp()
}

// (protected) divide this by m, quotient and remainder to q, r (HAC 14.20)
// r != q, this != m.  q or r may be null.
function bnpDivRemTo(m, q, r) {
  var self = this
  var pm = m.abs()
  if (pm.t <= 0) return
  var pt = self.abs()
  if (pt.t < pm.t) {
    if (q != null) q.fromInt(0)
    if (r != null) self.copyTo(r)
    return
  }
  if (r == null) r = new BigInteger()
  var y = new BigInteger(),
    ts = self.s,
    ms = m.s
  var nsh = self.DB - nbits(pm[pm.t - 1]); // normalize modulus
  if (nsh > 0) {
    pm.lShiftTo(nsh, y)
    pt.lShiftTo(nsh, r)
  } else {
    pm.copyTo(y)
    pt.copyTo(r)
  }
  var ys = y.t
  var y0 = y[ys - 1]
  if (y0 == 0) return
  var yt = y0 * (1 << self.F1) + ((ys > 1) ? y[ys - 2] >> self.F2 : 0)
  var d1 = self.FV / yt,
    d2 = (1 << self.F1) / yt,
    e = 1 << self.F2
  var i = r.t,
    j = i - ys,
    t = (q == null) ? new BigInteger() : q
  y.dlShiftTo(j, t)
  if (r.compareTo(t) >= 0) {
    r[r.t++] = 1
    r.subTo(t, r)
  }
  BigInteger.ONE.dlShiftTo(ys, t)
  t.subTo(y, y); // "negative" y so we can replace sub with am later
  while (y.t < ys) y[y.t++] = 0
  while (--j >= 0) {
    // Estimate quotient digit
    var qd = (r[--i] == y0) ? self.DM : Math.floor(r[i] * d1 + (r[i - 1] + e) * d2)
    if ((r[i] += y.am(0, qd, r, j, 0, ys)) < qd) { // Try it out
      y.dlShiftTo(j, t)
      r.subTo(t, r)
      while (r[i] < --qd) r.subTo(t, r)
    }
  }
  if (q != null) {
    r.drShiftTo(ys, q)
    if (ts != ms) BigInteger.ZERO.subTo(q, q)
  }
  r.t = ys
  r.clamp()
  if (nsh > 0) r.rShiftTo(nsh, r); // Denormalize remainder
  if (ts < 0) BigInteger.ZERO.subTo(r, r)
}

// (public) this mod a
function bnMod(a) {
  var r = new BigInteger()
  this.abs()
    .divRemTo(a, null, r)
  if (this.s < 0 && r.compareTo(BigInteger.ZERO) > 0) a.subTo(r, r)
  return r
}

// Modular reduction using "classic" algorithm
function Classic(m) {
  this.m = m
}

function cConvert(x) {
  if (x.s < 0 || x.compareTo(this.m) >= 0) return x.mod(this.m)
  else return x
}

function cRevert(x) {
  return x
}

function cReduce(x) {
  x.divRemTo(this.m, null, x)
}

function cMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

function cSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

Classic.prototype.convert = cConvert
Classic.prototype.revert = cRevert
Classic.prototype.reduce = cReduce
Classic.prototype.mulTo = cMulTo
Classic.prototype.sqrTo = cSqrTo

// (protected) return "-1/this % 2^DB"; useful for Mont. reduction
// justification:
//         xy == 1 (mod m)
//         xy =  1+km
//   xy(2-xy) = (1+km)(1-km)
// x[y(2-xy)] = 1-k^2m^2
// x[y(2-xy)] == 1 (mod m^2)
// if y is 1/x mod m, then y(2-xy) is 1/x mod m^2
// should reduce x and y(2-xy) by m^2 at each step to keep size bounded.
// JS multiply "overflows" differently from C/C++, so care is needed here.
function bnpInvDigit() {
  if (this.t < 1) return 0
  var x = this[0]
  if ((x & 1) == 0) return 0
  var y = x & 3; // y == 1/x mod 2^2
  y = (y * (2 - (x & 0xf) * y)) & 0xf; // y == 1/x mod 2^4
  y = (y * (2 - (x & 0xff) * y)) & 0xff; // y == 1/x mod 2^8
  y = (y * (2 - (((x & 0xffff) * y) & 0xffff))) & 0xffff; // y == 1/x mod 2^16
  // last step - calculate inverse mod DV directly
  // assumes 16 < DB <= 32 and assumes ability to handle 48-bit ints
  y = (y * (2 - x * y % this.DV)) % this.DV; // y == 1/x mod 2^dbits
  // we really want the negative inverse, and -DV < y < DV
  return (y > 0) ? this.DV - y : -y
}

// Montgomery reduction
function Montgomery(m) {
  this.m = m
  this.mp = m.invDigit()
  this.mpl = this.mp & 0x7fff
  this.mph = this.mp >> 15
  this.um = (1 << (m.DB - 15)) - 1
  this.mt2 = 2 * m.t
}

// xR mod m
function montConvert(x) {
  var r = new BigInteger()
  x.abs()
    .dlShiftTo(this.m.t, r)
  r.divRemTo(this.m, null, r)
  if (x.s < 0 && r.compareTo(BigInteger.ZERO) > 0) this.m.subTo(r, r)
  return r
}

// x/R mod m
function montRevert(x) {
  var r = new BigInteger()
  x.copyTo(r)
  this.reduce(r)
  return r
}

// x = x/R mod m (HAC 14.32)
function montReduce(x) {
  while (x.t <= this.mt2) // pad x so am has enough room later
    x[x.t++] = 0
  for (var i = 0; i < this.m.t; ++i) {
    // faster way of calculating u0 = x[i]*mp mod DV
    var j = x[i] & 0x7fff
    var u0 = (j * this.mpl + (((j * this.mph + (x[i] >> 15) * this.mpl) & this.um) << 15)) & x.DM
    // use am to combine the multiply-shift-add into one call
    j = i + this.m.t
    x[j] += this.m.am(0, u0, x, i, 0, this.m.t)
    // propagate carry
    while (x[j] >= x.DV) {
      x[j] -= x.DV
      x[++j]++
    }
  }
  x.clamp()
  x.drShiftTo(this.m.t, x)
  if (x.compareTo(this.m) >= 0) x.subTo(this.m, x)
}

// r = "x^2/R mod m"; x != r
function montSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

// r = "xy/R mod m"; x,y != r
function montMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

Montgomery.prototype.convert = montConvert
Montgomery.prototype.revert = montRevert
Montgomery.prototype.reduce = montReduce
Montgomery.prototype.mulTo = montMulTo
Montgomery.prototype.sqrTo = montSqrTo

// (protected) true iff this is even
function bnpIsEven() {
  return ((this.t > 0) ? (this[0] & 1) : this.s) == 0
}

// (protected) this^e, e < 2^32, doing sqr and mul with "r" (HAC 14.79)
function bnpExp(e, z) {
  if (e > 0xffffffff || e < 1) return BigInteger.ONE
  var r = new BigInteger(),
    r2 = new BigInteger(),
    g = z.convert(this),
    i = nbits(e) - 1
  g.copyTo(r)
  while (--i >= 0) {
    z.sqrTo(r, r2)
    if ((e & (1 << i)) > 0) z.mulTo(r2, g, r)
    else {
      var t = r
      r = r2
      r2 = t
    }
  }
  return z.revert(r)
}

// (public) this^e % m, 0 <= e < 2^32
function bnModPowInt(e, m) {
  var z
  if (e < 256 || m.isEven()) z = new Classic(m)
  else z = new Montgomery(m)
  return this.exp(e, z)
}

// protected
proto.copyTo = bnpCopyTo
proto.fromInt = bnpFromInt
proto.fromString = bnpFromString
proto.clamp = bnpClamp
proto.dlShiftTo = bnpDLShiftTo
proto.drShiftTo = bnpDRShiftTo
proto.lShiftTo = bnpLShiftTo
proto.rShiftTo = bnpRShiftTo
proto.subTo = bnpSubTo
proto.multiplyTo = bnpMultiplyTo
proto.squareTo = bnpSquareTo
proto.divRemTo = bnpDivRemTo
proto.invDigit = bnpInvDigit
proto.isEven = bnpIsEven
proto.exp = bnpExp

// public
proto.toString = bnToString
proto.negate = bnNegate
proto.abs = bnAbs
proto.compareTo = bnCompareTo
proto.bitLength = bnBitLength
proto.byteLength = bnByteLength
proto.mod = bnMod
proto.modPowInt = bnModPowInt

// (public)
function bnClone() {
  var r = new BigInteger()
  this.copyTo(r)
  return r
}

// (public) return value as integer
function bnIntValue() {
  if (this.s < 0) {
    if (this.t == 1) return this[0] - this.DV
    else if (this.t == 0) return -1
  } else if (this.t == 1) return this[0]
  else if (this.t == 0) return 0
  // assumes 16 < DB < 32
  return ((this[1] & ((1 << (32 - this.DB)) - 1)) << this.DB) | this[0]
}

// (public) return value as byte
function bnByteValue() {
  return (this.t == 0) ? this.s : (this[0] << 24) >> 24
}

// (public) return value as short (assumes DB>=16)
function bnShortValue() {
  return (this.t == 0) ? this.s : (this[0] << 16) >> 16
}

// (protected) return x s.t. r^x < DV
function bnpChunkSize(r) {
  return Math.floor(Math.LN2 * this.DB / Math.log(r))
}

// (public) 0 if this == 0, 1 if this > 0
function bnSigNum() {
  if (this.s < 0) return -1
  else if (this.t <= 0 || (this.t == 1 && this[0] <= 0)) return 0
  else return 1
}

// (protected) convert to radix string
function bnpToRadix(b) {
  if (b == null) b = 10
  if (this.signum() == 0 || b < 2 || b > 36) return "0"
  var cs = this.chunkSize(b)
  var a = Math.pow(b, cs)
  var d = nbv(a),
    y = new BigInteger(),
    z = new BigInteger(),
    r = ""
  this.divRemTo(d, y, z)
  while (y.signum() > 0) {
    r = (a + z.intValue())
      .toString(b)
      .substr(1) + r
    y.divRemTo(d, y, z)
  }
  return z.intValue()
    .toString(b) + r
}

// (protected) convert from radix string
function bnpFromRadix(s, b) {
  var self = this
  self.fromInt(0)
  if (b == null) b = 10
  var cs = self.chunkSize(b)
  var d = Math.pow(b, cs),
    mi = false,
    j = 0,
    w = 0
  for (var i = 0; i < s.length; ++i) {
    var x = intAt(s, i)
    if (x < 0) {
      if (s.charAt(i) == "-" && self.signum() == 0) mi = true
      continue
    }
    w = b * w + x
    if (++j >= cs) {
      self.dMultiply(d)
      self.dAddOffset(w, 0)
      j = 0
      w = 0
    }
  }
  if (j > 0) {
    self.dMultiply(Math.pow(b, j))
    self.dAddOffset(w, 0)
  }
  if (mi) BigInteger.ZERO.subTo(self, self)
}

// (protected) alternate constructor
function bnpFromNumber(a, b, c) {
  var self = this
  if ("number" == typeof b) {
    // new BigInteger(int,int,RNG)
    if (a < 2) self.fromInt(1)
    else {
      self.fromNumber(a, c)
      if (!self.testBit(a - 1)) // force MSB set
        self.bitwiseTo(BigInteger.ONE.shiftLeft(a - 1), op_or, self)
      if (self.isEven()) self.dAddOffset(1, 0); // force odd
      while (!self.isProbablePrime(b)) {
        self.dAddOffset(2, 0)
        if (self.bitLength() > a) self.subTo(BigInteger.ONE.shiftLeft(a - 1), self)
      }
    }
  } else {
    // new BigInteger(int,RNG)
    var x = new Array(),
      t = a & 7
    x.length = (a >> 3) + 1
    b.nextBytes(x)
    if (t > 0) x[0] &= ((1 << t) - 1)
    else x[0] = 0
    self.fromString(x, 256)
  }
}

// (public) convert to bigendian byte array
function bnToByteArray() {
  var self = this
  var i = self.t,
    r = new Array()
  r[0] = self.s
  var p = self.DB - (i * self.DB) % 8,
    d, k = 0
  if (i-- > 0) {
    if (p < self.DB && (d = self[i] >> p) != (self.s & self.DM) >> p)
      r[k++] = d | (self.s << (self.DB - p))
    while (i >= 0) {
      if (p < 8) {
        d = (self[i] & ((1 << p) - 1)) << (8 - p)
        d |= self[--i] >> (p += self.DB - 8)
      } else {
        d = (self[i] >> (p -= 8)) & 0xff
        if (p <= 0) {
          p += self.DB
          --i
        }
      }
      if ((d & 0x80) != 0) d |= -256
      if (k === 0 && (self.s & 0x80) != (d & 0x80))++k
      if (k > 0 || d != self.s) r[k++] = d
    }
  }
  return r
}

function bnEquals(a) {
  return (this.compareTo(a) == 0)
}

function bnMin(a) {
  return (this.compareTo(a) < 0) ? this : a
}

function bnMax(a) {
  return (this.compareTo(a) > 0) ? this : a
}

// (protected) r = this op a (bitwise)
function bnpBitwiseTo(a, op, r) {
  var self = this
  var i, f, m = Math.min(a.t, self.t)
  for (i = 0; i < m; ++i) r[i] = op(self[i], a[i])
  if (a.t < self.t) {
    f = a.s & self.DM
    for (i = m; i < self.t; ++i) r[i] = op(self[i], f)
    r.t = self.t
  } else {
    f = self.s & self.DM
    for (i = m; i < a.t; ++i) r[i] = op(f, a[i])
    r.t = a.t
  }
  r.s = op(self.s, a.s)
  r.clamp()
}

// (public) this & a
function op_and(x, y) {
  return x & y
}

function bnAnd(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_and, r)
  return r
}

// (public) this | a
function op_or(x, y) {
  return x | y
}

function bnOr(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_or, r)
  return r
}

// (public) this ^ a
function op_xor(x, y) {
  return x ^ y
}

function bnXor(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_xor, r)
  return r
}

// (public) this & ~a
function op_andnot(x, y) {
  return x & ~y
}

function bnAndNot(a) {
  var r = new BigInteger()
  this.bitwiseTo(a, op_andnot, r)
  return r
}

// (public) ~this
function bnNot() {
  var r = new BigInteger()
  for (var i = 0; i < this.t; ++i) r[i] = this.DM & ~this[i]
  r.t = this.t
  r.s = ~this.s
  return r
}

// (public) this << n
function bnShiftLeft(n) {
  var r = new BigInteger()
  if (n < 0) this.rShiftTo(-n, r)
  else this.lShiftTo(n, r)
  return r
}

// (public) this >> n
function bnShiftRight(n) {
  var r = new BigInteger()
  if (n < 0) this.lShiftTo(-n, r)
  else this.rShiftTo(n, r)
  return r
}

// return index of lowest 1-bit in x, x < 2^31
function lbit(x) {
  if (x == 0) return -1
  var r = 0
  if ((x & 0xffff) == 0) {
    x >>= 16
    r += 16
  }
  if ((x & 0xff) == 0) {
    x >>= 8
    r += 8
  }
  if ((x & 0xf) == 0) {
    x >>= 4
    r += 4
  }
  if ((x & 3) == 0) {
    x >>= 2
    r += 2
  }
  if ((x & 1) == 0)++r
  return r
}

// (public) returns index of lowest 1-bit (or -1 if none)
function bnGetLowestSetBit() {
  for (var i = 0; i < this.t; ++i)
    if (this[i] != 0) return i * this.DB + lbit(this[i])
  if (this.s < 0) return this.t * this.DB
  return -1
}

// return number of 1 bits in x
function cbit(x) {
  var r = 0
  while (x != 0) {
    x &= x - 1
    ++r
  }
  return r
}

// (public) return number of set bits
function bnBitCount() {
  var r = 0,
    x = this.s & this.DM
  for (var i = 0; i < this.t; ++i) r += cbit(this[i] ^ x)
  return r
}

// (public) true iff nth bit is set
function bnTestBit(n) {
  var j = Math.floor(n / this.DB)
  if (j >= this.t) return (this.s != 0)
  return ((this[j] & (1 << (n % this.DB))) != 0)
}

// (protected) this op (1<<n)
function bnpChangeBit(n, op) {
  var r = BigInteger.ONE.shiftLeft(n)
  this.bitwiseTo(r, op, r)
  return r
}

// (public) this | (1<<n)
function bnSetBit(n) {
  return this.changeBit(n, op_or)
}

// (public) this & ~(1<<n)
function bnClearBit(n) {
  return this.changeBit(n, op_andnot)
}

// (public) this ^ (1<<n)
function bnFlipBit(n) {
  return this.changeBit(n, op_xor)
}

// (protected) r = this + a
function bnpAddTo(a, r) {
  var self = this

  var i = 0,
    c = 0,
    m = Math.min(a.t, self.t)
  while (i < m) {
    c += self[i] + a[i]
    r[i++] = c & self.DM
    c >>= self.DB
  }
  if (a.t < self.t) {
    c += a.s
    while (i < self.t) {
      c += self[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += self.s
  } else {
    c += self.s
    while (i < a.t) {
      c += a[i]
      r[i++] = c & self.DM
      c >>= self.DB
    }
    c += a.s
  }
  r.s = (c < 0) ? -1 : 0
  if (c > 0) r[i++] = c
  else if (c < -1) r[i++] = self.DV + c
  r.t = i
  r.clamp()
}

// (public) this + a
function bnAdd(a) {
  var r = new BigInteger()
  this.addTo(a, r)
  return r
}

// (public) this - a
function bnSubtract(a) {
  var r = new BigInteger()
  this.subTo(a, r)
  return r
}

// (public) this * a
function bnMultiply(a) {
  var r = new BigInteger()
  this.multiplyTo(a, r)
  return r
}

// (public) this^2
function bnSquare() {
  var r = new BigInteger()
  this.squareTo(r)
  return r
}

// (public) this / a
function bnDivide(a) {
  var r = new BigInteger()
  this.divRemTo(a, r, null)
  return r
}

// (public) this % a
function bnRemainder(a) {
  var r = new BigInteger()
  this.divRemTo(a, null, r)
  return r
}

// (public) [this/a,this%a]
function bnDivideAndRemainder(a) {
  var q = new BigInteger(),
    r = new BigInteger()
  this.divRemTo(a, q, r)
  return new Array(q, r)
}

// (protected) this *= n, this >= 0, 1 < n < DV
function bnpDMultiply(n) {
  this[this.t] = this.am(0, n - 1, this, 0, 0, this.t)
  ++this.t
  this.clamp()
}

// (protected) this += n << w words, this >= 0
function bnpDAddOffset(n, w) {
  if (n == 0) return
  while (this.t <= w) this[this.t++] = 0
  this[w] += n
  while (this[w] >= this.DV) {
    this[w] -= this.DV
    if (++w >= this.t) this[this.t++] = 0
    ++this[w]
  }
}

// A "null" reducer
function NullExp() {}

function nNop(x) {
  return x
}

function nMulTo(x, y, r) {
  x.multiplyTo(y, r)
}

function nSqrTo(x, r) {
  x.squareTo(r)
}

NullExp.prototype.convert = nNop
NullExp.prototype.revert = nNop
NullExp.prototype.mulTo = nMulTo
NullExp.prototype.sqrTo = nSqrTo

// (public) this^e
function bnPow(e) {
  return this.exp(e, new NullExp())
}

// (protected) r = lower n words of "this * a", a.t <= n
// "this" should be the larger one if appropriate.
function bnpMultiplyLowerTo(a, n, r) {
  var i = Math.min(this.t + a.t, n)
  r.s = 0; // assumes a,this >= 0
  r.t = i
  while (i > 0) r[--i] = 0
  var j
  for (j = r.t - this.t; i < j; ++i) r[i + this.t] = this.am(0, a[i], r, i, 0, this.t)
  for (j = Math.min(a.t, n); i < j; ++i) this.am(0, a[i], r, i, 0, n - i)
  r.clamp()
}

// (protected) r = "this * a" without lower n words, n > 0
// "this" should be the larger one if appropriate.
function bnpMultiplyUpperTo(a, n, r) {
  --n
  var i = r.t = this.t + a.t - n
  r.s = 0; // assumes a,this >= 0
  while (--i >= 0) r[i] = 0
  for (i = Math.max(n - this.t, 0); i < a.t; ++i)
    r[this.t + i - n] = this.am(n - i, a[i], r, 0, 0, this.t + i - n)
  r.clamp()
  r.drShiftTo(1, r)
}

// Barrett modular reduction
function Barrett(m) {
  // setup Barrett
  this.r2 = new BigInteger()
  this.q3 = new BigInteger()
  BigInteger.ONE.dlShiftTo(2 * m.t, this.r2)
  this.mu = this.r2.divide(m)
  this.m = m
}

function barrettConvert(x) {
  if (x.s < 0 || x.t > 2 * this.m.t) return x.mod(this.m)
  else if (x.compareTo(this.m) < 0) return x
  else {
    var r = new BigInteger()
    x.copyTo(r)
    this.reduce(r)
    return r
  }
}

function barrettRevert(x) {
  return x
}

// x = x mod m (HAC 14.42)
function barrettReduce(x) {
  var self = this
  x.drShiftTo(self.m.t - 1, self.r2)
  if (x.t > self.m.t + 1) {
    x.t = self.m.t + 1
    x.clamp()
  }
  self.mu.multiplyUpperTo(self.r2, self.m.t + 1, self.q3)
  self.m.multiplyLowerTo(self.q3, self.m.t + 1, self.r2)
  while (x.compareTo(self.r2) < 0) x.dAddOffset(1, self.m.t + 1)
  x.subTo(self.r2, x)
  while (x.compareTo(self.m) >= 0) x.subTo(self.m, x)
}

// r = x^2 mod m; x != r
function barrettSqrTo(x, r) {
  x.squareTo(r)
  this.reduce(r)
}

// r = x*y mod m; x,y != r
function barrettMulTo(x, y, r) {
  x.multiplyTo(y, r)
  this.reduce(r)
}

Barrett.prototype.convert = barrettConvert
Barrett.prototype.revert = barrettRevert
Barrett.prototype.reduce = barrettReduce
Barrett.prototype.mulTo = barrettMulTo
Barrett.prototype.sqrTo = barrettSqrTo

// (public) this^e % m (HAC 14.85)
function bnModPow(e, m) {
  var i = e.bitLength(),
    k, r = nbv(1),
    z
  if (i <= 0) return r
  else if (i < 18) k = 1
  else if (i < 48) k = 3
  else if (i < 144) k = 4
  else if (i < 768) k = 5
  else k = 6
  if (i < 8)
    z = new Classic(m)
  else if (m.isEven())
    z = new Barrett(m)
  else
    z = new Montgomery(m)

  // precomputation
  var g = new Array(),
    n = 3,
    k1 = k - 1,
    km = (1 << k) - 1
  g[1] = z.convert(this)
  if (k > 1) {
    var g2 = new BigInteger()
    z.sqrTo(g[1], g2)
    while (n <= km) {
      g[n] = new BigInteger()
      z.mulTo(g2, g[n - 2], g[n])
      n += 2
    }
  }

  var j = e.t - 1,
    w, is1 = true,
    r2 = new BigInteger(),
    t
  i = nbits(e[j]) - 1
  while (j >= 0) {
    if (i >= k1) w = (e[j] >> (i - k1)) & km
    else {
      w = (e[j] & ((1 << (i + 1)) - 1)) << (k1 - i)
      if (j > 0) w |= e[j - 1] >> (this.DB + i - k1)
    }

    n = k
    while ((w & 1) == 0) {
      w >>= 1
      --n
    }
    if ((i -= n) < 0) {
      i += this.DB
      --j
    }
    if (is1) { // ret == 1, don't bother squaring or multiplying it
      g[w].copyTo(r)
      is1 = false
    } else {
      while (n > 1) {
        z.sqrTo(r, r2)
        z.sqrTo(r2, r)
        n -= 2
      }
      if (n > 0) z.sqrTo(r, r2)
      else {
        t = r
        r = r2
        r2 = t
      }
      z.mulTo(r2, g[w], r)
    }

    while (j >= 0 && (e[j] & (1 << i)) == 0) {
      z.sqrTo(r, r2)
      t = r
      r = r2
      r2 = t
      if (--i < 0) {
        i = this.DB - 1
        --j
      }
    }
  }
  return z.revert(r)
}

// (public) gcd(this,a) (HAC 14.54)
function bnGCD(a) {
  var x = (this.s < 0) ? this.negate() : this.clone()
  var y = (a.s < 0) ? a.negate() : a.clone()
  if (x.compareTo(y) < 0) {
    var t = x
    x = y
    y = t
  }
  var i = x.getLowestSetBit(),
    g = y.getLowestSetBit()
  if (g < 0) return x
  if (i < g) g = i
  if (g > 0) {
    x.rShiftTo(g, x)
    y.rShiftTo(g, y)
  }
  while (x.signum() > 0) {
    if ((i = x.getLowestSetBit()) > 0) x.rShiftTo(i, x)
    if ((i = y.getLowestSetBit()) > 0) y.rShiftTo(i, y)
    if (x.compareTo(y) >= 0) {
      x.subTo(y, x)
      x.rShiftTo(1, x)
    } else {
      y.subTo(x, y)
      y.rShiftTo(1, y)
    }
  }
  if (g > 0) y.lShiftTo(g, y)
  return y
}

// (protected) this % n, n < 2^26
function bnpModInt(n) {
  if (n <= 0) return 0
  var d = this.DV % n,
    r = (this.s < 0) ? n - 1 : 0
  if (this.t > 0)
    if (d == 0) r = this[0] % n
    else
      for (var i = this.t - 1; i >= 0; --i) r = (d * r + this[i]) % n
  return r
}

// (public) 1/this % m (HAC 14.61)
function bnModInverse(m) {
  var ac = m.isEven()
  if (this.signum() === 0) throw new Error('division by zero')
  if ((this.isEven() && ac) || m.signum() == 0) return BigInteger.ZERO
  var u = m.clone(),
    v = this.clone()
  var a = nbv(1),
    b = nbv(0),
    c = nbv(0),
    d = nbv(1)
  while (u.signum() != 0) {
    while (u.isEven()) {
      u.rShiftTo(1, u)
      if (ac) {
        if (!a.isEven() || !b.isEven()) {
          a.addTo(this, a)
          b.subTo(m, b)
        }
        a.rShiftTo(1, a)
      } else if (!b.isEven()) b.subTo(m, b)
      b.rShiftTo(1, b)
    }
    while (v.isEven()) {
      v.rShiftTo(1, v)
      if (ac) {
        if (!c.isEven() || !d.isEven()) {
          c.addTo(this, c)
          d.subTo(m, d)
        }
        c.rShiftTo(1, c)
      } else if (!d.isEven()) d.subTo(m, d)
      d.rShiftTo(1, d)
    }
    if (u.compareTo(v) >= 0) {
      u.subTo(v, u)
      if (ac) a.subTo(c, a)
      b.subTo(d, b)
    } else {
      v.subTo(u, v)
      if (ac) c.subTo(a, c)
      d.subTo(b, d)
    }
  }
  if (v.compareTo(BigInteger.ONE) != 0) return BigInteger.ZERO
  while (d.compareTo(m) >= 0) d.subTo(m, d)
  while (d.signum() < 0) d.addTo(m, d)
  return d
}

var lowprimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
  613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
  709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811,
  821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
  919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
]

var lplim = (1 << 26) / lowprimes[lowprimes.length - 1]

// (public) test primality with certainty >= 1-.5^t
function bnIsProbablePrime(t) {
  var i, x = this.abs()
  if (x.t == 1 && x[0] <= lowprimes[lowprimes.length - 1]) {
    for (i = 0; i < lowprimes.length; ++i)
      if (x[0] == lowprimes[i]) return true
    return false
  }
  if (x.isEven()) return false
  i = 1
  while (i < lowprimes.length) {
    var m = lowprimes[i],
      j = i + 1
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++]
    m = x.modInt(m)
    while (i < j) if (m % lowprimes[i++] == 0) return false
  }
  return x.millerRabin(t)
}

// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function bnpMillerRabin(t) {
  var n1 = this.subtract(BigInteger.ONE)
  var k = n1.getLowestSetBit()
  if (k <= 0) return false
  var r = n1.shiftRight(k)
  t = (t + 1) >> 1
  if (t > lowprimes.length) t = lowprimes.length
  var a = new BigInteger(null)
  var j, bases = []
  for (var i = 0; i < t; ++i) {
    for (;;) {
      j = lowprimes[Math.floor(Math.random() * lowprimes.length)]
      if (bases.indexOf(j) == -1) break
    }
    bases.push(j)
    a.fromInt(j)
    var y = a.modPow(r, this)
    if (y.compareTo(BigInteger.ONE) != 0 && y.compareTo(n1) != 0) {
      var j = 1
      while (j++ < k && y.compareTo(n1) != 0) {
        y = y.modPowInt(2, this)
        if (y.compareTo(BigInteger.ONE) == 0) return false
      }
      if (y.compareTo(n1) != 0) return false
    }
  }
  return true
}

// protected
proto.chunkSize = bnpChunkSize
proto.toRadix = bnpToRadix
proto.fromRadix = bnpFromRadix
proto.fromNumber = bnpFromNumber
proto.bitwiseTo = bnpBitwiseTo
proto.changeBit = bnpChangeBit
proto.addTo = bnpAddTo
proto.dMultiply = bnpDMultiply
proto.dAddOffset = bnpDAddOffset
proto.multiplyLowerTo = bnpMultiplyLowerTo
proto.multiplyUpperTo = bnpMultiplyUpperTo
proto.modInt = bnpModInt
proto.millerRabin = bnpMillerRabin

// public
proto.clone = bnClone
proto.intValue = bnIntValue
proto.byteValue = bnByteValue
proto.shortValue = bnShortValue
proto.signum = bnSigNum
proto.toByteArray = bnToByteArray
proto.equals = bnEquals
proto.min = bnMin
proto.max = bnMax
proto.and = bnAnd
proto.or = bnOr
proto.xor = bnXor
proto.andNot = bnAndNot
proto.not = bnNot
proto.shiftLeft = bnShiftLeft
proto.shiftRight = bnShiftRight
proto.getLowestSetBit = bnGetLowestSetBit
proto.bitCount = bnBitCount
proto.testBit = bnTestBit
proto.setBit = bnSetBit
proto.clearBit = bnClearBit
proto.flipBit = bnFlipBit
proto.add = bnAdd
proto.subtract = bnSubtract
proto.multiply = bnMultiply
proto.divide = bnDivide
proto.remainder = bnRemainder
proto.divideAndRemainder = bnDivideAndRemainder
proto.modPow = bnModPow
proto.modInverse = bnModInverse
proto.pow = bnPow
proto.gcd = bnGCD
proto.isProbablePrime = bnIsProbablePrime

// JSBN-specific extension
proto.square = bnSquare

// constants
BigInteger.ZERO = nbv(0)
BigInteger.ONE = nbv(1)
BigInteger.valueOf = nbv

module.exports = BigInteger

},{"../package.json":40}],38:[function(require,module,exports){
(function (Buffer){
// FIXME: Kind of a weird way to throw exceptions, consider removing
var assert = require('assert')
var BigInteger = require('./bigi')

/**
 * Turns a byte array into a big integer.
 *
 * This function will interpret a byte array as a big integer in big
 * endian notation.
 */
BigInteger.fromByteArrayUnsigned = function(byteArray) {
  // BigInteger expects a DER integer conformant byte array
  if (byteArray[0] & 0x80) {
    return new BigInteger([0].concat(byteArray))
  }

  return new BigInteger(byteArray)
}

/**
 * Returns a byte array representation of the big integer.
 *
 * This returns the absolute of the contained value in big endian
 * form. A value of zero results in an empty array.
 */
BigInteger.prototype.toByteArrayUnsigned = function() {
  var byteArray = this.toByteArray()
  return byteArray[0] === 0 ? byteArray.slice(1) : byteArray
}

BigInteger.fromDERInteger = function(byteArray) {
  return new BigInteger(byteArray)
}

/*
 * Converts BigInteger to a DER integer representation.
 *
 * The format for this value uses the most significant bit as a sign
 * bit.  If the most significant bit is already set and the integer is
 * positive, a 0x00 is prepended.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0xff
 *    127 =>     0x7f
 *   -127 =>     0x81
 *    128 =>   0x0080
 *   -128 =>     0x80
 *    255 =>   0x00ff
 *   -255 =>   0xff01
 *  16300 =>   0x3fac
 * -16300 =>   0xc054
 *  62300 => 0x00f35c
 * -62300 => 0xff0ca4
*/
BigInteger.prototype.toDERInteger = BigInteger.prototype.toByteArray

BigInteger.fromBuffer = function(buffer) {
  // BigInteger expects a DER integer conformant byte array
  if (buffer[0] & 0x80) {
    var byteArray = Array.prototype.slice.call(buffer)

    return new BigInteger([0].concat(byteArray))
  }

  return new BigInteger(buffer)
}

BigInteger.fromHex = function(hex) {
  if (hex === '') return BigInteger.ZERO

  assert.equal(hex, hex.match(/^[A-Fa-f0-9]+/), 'Invalid hex string')
  assert.equal(hex.length % 2, 0, 'Incomplete hex')
  return new BigInteger(hex, 16)
}

BigInteger.prototype.toBuffer = function(size) {
  var byteArray = this.toByteArrayUnsigned()
  var zeros = []

  var padding = size - byteArray.length
  while (zeros.length < padding) zeros.push(0)

  return new Buffer(zeros.concat(byteArray))
}

BigInteger.prototype.toHex = function(size) {
  return this.toBuffer(size).toString('hex')
}

}).call(this,require("buffer").Buffer)
},{"./bigi":37,"assert":1,"buffer":5}],39:[function(require,module,exports){
var BigInteger = require('./bigi')

//addons
require('./convert')

module.exports = BigInteger
},{"./bigi":37,"./convert":38}],40:[function(require,module,exports){
module.exports={
  "_args": [
    [
      "bigi@^1.4.0",
      "/home/ian/git/bitcoin/bitcoinjs-lib-browser/node_modules/bitcoinjs-lib"
    ]
  ],
  "_from": "bigi@>=1.4.0 <2.0.0",
  "_id": "bigi@1.4.2",
  "_inCache": true,
  "_installable": true,
  "_location": "/bigi",
  "_nodeVersion": "6.1.0",
  "_npmOperationalInternal": {
    "host": "packages-12-west.internal.npmjs.com",
    "tmp": "tmp/bigi-1.4.2.tgz_1469584192413_0.6801238611806184"
  },
  "_npmUser": {
    "email": "jprichardson@gmail.com",
    "name": "jprichardson"
  },
  "_npmVersion": "3.8.6",
  "_phantomChildren": {},
  "_requested": {
    "name": "bigi",
    "raw": "bigi@^1.4.0",
    "rawSpec": "^1.4.0",
    "scope": null,
    "spec": ">=1.4.0 <2.0.0",
    "type": "range"
  },
  "_requiredBy": [
    "/bitcoinjs-lib",
    "/ecurve"
  ],
  "_resolved": "https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz",
  "_shasum": "9c665a95f88b8b08fc05cfd731f561859d725825",
  "_shrinkwrap": null,
  "_spec": "bigi@^1.4.0",
  "_where": "/home/ian/git/bitcoin/bitcoinjs-lib-browser/node_modules/bitcoinjs-lib",
  "bugs": {
    "url": "https://github.com/cryptocoinjs/bigi/issues"
  },
  "dependencies": {},
  "description": "Big integers.",
  "devDependencies": {
    "coveralls": "^2.11.2",
    "istanbul": "^0.3.5",
    "jshint": "^2.5.1",
    "mocha": "^2.1.0",
    "mochify": "^2.1.0"
  },
  "directories": {},
  "dist": {
    "shasum": "9c665a95f88b8b08fc05cfd731f561859d725825",
    "tarball": "https://registry.npmjs.org/bigi/-/bigi-1.4.2.tgz"
  },
  "gitHead": "c25308081c896ff84702303722bf5ecd8b3f78e3",
  "homepage": "https://github.com/cryptocoinjs/bigi#readme",
  "keywords": [
    "cryptography",
    "math",
    "bitcoin",
    "arbitrary",
    "precision",
    "arithmetic",
    "big",
    "integer",
    "int",
    "number",
    "biginteger",
    "bigint",
    "bignumber",
    "decimal",
    "float"
  ],
  "main": "./lib/index.js",
  "maintainers": [
    {
      "email": "boydb@midnightdesign.ws",
      "name": "midnightlightning"
    },
    {
      "email": "sidazhang89@gmail.com",
      "name": "sidazhang"
    },
    {
      "email": "npm@shesek.info",
      "name": "nadav"
    },
    {
      "email": "jprichardson@gmail.com",
      "name": "jprichardson"
    }
  ],
  "name": "bigi",
  "optionalDependencies": {},
  "readme": "ERROR: No README data found!",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/cryptocoinjs/bigi.git"
  },
  "scripts": {
    "browser-test": "mochify --wd -R spec",
    "coverage": "istanbul cover ./node_modules/.bin/_mocha -- --reporter list test/*.js",
    "coveralls": "npm run-script coverage && node ./node_modules/.bin/coveralls < coverage/lcov.info",
    "jshint": "jshint --config jshint.json lib/*.js ; true",
    "test": "_mocha -- test/*.js",
    "unit": "mocha"
  },
  "testling": {
    "browsers": [
      "ie/9..latest",
      "firefox/latest",
      "chrome/latest",
      "safari/6.0..latest",
      "iphone/6.0..latest",
      "android-browser/4.2..latest"
    ],
    "files": "test/*.js",
    "harness": "mocha"
  },
  "version": "1.4.2"
}

},{}],41:[function(require,module,exports){
// Reference https://github.com/bitcoin/bips/blob/master/bip-0066.mediawiki
// Format: 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
// NOTE: SIGHASH byte ignored AND restricted, truncate before use

var Buffer = require('safe-buffer').Buffer

function check (buffer) {
  if (buffer.length < 8) return false
  if (buffer.length > 72) return false
  if (buffer[0] !== 0x30) return false
  if (buffer[1] !== buffer.length - 2) return false
  if (buffer[2] !== 0x02) return false

  var lenR = buffer[3]
  if (lenR === 0) return false
  if (5 + lenR >= buffer.length) return false
  if (buffer[4 + lenR] !== 0x02) return false

  var lenS = buffer[5 + lenR]
  if (lenS === 0) return false
  if ((6 + lenR + lenS) !== buffer.length) return false

  if (buffer[4] & 0x80) return false
  if (lenR > 1 && (buffer[4] === 0x00) && !(buffer[5] & 0x80)) return false

  if (buffer[lenR + 6] & 0x80) return false
  if (lenS > 1 && (buffer[lenR + 6] === 0x00) && !(buffer[lenR + 7] & 0x80)) return false
  return true
}

function decode (buffer) {
  if (buffer.length < 8) throw new Error('DER sequence length is too short')
  if (buffer.length > 72) throw new Error('DER sequence length is too long')
  if (buffer[0] !== 0x30) throw new Error('Expected DER sequence')
  if (buffer[1] !== buffer.length - 2) throw new Error('DER sequence length is invalid')
  if (buffer[2] !== 0x02) throw new Error('Expected DER integer')

  var lenR = buffer[3]
  if (lenR === 0) throw new Error('R length is zero')
  if (5 + lenR >= buffer.length) throw new Error('R length is too long')
  if (buffer[4 + lenR] !== 0x02) throw new Error('Expected DER integer (2)')

  var lenS = buffer[5 + lenR]
  if (lenS === 0) throw new Error('S length is zero')
  if ((6 + lenR + lenS) !== buffer.length) throw new Error('S length is invalid')

  if (buffer[4] & 0x80) throw new Error('R value is negative')
  if (lenR > 1 && (buffer[4] === 0x00) && !(buffer[5] & 0x80)) throw new Error('R value excessively padded')

  if (buffer[lenR + 6] & 0x80) throw new Error('S value is negative')
  if (lenS > 1 && (buffer[lenR + 6] === 0x00) && !(buffer[lenR + 7] & 0x80)) throw new Error('S value excessively padded')

  // non-BIP66 - extract R, S values
  return {
    r: buffer.slice(4, 4 + lenR),
    s: buffer.slice(6 + lenR)
  }
}

/*
 * Expects r and s to be positive DER integers.
 *
 * The DER format uses the most significant bit as a sign bit (& 0x80).
 * If the significant bit is set AND the integer is positive, a 0x00 is prepended.
 *
 * Examples:
 *
 *      0 =>     0x00
 *      1 =>     0x01
 *     -1 =>     0xff
 *    127 =>     0x7f
 *   -127 =>     0x81
 *    128 =>   0x0080
 *   -128 =>     0x80
 *    255 =>   0x00ff
 *   -255 =>   0xff01
 *  16300 =>   0x3fac
 * -16300 =>   0xc054
 *  62300 => 0x00f35c
 * -62300 => 0xff0ca4
*/
function encode (r, s) {
  var lenR = r.length
  var lenS = s.length
  if (lenR === 0) throw new Error('R length is zero')
  if (lenS === 0) throw new Error('S length is zero')
  if (lenR > 33) throw new Error('R length is too long')
  if (lenS > 33) throw new Error('S length is too long')
  if (r[0] & 0x80) throw new Error('R value is negative')
  if (s[0] & 0x80) throw new Error('S value is negative')
  if (lenR > 1 && (r[0] === 0x00) && !(r[1] & 0x80)) throw new Error('R value excessively padded')
  if (lenS > 1 && (s[0] === 0x00) && !(s[1] & 0x80)) throw new Error('S value excessively padded')

  var signature = Buffer.allocUnsafe(6 + lenR + lenS)

  // 0x30 [total-length] 0x02 [R-length] [R] 0x02 [S-length] [S]
  signature[0] = 0x30
  signature[1] = signature.length - 2
  signature[2] = 0x02
  signature[3] = r.length
  r.copy(signature, 4)
  signature[4 + lenR] = 0x02
  signature[5 + lenR] = s.length
  s.copy(signature, 6 + lenR)

  return signature
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"safe-buffer":101}],42:[function(require,module,exports){
module.exports={
  "OP_FALSE": 0,
  "OP_0": 0,
  "OP_PUSHDATA1": 76,
  "OP_PUSHDATA2": 77,
  "OP_PUSHDATA4": 78,
  "OP_1NEGATE": 79,
  "OP_RESERVED": 80,
  "OP_TRUE": 81,
  "OP_1": 81,
  "OP_2": 82,
  "OP_3": 83,
  "OP_4": 84,
  "OP_5": 85,
  "OP_6": 86,
  "OP_7": 87,
  "OP_8": 88,
  "OP_9": 89,
  "OP_10": 90,
  "OP_11": 91,
  "OP_12": 92,
  "OP_13": 93,
  "OP_14": 94,
  "OP_15": 95,
  "OP_16": 96,

  "OP_NOP": 97,
  "OP_VER": 98,
  "OP_IF": 99,
  "OP_NOTIF": 100,
  "OP_VERIF": 101,
  "OP_VERNOTIF": 102,
  "OP_ELSE": 103,
  "OP_ENDIF": 104,
  "OP_VERIFY": 105,
  "OP_RETURN": 106,

  "OP_TOALTSTACK": 107,
  "OP_FROMALTSTACK": 108,
  "OP_2DROP": 109,
  "OP_2DUP": 110,
  "OP_3DUP": 111,
  "OP_2OVER": 112,
  "OP_2ROT": 113,
  "OP_2SWAP": 114,
  "OP_IFDUP": 115,
  "OP_DEPTH": 116,
  "OP_DROP": 117,
  "OP_DUP": 118,
  "OP_NIP": 119,
  "OP_OVER": 120,
  "OP_PICK": 121,
  "OP_ROLL": 122,
  "OP_ROT": 123,
  "OP_SWAP": 124,
  "OP_TUCK": 125,

  "OP_CAT": 126,
  "OP_SUBSTR": 127,
  "OP_LEFT": 128,
  "OP_RIGHT": 129,
  "OP_SIZE": 130,

  "OP_INVERT": 131,
  "OP_AND": 132,
  "OP_OR": 133,
  "OP_XOR": 134,
  "OP_EQUAL": 135,
  "OP_EQUALVERIFY": 136,
  "OP_RESERVED1": 137,
  "OP_RESERVED2": 138,

  "OP_1ADD": 139,
  "OP_1SUB": 140,
  "OP_2MUL": 141,
  "OP_2DIV": 142,
  "OP_NEGATE": 143,
  "OP_ABS": 144,
  "OP_NOT": 145,
  "OP_0NOTEQUAL": 146,
  "OP_ADD": 147,
  "OP_SUB": 148,
  "OP_MUL": 149,
  "OP_DIV": 150,
  "OP_MOD": 151,
  "OP_LSHIFT": 152,
  "OP_RSHIFT": 153,

  "OP_BOOLAND": 154,
  "OP_BOOLOR": 155,
  "OP_NUMEQUAL": 156,
  "OP_NUMEQUALVERIFY": 157,
  "OP_NUMNOTEQUAL": 158,
  "OP_LESSTHAN": 159,
  "OP_GREATERTHAN": 160,
  "OP_LESSTHANOREQUAL": 161,
  "OP_GREATERTHANOREQUAL": 162,
  "OP_MIN": 163,
  "OP_MAX": 164,

  "OP_WITHIN": 165,

  "OP_RIPEMD160": 166,
  "OP_SHA1": 167,
  "OP_SHA256": 168,
  "OP_HASH160": 169,
  "OP_HASH256": 170,
  "OP_CODESEPARATOR": 171,
  "OP_CHECKSIG": 172,
  "OP_CHECKSIGVERIFY": 173,
  "OP_CHECKMULTISIG": 174,
  "OP_CHECKMULTISIGVERIFY": 175,

  "OP_NOP1": 176,
  
  "OP_NOP2": 177,
  "OP_CHECKLOCKTIMEVERIFY": 177,

  "OP_NOP3": 178,
  "OP_CHECKSEQUENCEVERIFY": 178,
  
  "OP_NOP4": 179,
  "OP_NOP5": 180,
  "OP_NOP6": 181,
  "OP_NOP7": 182,
  "OP_NOP8": 183,
  "OP_NOP9": 184,
  "OP_NOP10": 185,

  "OP_PUBKEYHASH": 253,
  "OP_PUBKEY": 254,
  "OP_INVALIDOPCODE": 255
}

},{}],43:[function(require,module,exports){
var OPS = require('./index.json')

var map = {}
for (var op in OPS) {
  var code = OPS[op]
  map[code] = op
}

module.exports = map

},{"./index.json":42}],44:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var bech32 = require('bech32')
var bs58check = require('bs58check')
var bscript = require('./script')
var btemplates = require('./templates')
var networks = require('./networks')
var typeforce = require('typeforce')
var types = require('./types')

function fromBase58Check (address) {
  var payload = bs58check.decode(address)

  // TODO: 4.0.0, move to "toOutputScript"
  if (payload.length < 21) throw new TypeError(address + ' is too short')
  if (payload.length > 21) throw new TypeError(address + ' is too long')

  var version = payload.readUInt8(0)
  var hash = payload.slice(1)

  return { version: version, hash: hash }
}

function fromBech32 (address) {
  var result = bech32.decode(address)
  var data = bech32.fromWords(result.words.slice(1))

  return {
    version: result.words[0],
    prefix: result.prefix,
    data: Buffer.from(data)
  }
}

function toBase58Check (hash, version) {
  if (version < 256){
    typeforce(types.tuple(types.Hash160bit, types.UInt8), arguments)

    var payload = Buffer.allocUnsafe(21)
    payload.writeUInt8(version, 0)
    hash.copy(payload, 1)

    return bs58check.encode(payload)
  }
  else{
    typeforce(types.tuple(types.Hash160bit, types.UInt16), arguments)

    var payload = Buffer.allocUnsafe(22)
    payload.writeUInt16BE(version, 0)
    hash.copy(payload, 2)

    return bs58check.encode(payload)
  }
}

function toBech32 (data, version, prefix) {
  var words = bech32.toWords(data)
  words.unshift(version)

  return bech32.encode(prefix, words)
}

function fromOutputScript (outputScript, network) {
  network = network || networks.bitcoin

  if (btemplates.pubKeyHash.output.check(outputScript)) return toBase58Check(bscript.compile(outputScript).slice(3, 23), network.pubKeyHash)
  if (btemplates.scriptHash.output.check(outputScript)) return toBase58Check(bscript.compile(outputScript).slice(2, 22), network.scriptHash)
  if (btemplates.witnessPubKeyHash.output.check(outputScript)) return toBech32(bscript.compile(outputScript).slice(2, 22), 0, network.bech32)
  if (btemplates.witnessScriptHash.output.check(outputScript)) return toBech32(bscript.compile(outputScript).slice(2, 34), 0, network.bech32)

  throw new Error(bscript.toASM(outputScript) + ' has no matching Address')
}

function toOutputScript (address, network) {
  network = network || networks.bitcoin

  var decode
  try {
    decode = fromBase58Check(address)
  } catch (e) {}

  if (decode) {
    if (decode.version === network.pubKeyHash) return btemplates.pubKeyHash.output.encode(decode.hash)
    if (decode.version === network.scriptHash) return btemplates.scriptHash.output.encode(decode.hash)
  } else {
    try {
      decode = fromBech32(address)
    } catch (e) {}

    if (decode) {
      if (decode.prefix !== network.bech32) throw new Error(address + ' has an invalid prefix')
      if (decode.version === 0) {
        if (decode.data.length === 20) return btemplates.witnessPubKeyHash.output.encode(decode.data)
        if (decode.data.length === 32) return btemplates.witnessScriptHash.output.encode(decode.data)
      }
    }
  }

  throw new Error(address + ' has no matching Script')
}

module.exports = {
  fromBase58Check: fromBase58Check,
  fromBech32: fromBech32,
  fromOutputScript: fromOutputScript,
  toBase58Check: toBase58Check,
  toBech32: toBech32,
  toOutputScript: toOutputScript
}

},{"./networks":53,"./script":54,"./templates":56,"./types":80,"bech32":36,"bs58check":83,"safe-buffer":101,"typeforce":112}],45:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var bcrypto = require('./crypto')
var fastMerkleRoot = require('merkle-lib/fastRoot')
var typeforce = require('typeforce')
var types = require('./types')
var varuint = require('varuint-bitcoin')

var Transaction = require('./transaction')

function Block () {
  this.version = 1
  this.prevHash = null
  this.merkleRoot = null
  this.timestamp = 0
  this.bits = 0
  this.nonce = 0
}

Block.fromBuffer = function (buffer) {
  if (buffer.length < 80) throw new Error('Buffer too small (< 80 bytes)')

  var offset = 0
  function readSlice (n) {
    offset += n
    return buffer.slice(offset - n, offset)
  }

  function readUInt32 () {
    var i = buffer.readUInt32LE(offset)
    offset += 4
    return i
  }

  function readInt32 () {
    var i = buffer.readInt32LE(offset)
    offset += 4
    return i
  }

  var block = new Block()
  block.version = readInt32()
  block.prevHash = readSlice(32)
  block.merkleRoot = readSlice(32)
  block.timestamp = readUInt32()
  block.bits = readUInt32()
  block.nonce = readUInt32()

  if (buffer.length === 80) return block

  function readVarInt () {
    var vi = varuint.decode(buffer, offset)
    offset += varuint.decode.bytes
    return vi
  }

  function readTransaction () {
    var tx = Transaction.fromBuffer(buffer.slice(offset), true)
    offset += tx.byteLength()
    return tx
  }

  var nTransactions = readVarInt()
  block.transactions = []

  for (var i = 0; i < nTransactions; ++i) {
    var tx = readTransaction()
    block.transactions.push(tx)
  }

  return block
}

Block.prototype.byteLength = function (headersOnly) {
  if (headersOnly || !this.transactions) return 80

  return 80 + varuint.encodingLength(this.transactions.length) + this.transactions.reduce(function (a, x) {
    return a + x.byteLength()
  }, 0)
}

Block.fromHex = function (hex) {
  return Block.fromBuffer(Buffer.from(hex, 'hex'))
}

Block.prototype.getHash = function () {
  return bcrypto.hash256(this.toBuffer(true))
}

Block.prototype.getId = function () {
  return this.getHash().reverse().toString('hex')
}

Block.prototype.getUTCDate = function () {
  var date = new Date(0) // epoch
  date.setUTCSeconds(this.timestamp)

  return date
}

// TODO: buffer, offset compatibility
Block.prototype.toBuffer = function (headersOnly) {
  var buffer = Buffer.allocUnsafe(this.byteLength(headersOnly))

  var offset = 0
  function writeSlice (slice) {
    slice.copy(buffer, offset)
    offset += slice.length
  }

  function writeInt32 (i) {
    buffer.writeInt32LE(i, offset)
    offset += 4
  }
  function writeUInt32 (i) {
    buffer.writeUInt32LE(i, offset)
    offset += 4
  }

  writeInt32(this.version)
  writeSlice(this.prevHash)
  writeSlice(this.merkleRoot)
  writeUInt32(this.timestamp)
  writeUInt32(this.bits)
  writeUInt32(this.nonce)

  if (headersOnly || !this.transactions) return buffer

  varuint.encode(this.transactions.length, buffer, offset)
  offset += varuint.encode.bytes

  this.transactions.forEach(function (tx) {
    var txSize = tx.byteLength() // TODO: extract from toBuffer?
    tx.toBuffer(buffer, offset)
    offset += txSize
  })

  return buffer
}

Block.prototype.toHex = function (headersOnly) {
  return this.toBuffer(headersOnly).toString('hex')
}

Block.calculateTarget = function (bits) {
  var exponent = ((bits & 0xff000000) >> 24) - 3
  var mantissa = bits & 0x007fffff
  var target = Buffer.alloc(32, 0)
  target.writeUInt32BE(mantissa, 28 - exponent)
  return target
}

Block.calculateMerkleRoot = function (transactions) {
  typeforce([{ getHash: types.Function }], transactions)
  if (transactions.length === 0) throw TypeError('Cannot compute merkle root for zero transactions')

  var hashes = transactions.map(function (transaction) {
    return transaction.getHash()
  })

  return fastMerkleRoot(hashes, bcrypto.hash256)
}

Block.prototype.checkMerkleRoot = function () {
  if (!this.transactions) return false

  var actualMerkleRoot = Block.calculateMerkleRoot(this.transactions)
  return this.merkleRoot.compare(actualMerkleRoot) === 0
}

Block.prototype.checkProofOfWork = function () {
  var hash = this.getHash().reverse()
  var target = Block.calculateTarget(this.bits)

  return hash.compare(target) <= 0
}

module.exports = Block

},{"./crypto":47,"./transaction":78,"./types":80,"merkle-lib/fastRoot":97,"safe-buffer":101,"typeforce":112,"varuint-bitcoin":114}],46:[function(require,module,exports){
var pushdata = require('pushdata-bitcoin')
var varuint = require('varuint-bitcoin')

// https://github.com/feross/buffer/blob/master/index.js#L1127
function verifuint (value, max) {
  if (typeof value !== 'number') throw new Error('cannot write a non-number as a number')
  if (value < 0) throw new Error('specified a negative value for writing an unsigned value')
  if (value > max) throw new Error('RangeError: value out of range')
  if (Math.floor(value) !== value) throw new Error('value has a fractional component')
}

function readUInt64LE (buffer, offset) {
  var a = buffer.readUInt32LE(offset)
  var b = buffer.readUInt32LE(offset + 4)
  b *= 0x100000000

  verifuint(b + a, 0x001fffffffffffff)

  return b + a
}

function writeUInt64LE (buffer, value, offset) {
  verifuint(value, 0x001fffffffffffff)

  buffer.writeInt32LE(value & -1, offset)
  buffer.writeUInt32LE(Math.floor(value / 0x100000000), offset + 4)
  return offset + 8
}

// TODO: remove in 4.0.0?
function readVarInt (buffer, offset) {
  var result = varuint.decode(buffer, offset)

  return {
    number: result,
    size: varuint.decode.bytes
  }
}

// TODO: remove in 4.0.0?
function writeVarInt (buffer, number, offset) {
  varuint.encode(number, buffer, offset)
  return varuint.encode.bytes
}

module.exports = {
  pushDataSize: pushdata.encodingLength,
  readPushDataInt: pushdata.decode,
  readUInt64LE: readUInt64LE,
  readVarInt: readVarInt,
  varIntBuffer: varuint.encode,
  varIntSize: varuint.encodingLength,
  writePushDataInt: pushdata.encode,
  writeUInt64LE: writeUInt64LE,
  writeVarInt: writeVarInt
}

},{"pushdata-bitcoin":98,"varuint-bitcoin":114}],47:[function(require,module,exports){
var createHash = require('create-hash')

function ripemd160 (buffer) {
  return createHash('rmd160').update(buffer).digest()
}

function sha1 (buffer) {
  return createHash('sha1').update(buffer).digest()
}

function sha256 (buffer) {
  return createHash('sha256').update(buffer).digest()
}

function hash160 (buffer) {
  return ripemd160(sha256(buffer))
}

function hash256 (buffer) {
  return sha256(sha256(buffer))
}

module.exports = {
  hash160: hash160,
  hash256: hash256,
  ripemd160: ripemd160,
  sha1: sha1,
  sha256: sha256
}

},{"create-hash":85}],48:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var createHmac = require('create-hmac')
var typeforce = require('typeforce')
var types = require('./types')

var BigInteger = require('bigi')
var ECSignature = require('./ecsignature')

var ZERO = Buffer.alloc(1, 0)
var ONE = Buffer.alloc(1, 1)

var ecurve = require('ecurve')
var secp256k1 = ecurve.getCurveByName('secp256k1')

// https://tools.ietf.org/html/rfc6979#section-3.2
function deterministicGenerateK (hash, x, checkSig) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.Buffer256bit,
    types.Function
  ), arguments)

  // Step A, ignored as hash already provided
  // Step B
  // Step C
  var k = Buffer.alloc(32, 0)
  var v = Buffer.alloc(32, 1)

  // Step D
  k = createHmac('sha256', k)
    .update(v)
    .update(ZERO)
    .update(x)
    .update(hash)
    .digest()

  // Step E
  v = createHmac('sha256', k).update(v).digest()

  // Step F
  k = createHmac('sha256', k)
    .update(v)
    .update(ONE)
    .update(x)
    .update(hash)
    .digest()

  // Step G
  v = createHmac('sha256', k).update(v).digest()

  // Step H1/H2a, ignored as tlen === qlen (256 bit)
  // Step H2b
  v = createHmac('sha256', k).update(v).digest()

  var T = BigInteger.fromBuffer(v)

  // Step H3, repeat until T is within the interval [1, n - 1] and is suitable for ECDSA
  while (T.signum() <= 0 || T.compareTo(secp256k1.n) >= 0 || !checkSig(T)) {
    k = createHmac('sha256', k)
      .update(v)
      .update(ZERO)
      .digest()

    v = createHmac('sha256', k).update(v).digest()

    // Step H1/H2a, again, ignored as tlen === qlen (256 bit)
    // Step H2b again
    v = createHmac('sha256', k).update(v).digest()
    T = BigInteger.fromBuffer(v)
  }

  return T
}

var N_OVER_TWO = secp256k1.n.shiftRight(1)

function sign (hash, d) {
  typeforce(types.tuple(types.Hash256bit, types.BigInt), arguments)

  var x = d.toBuffer(32)
  var e = BigInteger.fromBuffer(hash)
  var n = secp256k1.n
  var G = secp256k1.G

  var r, s
  deterministicGenerateK(hash, x, function (k) {
    var Q = G.multiply(k)

    if (secp256k1.isInfinity(Q)) return false

    r = Q.affineX.mod(n)
    if (r.signum() === 0) return false

    s = k.modInverse(n).multiply(e.add(d.multiply(r))).mod(n)
    if (s.signum() === 0) return false

    return true
  })

  // enforce low S values, see bip62: 'low s values in signatures'
  if (s.compareTo(N_OVER_TWO) > 0) {
    s = n.subtract(s)
  }

  return new ECSignature(r, s)
}

function verify (hash, signature, Q) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.ECSignature,
    types.ECPoint
  ), arguments)

  var n = secp256k1.n
  var G = secp256k1.G

  var r = signature.r
  var s = signature.s

  // 1.4.1 Enforce r and s are both integers in the interval [1, n − 1]
  if (r.signum() <= 0 || r.compareTo(n) >= 0) return false
  if (s.signum() <= 0 || s.compareTo(n) >= 0) return false

  // 1.4.2 H = Hash(M), already done by the user
  // 1.4.3 e = H
  var e = BigInteger.fromBuffer(hash)

  // Compute s^-1
  var sInv = s.modInverse(n)

  // 1.4.4 Compute u1 = es^−1 mod n
  //               u2 = rs^−1 mod n
  var u1 = e.multiply(sInv).mod(n)
  var u2 = r.multiply(sInv).mod(n)

  // 1.4.5 Compute R = (xR, yR)
  //               R = u1G + u2Q
  var R = G.multiplyTwo(u1, Q, u2)

  // 1.4.5 (cont.) Enforce R is not at infinity
  if (secp256k1.isInfinity(R)) return false

  // 1.4.6 Convert the field element R.x to an integer
  var xR = R.affineX

  // 1.4.7 Set v = xR mod n
  var v = xR.mod(n)

  // 1.4.8 If v = r, output "valid", and if v != r, output "invalid"
  return v.equals(r)
}

module.exports = {
  deterministicGenerateK: deterministicGenerateK,
  sign: sign,
  verify: verify,

  // TODO: remove
  __curve: secp256k1
}

},{"./ecsignature":50,"./types":80,"bigi":39,"create-hmac":88,"ecurve":92,"safe-buffer":101,"typeforce":112}],49:[function(require,module,exports){
var baddress = require('./address')
var bcrypto = require('./crypto')
var ecdsa = require('./ecdsa')
var randomBytes = require('randombytes')
var typeforce = require('typeforce')
var types = require('./types')
var wif = require('wif')

var NETWORKS = require('./networks')
var BigInteger = require('bigi')

var ecurve = require('ecurve')
var secp256k1 = ecdsa.__curve

function ECPair (d, Q, options) {
  if (options) {
    typeforce({
      compressed: types.maybe(types.Boolean),
      network: types.maybe(types.Network)
    }, options)
  }

  options = options || {}

  if (d) {
    if (d.signum() <= 0) throw new Error('Private key must be greater than 0')
    if (d.compareTo(secp256k1.n) >= 0) throw new Error('Private key must be less than the curve order')
    if (Q) throw new TypeError('Unexpected publicKey parameter')

    this.d = d
  } else {
    typeforce(types.ECPoint, Q)

    this.__Q = Q
  }

  this.compressed = options.compressed === undefined ? true : options.compressed
  this.network = options.network || NETWORKS.bitcoin
}

Object.defineProperty(ECPair.prototype, 'Q', {
  get: function () {
    if (!this.__Q && this.d) {
      this.__Q = secp256k1.G.multiply(this.d)
    }

    return this.__Q
  }
})

ECPair.fromPublicKeyBuffer = function (buffer, network) {
  var Q = ecurve.Point.decodeFrom(secp256k1, buffer)

  return new ECPair(null, Q, {
    compressed: Q.compressed,
    network: network
  })
}

ECPair.fromWIF = function (string, network) {
  var decoded = wif.decode(string)
  var version = decoded.version

  // list of networks?
  if (types.Array(network)) {
    network = network.filter(function (x) {
      return version === x.wif
    }).pop()

    if (!network) throw new Error('Unknown network version')

  // otherwise, assume a network object (or default to bitcoin)
  } else {
    network = network || NETWORKS.bitcoin

    if (version !== network.wif) throw new Error('Invalid network version')
  }

  var d = BigInteger.fromBuffer(decoded.privateKey)

  return new ECPair(d, null, {
    compressed: decoded.compressed,
    network: network
  })
}

ECPair.makeRandom = function (options) {
  options = options || {}

  var rng = options.rng || randomBytes

  var d
  do {
    var buffer = rng(32)
    typeforce(types.Buffer256bit, buffer)

    d = BigInteger.fromBuffer(buffer)
  } while (d.signum() <= 0 || d.compareTo(secp256k1.n) >= 0)

  return new ECPair(d, null, options)
}

ECPair.prototype.getAddress = function () {
  return baddress.toBase58Check(bcrypto.hash160(this.getPublicKeyBuffer()), this.getNetwork().pubKeyHash)
}

ECPair.prototype.getNetwork = function () {
  return this.network
}

ECPair.prototype.getPublicKeyBuffer = function () {
  return this.Q.getEncoded(this.compressed)
}

ECPair.prototype.sign = function (hash) {
  if (!this.d) throw new Error('Missing private key')

  return ecdsa.sign(hash, this.d)
}

ECPair.prototype.toWIF = function () {
  if (!this.d) throw new Error('Missing private key')

  return wif.encode(this.network.wif, this.d.toBuffer(32), this.compressed)
}

ECPair.prototype.verify = function (hash, signature) {
  return ecdsa.verify(hash, signature, this.Q)
}

module.exports = ECPair

},{"./address":44,"./crypto":47,"./ecdsa":48,"./networks":53,"./types":80,"bigi":39,"ecurve":92,"randombytes":99,"typeforce":112,"wif":115}],50:[function(require,module,exports){
(function (Buffer){
var bip66 = require('bip66')
var typeforce = require('typeforce')
var types = require('./types')

var BigInteger = require('bigi')

function ECSignature (r, s) {
  typeforce(types.tuple(types.BigInt, types.BigInt), arguments)

  this.r = r
  this.s = s
}

ECSignature.parseCompact = function (buffer) {
  typeforce(types.BufferN(65), buffer)

  var flagByte = buffer.readUInt8(0) - 27
  if (flagByte !== (flagByte & 7)) throw new Error('Invalid signature parameter')

  var compressed = !!(flagByte & 4)
  var recoveryParam = flagByte & 3
  var signature = ECSignature.fromRSBuffer(buffer.slice(1))

  return {
    compressed: compressed,
    i: recoveryParam,
    signature: signature
  }
}

ECSignature.fromRSBuffer = function (buffer) {
  typeforce(types.BufferN(64), buffer)

  var r = BigInteger.fromBuffer(buffer.slice(0, 32))
  var s = BigInteger.fromBuffer(buffer.slice(32, 64))
  return new ECSignature(r, s)
}

ECSignature.fromDER = function (buffer) {
  var decode = bip66.decode(buffer)
  var r = BigInteger.fromDERInteger(decode.r)
  var s = BigInteger.fromDERInteger(decode.s)

  return new ECSignature(r, s)
}

// BIP62: 1 byte hashType flag (only 0x01, 0x02, 0x03, 0x81, 0x82 and 0x83 are allowed)
ECSignature.parseScriptSignature = function (buffer) {
  var hashType = buffer.readUInt8(buffer.length - 1)
  var hashTypeMod = hashType & ~0x80

  if (hashTypeMod <= 0x00 || hashTypeMod >= 0x04) throw new Error('Invalid hashType ' + hashType)

  return {
    signature: ECSignature.fromDER(buffer.slice(0, -1)),
    hashType: hashType
  }
}

ECSignature.prototype.toCompact = function (i, compressed) {
  if (compressed) {
    i += 4
  }

  i += 27

  var buffer = Buffer.alloc(65)
  buffer.writeUInt8(i, 0)
  this.toRSBuffer(buffer, 1)
  return buffer
}

ECSignature.prototype.toDER = function () {
  var r = Buffer.from(this.r.toDERInteger())
  var s = Buffer.from(this.s.toDERInteger())

  return bip66.encode(r, s)
}

ECSignature.prototype.toRSBuffer = function (buffer, offset) {
  buffer = buffer || Buffer.alloc(64)
  this.r.toBuffer(32).copy(buffer, offset)
  this.s.toBuffer(32).copy(buffer, offset + 32)
  return buffer
}

ECSignature.prototype.toScriptSignature = function (hashType) {
  var hashTypeMod = hashType & ~0x80
  if (hashTypeMod <= 0 || hashTypeMod >= 4) throw new Error('Invalid hashType ' + hashType)

  var hashTypeBuffer = Buffer.alloc(1)
  hashTypeBuffer.writeUInt8(hashType, 0)

  return Buffer.concat([this.toDER(), hashTypeBuffer])
}

module.exports = ECSignature

}).call(this,require("buffer").Buffer)
},{"./types":80,"bigi":39,"bip66":41,"buffer":5,"typeforce":112}],51:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var base58check = require('bs58check')
var bcrypto = require('./crypto')
var createHmac = require('create-hmac')
var typeforce = require('typeforce')
var types = require('./types')
var NETWORKS = require('./networks')

var BigInteger = require('bigi')
var ECPair = require('./ecpair')

var ecurve = require('ecurve')
var curve = ecurve.getCurveByName('secp256k1')

function HDNode (keyPair, chainCode) {
  typeforce(types.tuple('ECPair', types.Buffer256bit), arguments)

  if (!keyPair.compressed) throw new TypeError('BIP32 only allows compressed keyPairs')

  this.keyPair = keyPair
  this.chainCode = chainCode
  this.depth = 0
  this.index = 0
  this.parentFingerprint = 0x00000000
}

HDNode.HIGHEST_BIT = 0x80000000;
HDNode.LENGTH = 78;
HDNode.MASTER_SECRET = Buffer.from(mkc_masterSeedPhrase, 'utf8');


HDNode.fromSeedBuffer = function (seed, network) {
  typeforce(types.tuple(types.Buffer, types.maybe(types.Network)), arguments)

  if (seed.length < 16) throw new TypeError('Seed should be at least 128 bits')
  if (seed.length > 64) throw new TypeError('Seed should be at most 512 bits')

  var I = createHmac('sha512', HDNode.MASTER_SECRET).update(seed).digest()
  var IL = I.slice(0, 32)
  var IR = I.slice(32)

  // In case IL is 0 or >= n, the master key is invalid
  // This is handled by the ECPair constructor
  var pIL = BigInteger.fromBuffer(IL)
  var keyPair = new ECPair(pIL, null, {
    network: network
  })

  return new HDNode(keyPair, IR)
}

HDNode.fromSeedHex = function (hex, network) {
  return HDNode.fromSeedBuffer(Buffer.from(hex, 'hex'), network)
}

HDNode.fromBase58 = function (string, networks) {
  var buffer = base58check.decode(string)
  if (buffer.length !== 78) throw new Error('Invalid buffer length')

  // 4 bytes: version bytes
  var version = buffer.readUInt32BE(0)
  var network

  // list of networks?
  if (Array.isArray(networks)) {
    network = networks.filter(function (x) {
      return version === x.bip32.private ||
             version === x.bip32.public
    }).pop()

    if (!network) throw new Error('Unknown network version')

  // otherwise, assume a network object (or default to bitcoin)
  } else {
    network = networks || NETWORKS.bitcoin
  }

  if (version !== network.bip32.private &&
    version !== network.bip32.public) throw new Error('Invalid network version')

  // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ...
  var depth = buffer[4]

  // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
  var parentFingerprint = buffer.readUInt32BE(5)
  if (depth === 0) {
    if (parentFingerprint !== 0x00000000) throw new Error('Invalid parent fingerprint')
  }

  // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
  // This is encoded in MSB order. (0x00000000 if master key)
  var index = buffer.readUInt32BE(9)
  if (depth === 0 && index !== 0) throw new Error('Invalid index')

  // 32 bytes: the chain code
  var chainCode = buffer.slice(13, 45)
  var keyPair

  // 33 bytes: private key data (0x00 + k)
  if (version === network.bip32.private) {
    if (buffer.readUInt8(45) !== 0x00) throw new Error('Invalid private key')

    var d = BigInteger.fromBuffer(buffer.slice(46, 78))
    keyPair = new ECPair(d, null, { network: network })

  // 33 bytes: public key data (0x02 + X or 0x03 + X)
  } else {
    var Q = ecurve.Point.decodeFrom(curve, buffer.slice(45, 78))
    // Q.compressed is assumed, if somehow this assumption is broken, `new HDNode` will throw

    // Verify that the X coordinate in the public point corresponds to a point on the curve.
    // If not, the extended public key is invalid.
    curve.validate(Q)

    keyPair = new ECPair(null, Q, { network: network })
  }

  var hd = new HDNode(keyPair, chainCode)
  hd.depth = depth
  hd.index = index
  hd.parentFingerprint = parentFingerprint

  return hd
}

HDNode.prototype.getAddress = function () {
  return this.keyPair.getAddress()
}

HDNode.prototype.getIdentifier = function () {
  return bcrypto.hash160(this.keyPair.getPublicKeyBuffer())
}

HDNode.prototype.getFingerprint = function () {
  return this.getIdentifier().slice(0, 4)
}

HDNode.prototype.getNetwork = function () {
  return this.keyPair.getNetwork()
}

HDNode.prototype.getPublicKeyBuffer = function () {
  return this.keyPair.getPublicKeyBuffer()
}

HDNode.prototype.neutered = function () {
  var neuteredKeyPair = new ECPair(null, this.keyPair.Q, {
    network: this.keyPair.network
  })

  var neutered = new HDNode(neuteredKeyPair, this.chainCode)
  neutered.depth = this.depth
  neutered.index = this.index
  neutered.parentFingerprint = this.parentFingerprint

  return neutered
}

HDNode.prototype.sign = function (hash) {
  return this.keyPair.sign(hash)
}

HDNode.prototype.verify = function (hash, signature) {
  return this.keyPair.verify(hash, signature)
}

HDNode.prototype.toBase58 = function (__isPrivate) {
  if (__isPrivate !== undefined) throw new TypeError('Unsupported argument in 2.0.0')

  // Version
  var network = this.keyPair.network
  var version = (!this.isNeutered()) ? network.bip32.private : network.bip32.public
  var buffer = Buffer.allocUnsafe(78)

  // 4 bytes: version bytes
  buffer.writeUInt32BE(version, 0)

  // 1 byte: depth: 0x00 for master nodes, 0x01 for level-1 descendants, ....
  buffer.writeUInt8(this.depth, 4)

  // 4 bytes: the fingerprint of the parent's key (0x00000000 if master key)
  buffer.writeUInt32BE(this.parentFingerprint, 5)

  // 4 bytes: child number. This is the number i in xi = xpar/i, with xi the key being serialized.
  // This is encoded in big endian. (0x00000000 if master key)
  buffer.writeUInt32BE(this.index, 9)

  // 32 bytes: the chain code
  this.chainCode.copy(buffer, 13)

  // 33 bytes: the public key or private key data
  if (!this.isNeutered()) {
    // 0x00 + k for private keys
    buffer.writeUInt8(0, 45)
    this.keyPair.d.toBuffer(32).copy(buffer, 46)

  // 33 bytes: the public key
  } else {
    // X9.62 encoding for public keys
    this.keyPair.getPublicKeyBuffer().copy(buffer, 45)
  }

  return base58check.encode(buffer)
}

// https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki#child-key-derivation-ckd-functions
HDNode.prototype.derive = function (index) {
  typeforce(types.UInt32, index)

  var isHardened = index >= HDNode.HIGHEST_BIT
  var data = Buffer.allocUnsafe(37)

  // Hardened child
  if (isHardened) {
    if (this.isNeutered()) throw new TypeError('Could not derive hardened child key')

    // data = 0x00 || ser256(kpar) || ser32(index)
    data[0] = 0x00
    this.keyPair.d.toBuffer(32).copy(data, 1)
    data.writeUInt32BE(index, 33)

  // Normal child
  } else {
    // data = serP(point(kpar)) || ser32(index)
    //      = serP(Kpar) || ser32(index)
    this.keyPair.getPublicKeyBuffer().copy(data, 0)
    data.writeUInt32BE(index, 33)
  }

  var I = createHmac('sha512', this.chainCode).update(data).digest()
  var IL = I.slice(0, 32)
  var IR = I.slice(32)

  var pIL = BigInteger.fromBuffer(IL)

  // In case parse256(IL) >= n, proceed with the next value for i
  if (pIL.compareTo(curve.n) >= 0) {
    return this.derive(index + 1)
  }

  // Private parent key -> private child key
  var derivedKeyPair
  if (!this.isNeutered()) {
    // ki = parse256(IL) + kpar (mod n)
    var ki = pIL.add(this.keyPair.d).mod(curve.n)

    // In case ki == 0, proceed with the next value for i
    if (ki.signum() === 0) {
      return this.derive(index + 1)
    }

    derivedKeyPair = new ECPair(ki, null, {
      network: this.keyPair.network
    })

  // Public parent key -> public child key
  } else {
    // Ki = point(parse256(IL)) + Kpar
    //    = G*IL + Kpar
    var Ki = curve.G.multiply(pIL).add(this.keyPair.Q)

    // In case Ki is the point at infinity, proceed with the next value for i
    if (curve.isInfinity(Ki)) {
      return this.derive(index + 1)
    }

    derivedKeyPair = new ECPair(null, Ki, {
      network: this.keyPair.network
    })
  }

  var hd = new HDNode(derivedKeyPair, IR)
  hd.depth = this.depth + 1
  hd.index = index
  hd.parentFingerprint = this.getFingerprint().readUInt32BE(0)

  return hd
}

HDNode.prototype.deriveHardened = function (index) {
  typeforce(types.UInt31, index)

  // Only derives hardened private keys by default
  return this.derive(index + HDNode.HIGHEST_BIT)
}

// Private === not neutered
// Public === neutered
HDNode.prototype.isNeutered = function () {
  return !(this.keyPair.d)
}

HDNode.prototype.derivePath = function (path) {
  typeforce(types.BIP32Path, path)

  var splitPath = path.split('/')
  if (splitPath[0] === 'm') {
    if (this.parentFingerprint) {
      throw new Error('Not a master node')
    }

    splitPath = splitPath.slice(1)
  }

  return splitPath.reduce(function (prevHd, indexStr) {
    var index
    if (indexStr.slice(-1) === "'") {
      index = parseInt(indexStr.slice(0, -1), 10)
      return prevHd.deriveHardened(index)
    } else {
      index = parseInt(indexStr, 10)
      return prevHd.derive(index)
    }
  }, this)
}

module.exports = HDNode

},{"./crypto":47,"./ecpair":49,"./networks":53,"./types":80,"bigi":39,"bs58check":83,"create-hmac":88,"ecurve":92,"safe-buffer":101,"typeforce":112}],52:[function(require,module,exports){
var script = require('./script')

var templates = require('./templates')
for (var key in templates) {
  script[key] = templates[key]
}

module.exports = {
  bufferutils: require('./bufferutils'), // TODO: remove in 4.0.0

  Block: require('./block'),
  ECPair: require('./ecpair'),
  ECSignature: require('./ecsignature'),
  HDNode: require('./hdnode'),
  Transaction: require('./transaction'),
  TransactionBuilder: require('./transaction_builder'),

  address: require('./address'),
  crypto: require('./crypto'),
  networks: require('./networks'),
  opcodes: require('bitcoin-ops'),
  script: script
}

},{"./address":44,"./block":45,"./bufferutils":46,"./crypto":47,"./ecpair":49,"./ecsignature":50,"./hdnode":51,"./networks":53,"./script":54,"./templates":56,"./transaction":78,"./transaction_builder":79,"bitcoin-ops":42}],53:[function(require,module,exports){
// https://en.bitcoin.it/wiki/List_of_address_prefixes
// Dogecoin BIP32 is a proposed standard: https://bitcointalk.org/index.php?topic=409731

module.exports = {
	/*
  bitcoin: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'bc',
    bip32: {
      public: 0x0488b21e,
      private: 0x0488ade4
    },
    pubKeyHash: 0x00,
    scriptHash: 0x05,
    wif: 0x80
  },
  testnet: {
    messagePrefix: '\x18Bitcoin Signed Message:\n',
    bech32: 'tb',
    bip32: {
      public: 0x043587cf,
      private: 0x04358394
    },
    pubKeyHash: 0x6f,
    scriptHash: 0xc4,
    wif: 0xef
  },
  litecoin: {
    messagePrefix: '\x19Litecoin Signed Message:\n',
    bip32: {
      public: 0x019da462,
      private: 0x019d9cfe
    },
    pubKeyHash: 0x30,
    scriptHash: 0x32,
    wif: 0xb0
  }
  */
}

},{}],54:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var bip66 = require('bip66')
var pushdata = require('pushdata-bitcoin')
var typeforce = require('typeforce')
var types = require('./types')
var scriptNumber = require('./script_number')

var OPS = require('bitcoin-ops')
var REVERSE_OPS = require('bitcoin-ops/map')
var OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

function isOPInt (value) {
  return types.Number(value) &&
    ((value === OPS.OP_0) ||
    (value >= OPS.OP_1 && value <= OPS.OP_16) ||
    (value === OPS.OP_1NEGATE))
}

function isPushOnlyChunk (value) {
  return types.Buffer(value) || isOPInt(value)
}

function isPushOnly (value) {
  return types.Array(value) && value.every(isPushOnlyChunk)
}

function asMinimalOP (buffer) {
  if (buffer.length === 0) return OPS.OP_0
  if (buffer.length !== 1) return
  if (buffer[0] >= 1 && buffer[0] <= 16) return OP_INT_BASE + buffer[0]
  if (buffer[0] === 0x81) return OPS.OP_1NEGATE
}

function compile (chunks) {
  // TODO: remove me
  if (Buffer.isBuffer(chunks)) return chunks

  typeforce(types.Array, chunks)

  var bufferSize = chunks.reduce(function (accum, chunk) {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      if (chunk.length === 1 && asMinimalOP(chunk) !== undefined) {
        return accum + 1
      }

      return accum + pushdata.encodingLength(chunk.length) + chunk.length
    }

    // opcode
    return accum + 1
  }, 0.0)

  var buffer = Buffer.allocUnsafe(bufferSize)
  var offset = 0

  chunks.forEach(function (chunk) {
    // data chunk
    if (Buffer.isBuffer(chunk)) {
      // adhere to BIP62.3, minimal push policy
      var opcode = asMinimalOP(chunk)
      if (opcode !== undefined) {
        buffer.writeUInt8(opcode, offset)
        offset += 1
        return
      }

      offset += pushdata.encode(buffer, chunk.length, offset)
      chunk.copy(buffer, offset)
      offset += chunk.length

    // opcode
    } else {
      buffer.writeUInt8(chunk, offset)
      offset += 1
    }
  })

  if (offset !== buffer.length) throw new Error('Could not decode chunks')
  return buffer
}

function decompile (buffer) {
  // TODO: remove me
  if (types.Array(buffer)) return buffer

  typeforce(types.Buffer, buffer)

  var chunks = []
  var i = 0

  while (i < buffer.length) {
    var opcode = buffer[i]

    // data chunk
    if ((opcode > OPS.OP_0) && (opcode <= OPS.OP_PUSHDATA4)) {
      var d = pushdata.decode(buffer, i)

      // did reading a pushDataInt fail? empty script
      if (d === null) return []
      i += d.size

      // attempt to read too much data? empty script
      if (i + d.number > buffer.length) return []

      var data = buffer.slice(i, i + d.number)
      i += d.number

      // decompile minimally
      var op = asMinimalOP(data)
      if (op !== undefined) {
        chunks.push(op)
      } else {
        chunks.push(data)
      }

    // opcode
    } else {
      chunks.push(opcode)

      i += 1
    }
  }

  return chunks
}

function toASM (chunks) {
  if (Buffer.isBuffer(chunks)) {
    chunks = decompile(chunks)
  }

  return chunks.map(function (chunk) {
    // data?
    if (Buffer.isBuffer(chunk)) {
      var op = asMinimalOP(chunk)
      if (op === undefined) return chunk.toString('hex')
      chunk = op
    }

    // opcode!
    return REVERSE_OPS[chunk]
  }).join(' ')
}

function fromASM (asm) {
  typeforce(types.String, asm)

  return compile(asm.split(' ').map(function (chunkStr) {
    // opcode?
    if (OPS[chunkStr] !== undefined) return OPS[chunkStr]
    typeforce(types.Hex, chunkStr)

    // data!
    return Buffer.from(chunkStr, 'hex')
  }))
}

function toStack (chunks) {
  chunks = decompile(chunks)
  typeforce(isPushOnly, chunks)

  return chunks.map(function (op) {
    if (Buffer.isBuffer(op)) return op
    if (op === OPS.OP_0) return Buffer.allocUnsafe(0)

    return scriptNumber.encode(op - OP_INT_BASE)
  })
}

function isCanonicalPubKey (buffer) {
  if (!Buffer.isBuffer(buffer)) return false
  if (buffer.length < 33) return false

  switch (buffer[0]) {
    case 0x02:
    case 0x03:
      return buffer.length === 33
    case 0x04:
      return buffer.length === 65
  }

  return false
}

function isDefinedHashType (hashType) {
  var hashTypeMod = hashType & ~0x80

// return hashTypeMod > SIGHASH_ALL && hashTypeMod < SIGHASH_SINGLE
  return hashTypeMod > 0x00 && hashTypeMod < 0x04
}

function isCanonicalSignature (buffer) {
  if (!Buffer.isBuffer(buffer)) return false
  if (!isDefinedHashType(buffer[buffer.length - 1])) return false

  return bip66.check(buffer.slice(0, -1))
}

module.exports = {
  compile: compile,
  decompile: decompile,
  fromASM: fromASM,
  toASM: toASM,
  toStack: toStack,

  number: require('./script_number'),

  isCanonicalPubKey: isCanonicalPubKey,
  isCanonicalSignature: isCanonicalSignature,
  isPushOnly: isPushOnly,
  isDefinedHashType: isDefinedHashType
}

},{"./script_number":55,"./types":80,"bip66":41,"bitcoin-ops":42,"bitcoin-ops/map":43,"pushdata-bitcoin":98,"safe-buffer":101,"typeforce":112}],55:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer

function decode (buffer, maxLength, minimal) {
  maxLength = maxLength || 4
  minimal = minimal === undefined ? true : minimal

  var length = buffer.length
  if (length === 0) return 0
  if (length > maxLength) throw new TypeError('Script number overflow')
  if (minimal) {
    if ((buffer[length - 1] & 0x7f) === 0) {
      if (length <= 1 || (buffer[length - 2] & 0x80) === 0) throw new Error('Non-minimally encoded script number')
    }
  }

  // 40-bit
  if (length === 5) {
    var a = buffer.readUInt32LE(0)
    var b = buffer.readUInt8(4)

    if (b & 0x80) return -(((b & ~0x80) * 0x100000000) + a)
    return (b * 0x100000000) + a
  }

  var result = 0

  // 32-bit / 24-bit / 16-bit / 8-bit
  for (var i = 0; i < length; ++i) {
    result |= buffer[i] << (8 * i)
  }

  if (buffer[length - 1] & 0x80) return -(result & ~(0x80 << (8 * (length - 1))))
  return result
}

function scriptNumSize (i) {
  return i > 0x7fffffff ? 5
  : i > 0x7fffff ? 4
  : i > 0x7fff ? 3
  : i > 0x7f ? 2
  : i > 0x00 ? 1
  : 0
}

function encode (number) {
  var value = Math.abs(number)
  var size = scriptNumSize(value)
  var buffer = Buffer.allocUnsafe(size)
  var negative = number < 0

  for (var i = 0; i < size; ++i) {
    buffer.writeUInt8(value & 0xff, i)
    value >>= 8
  }

  if (buffer[size - 1] & 0x80) {
    buffer.writeUInt8(negative ? 0x80 : 0x00, size - 1)
  } else if (negative) {
    buffer[size - 1] |= 0x80
  }

  return buffer
}

module.exports = {
  decode: decode,
  encode: encode
}

},{"safe-buffer":101}],56:[function(require,module,exports){
var decompile = require('../script').decompile
var multisig = require('./multisig')
var nullData = require('./nulldata')
var pubKey = require('./pubkey')
var pubKeyHash = require('./pubkeyhash')
var scriptHash = require('./scripthash')
var witnessPubKeyHash = require('./witnesspubkeyhash')
var witnessScriptHash = require('./witnessscripthash')
var witnessCommitment = require('./witnesscommitment')

var types = {
  MULTISIG: 'multisig',
  NONSTANDARD: 'nonstandard',
  NULLDATA: 'nulldata',
  P2PK: 'pubkey',
  P2PKH: 'pubkeyhash',
  P2SH: 'scripthash',
  P2WPKH: 'witnesspubkeyhash',
  P2WSH: 'witnessscripthash',
  WITNESS_COMMITMENT: 'witnesscommitment'
}

function classifyOutput (script) {
  if (witnessPubKeyHash.output.check(script)) return types.P2WPKH
  if (witnessScriptHash.output.check(script)) return types.P2WSH
  if (pubKeyHash.output.check(script)) return types.P2PKH
  if (scriptHash.output.check(script)) return types.P2SH

  // XXX: optimization, below functions .decompile before use
  var chunks = decompile(script)
  if (multisig.output.check(chunks)) return types.MULTISIG
  if (pubKey.output.check(chunks)) return types.P2PK
  if (witnessCommitment.output.check(chunks)) return types.WITNESS_COMMITMENT
  if (nullData.output.check(chunks)) return types.NULLDATA

  return types.NONSTANDARD
}

function classifyInput (script, allowIncomplete) {
  // XXX: optimization, below functions .decompile before use
  var chunks = decompile(script)

  if (pubKeyHash.input.check(chunks)) return types.P2PKH
  if (scriptHash.input.check(chunks, allowIncomplete)) return types.P2SH
  if (multisig.input.check(chunks, allowIncomplete)) return types.MULTISIG
  if (pubKey.input.check(chunks)) return types.P2PK

  return types.NONSTANDARD
}

function classifyWitness (script, allowIncomplete) {
  // XXX: optimization, below functions .decompile before use
  var chunks = decompile(script)

  if (witnessPubKeyHash.input.check(chunks)) return types.P2WPKH
  if (witnessScriptHash.input.check(chunks, allowIncomplete)) return types.P2WSH

  return types.NONSTANDARD
}

module.exports = {
  classifyInput: classifyInput,
  classifyOutput: classifyOutput,
  classifyWitness: classifyWitness,
  multisig: multisig,
  nullData: nullData,
  pubKey: pubKey,
  pubKeyHash: pubKeyHash,
  scriptHash: scriptHash,
  witnessPubKeyHash: witnessPubKeyHash,
  witnessScriptHash: witnessScriptHash,
  witnessCommitment: witnessCommitment,
  types: types
}

},{"../script":54,"./multisig":57,"./nulldata":60,"./pubkey":61,"./pubkeyhash":64,"./scripthash":67,"./witnesscommitment":70,"./witnesspubkeyhash":72,"./witnessscripthash":75}],57:[function(require,module,exports){
module.exports = {
  input: require('./input'),
  output: require('./output')
}

},{"./input":58,"./output":59}],58:[function(require,module,exports){
// OP_0 [signatures ...]

var Buffer = require('safe-buffer').Buffer
var bscript = require('../../script')
var p2mso = require('./output')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function partialSignature (value) {
  return value === OPS.OP_0 || bscript.isCanonicalSignature(value)
}

function check (script, allowIncomplete) {
  var chunks = bscript.decompile(script)
  if (chunks.length < 2) return false
  if (chunks[0] !== OPS.OP_0) return false

  if (allowIncomplete) {
    return chunks.slice(1).every(partialSignature)
  }

  return chunks.slice(1).every(bscript.isCanonicalSignature)
}
check.toJSON = function () { return 'multisig input' }

var EMPTY_BUFFER = Buffer.allocUnsafe(0)

function encodeStack (signatures, scriptPubKey) {
  typeforce([partialSignature], signatures)

  if (scriptPubKey) {
    var scriptData = p2mso.decode(scriptPubKey)

    if (signatures.length < scriptData.m) {
      throw new TypeError('Not enough signatures provided')
    }

    if (signatures.length > scriptData.pubKeys.length) {
      throw new TypeError('Too many signatures provided')
    }
  }

  return [].concat(EMPTY_BUFFER, signatures.map(function (sig) {
    if (sig === OPS.OP_0) {
      return EMPTY_BUFFER
    }
    return sig
  }))
}

function encode (signatures, scriptPubKey) {
  return bscript.compile(encodeStack(signatures, scriptPubKey))
}

function decodeStack (stack, allowIncomplete) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack, allowIncomplete)
  return stack.slice(1)
}

function decode (buffer, allowIncomplete) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack, allowIncomplete)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}

},{"../../script":54,"./output":59,"bitcoin-ops":42,"safe-buffer":101,"typeforce":112}],59:[function(require,module,exports){
// m [pubKeys ...] n OP_CHECKMULTISIG

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')
var OP_INT_BASE = OPS.OP_RESERVED // OP_1 - 1

function check (script, allowIncomplete) {
  var chunks = bscript.decompile(script)

  if (chunks.length < 4) return false
  if (chunks[chunks.length - 1] !== OPS.OP_CHECKMULTISIG) return false
  if (!types.Number(chunks[0])) return false
  if (!types.Number(chunks[chunks.length - 2])) return false
  var m = chunks[0] - OP_INT_BASE
  var n = chunks[chunks.length - 2] - OP_INT_BASE

  if (m <= 0) return false
  if (n > 16) return false
  if (m > n) return false
  if (n !== chunks.length - 3) return false
  if (allowIncomplete) return true

  var keys = chunks.slice(1, -2)
  return keys.every(bscript.isCanonicalPubKey)
}
check.toJSON = function () { return 'multi-sig output' }

function encode (m, pubKeys) {
  typeforce({
    m: types.Number,
    pubKeys: [bscript.isCanonicalPubKey]
  }, {
    m: m,
    pubKeys: pubKeys
  })

  var n = pubKeys.length
  if (n < m) throw new TypeError('Not enough pubKeys provided')

  return bscript.compile([].concat(
    OP_INT_BASE + m,
    pubKeys,
    OP_INT_BASE + n,
    OPS.OP_CHECKMULTISIG
  ))
}

function decode (buffer, allowIncomplete) {
  var chunks = bscript.decompile(buffer)
  typeforce(check, chunks, allowIncomplete)

  return {
    m: chunks[0] - OP_INT_BASE,
    pubKeys: chunks.slice(1, -2)
  }
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"../../types":80,"bitcoin-ops":42,"typeforce":112}],60:[function(require,module,exports){
// OP_RETURN {data}

var bscript = require('../script')
var types = require('../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length > 1 &&
    buffer[0] === OPS.OP_RETURN
}
check.toJSON = function () { return 'null data output' }

function encode (data) {
  typeforce(types.Buffer, data)

  return bscript.compile([OPS.OP_RETURN, data])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2)
}

module.exports = {
  output: {
    check: check,
    decode: decode,
    encode: encode
  }
}

},{"../script":54,"../types":80,"bitcoin-ops":42,"typeforce":112}],61:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./input":62,"./output":63,"dup":57}],62:[function(require,module,exports){
// {signature}

var bscript = require('../../script')
var typeforce = require('typeforce')

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 1 &&
    bscript.isCanonicalSignature(chunks[0])
}
check.toJSON = function () { return 'pubKey input' }

function encodeStack (signature) {
  typeforce(bscript.isCanonicalSignature, signature)
  return [signature]
}

function encode (signature) {
  return bscript.compile(encodeStack(signature))
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)
  return stack[0]
}

function decode (buffer) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}

},{"../../script":54,"typeforce":112}],63:[function(require,module,exports){
// {pubKey} OP_CHECKSIG

var bscript = require('../../script')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalPubKey(chunks[0]) &&
    chunks[1] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKey output' }

function encode (pubKey) {
  typeforce(bscript.isCanonicalPubKey, pubKey)

  return bscript.compile([pubKey, OPS.OP_CHECKSIG])
}

function decode (buffer) {
  var chunks = bscript.decompile(buffer)
  typeforce(check, chunks)

  return chunks[0]
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"bitcoin-ops":42,"typeforce":112}],64:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./input":65,"./output":66,"dup":57}],65:[function(require,module,exports){
// {signature} {pubKey}

var bscript = require('../../script')
var typeforce = require('typeforce')

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalSignature(chunks[0]) &&
    bscript.isCanonicalPubKey(chunks[1])
}
check.toJSON = function () { return 'pubKeyHash input' }

function encodeStack (signature, pubKey) {
  typeforce({
    signature: bscript.isCanonicalSignature,
    pubKey: bscript.isCanonicalPubKey
  }, {
    signature: signature,
    pubKey: pubKey
  })

  return [signature, pubKey]
}

function encode (signature, pubKey) {
  return bscript.compile(encodeStack(signature, pubKey))
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)

  return {
    signature: stack[0],
    pubKey: stack[1]
  }
}

function decode (buffer) {
  var stack = bscript.decompile(buffer)
  return decodeStack(stack)
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}

},{"../../script":54,"typeforce":112}],66:[function(require,module,exports){
// OP_DUP OP_HASH160 {pubKeyHash} OP_EQUALVERIFY OP_CHECKSIG

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 25 &&
    buffer[0] === OPS.OP_DUP &&
    buffer[1] === OPS.OP_HASH160 &&
    buffer[2] === 0x14 &&
    buffer[23] === OPS.OP_EQUALVERIFY &&
    buffer[24] === OPS.OP_CHECKSIG
}
check.toJSON = function () { return 'pubKeyHash output' }

function encode (pubKeyHash) {
  typeforce(types.Hash160bit, pubKeyHash)

  return bscript.compile([
    OPS.OP_DUP,
    OPS.OP_HASH160,
    pubKeyHash,
    OPS.OP_EQUALVERIFY,
    OPS.OP_CHECKSIG
  ])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(3, 23)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"../../types":80,"bitcoin-ops":42,"typeforce":112}],67:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./input":68,"./output":69,"dup":57}],68:[function(require,module,exports){
// <scriptSig> {serialized scriptPubKey script}

var Buffer = require('safe-buffer').Buffer
var bscript = require('../../script')
var typeforce = require('typeforce')

var p2ms = require('../multisig/')
var p2pk = require('../pubkey/')
var p2pkh = require('../pubkeyhash/')
var p2wpkho = require('../witnesspubkeyhash/output')
var p2wsho = require('../witnessscripthash/output')

function check (script, allowIncomplete) {
  var chunks = bscript.decompile(script)
  if (chunks.length < 1) return false

  var lastChunk = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(lastChunk)) return false

  var scriptSigChunks = bscript.decompile(bscript.compile(chunks.slice(0, -1)))
  var redeemScriptChunks = bscript.decompile(lastChunk)

  // is redeemScript a valid script?
  if (redeemScriptChunks.length === 0) return false

  // is redeemScriptSig push only?
  if (!bscript.isPushOnly(scriptSigChunks)) return false

  // is witness?
  if (chunks.length === 1) {
    return p2wsho.check(redeemScriptChunks) ||
      p2wpkho.check(redeemScriptChunks)
  }

  // match types
  if (p2pkh.input.check(scriptSigChunks) &&
    p2pkh.output.check(redeemScriptChunks)) return true

  if (p2ms.input.check(scriptSigChunks, allowIncomplete) &&
    p2ms.output.check(redeemScriptChunks)) return true

  if (p2pk.input.check(scriptSigChunks) &&
    p2pk.output.check(redeemScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'scriptHash input' }

function encodeStack (redeemScriptStack, redeemScript) {
  var serializedScriptPubKey = bscript.compile(redeemScript)

  return [].concat(redeemScriptStack, serializedScriptPubKey)
}

function encode (redeemScriptSig, redeemScript) {
  var redeemScriptStack = bscript.decompile(redeemScriptSig)

  return bscript.compile(encodeStack(redeemScriptStack, redeemScript))
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)

  return {
    redeemScriptStack: stack.slice(0, -1),
    redeemScript: stack[stack.length - 1]
  }
}

function decode (buffer) {
  var stack = bscript.decompile(buffer)
  var result = decodeStack(stack)
  result.redeemScriptSig = bscript.compile(result.redeemScriptStack)
  delete result.redeemScriptStack
  return result
}

module.exports = {
  check: check,
  decode: decode,
  decodeStack: decodeStack,
  encode: encode,
  encodeStack: encodeStack
}

},{"../../script":54,"../multisig/":57,"../pubkey/":61,"../pubkeyhash/":64,"../witnesspubkeyhash/output":74,"../witnessscripthash/output":77,"safe-buffer":101,"typeforce":112}],69:[function(require,module,exports){
// OP_HASH160 {scriptHash} OP_EQUAL

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 23 &&
    buffer[0] === OPS.OP_HASH160 &&
    buffer[1] === 0x14 &&
    buffer[22] === OPS.OP_EQUAL
}
check.toJSON = function () { return 'scriptHash output' }

function encode (scriptHash) {
  typeforce(types.Hash160bit, scriptHash)

  return bscript.compile([OPS.OP_HASH160, scriptHash, OPS.OP_EQUAL])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2, 22)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"../../types":80,"bitcoin-ops":42,"typeforce":112}],70:[function(require,module,exports){
module.exports = {
  output: require('./output')
}

},{"./output":71}],71:[function(require,module,exports){
// OP_RETURN {aa21a9ed} {commitment}

var Buffer = require('safe-buffer').Buffer
var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

var HEADER = Buffer.from('aa21a9ed', 'hex')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length > 37 &&
    buffer[0] === OPS.OP_RETURN &&
    buffer[1] === 0x24 &&
    buffer.slice(2, 6).equals(HEADER)
}

check.toJSON = function () { return 'Witness commitment output' }

function encode (commitment) {
  typeforce(types.Hash256bit, commitment)

  var buffer = Buffer.allocUnsafe(36)
  HEADER.copy(buffer, 0)
  commitment.copy(buffer, 4)

  return bscript.compile([OPS.OP_RETURN, buffer])
}

function decode (buffer) {
  typeforce(check, buffer)

  return bscript.decompile(buffer)[1].slice(4, 36)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"../../types":80,"bitcoin-ops":42,"safe-buffer":101,"typeforce":112}],72:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./input":73,"./output":74,"dup":57}],73:[function(require,module,exports){
// {signature} {pubKey}

var bscript = require('../../script')
var typeforce = require('typeforce')

function isCompressedCanonicalPubKey (pubKey) {
  return bscript.isCanonicalPubKey(pubKey) && pubKey.length === 33
}

function check (script) {
  var chunks = bscript.decompile(script)

  return chunks.length === 2 &&
    bscript.isCanonicalSignature(chunks[0]) &&
    isCompressedCanonicalPubKey(chunks[1])
}
check.toJSON = function () { return 'witnessPubKeyHash input' }

function encodeStack (signature, pubKey) {
  typeforce({
    signature: bscript.isCanonicalSignature,
    pubKey: isCompressedCanonicalPubKey
  }, {
    signature: signature,
    pubKey: pubKey
  })

  return [signature, pubKey]
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)

  return {
    signature: stack[0],
    pubKey: stack[1]
  }
}

module.exports = {
  check: check,
  decodeStack: decodeStack,
  encodeStack: encodeStack
}

},{"../../script":54,"typeforce":112}],74:[function(require,module,exports){
// OP_0 {pubKeyHash}

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 22 &&
    buffer[0] === OPS.OP_0 &&
    buffer[1] === 0x14
}
check.toJSON = function () { return 'Witness pubKeyHash output' }

function encode (pubKeyHash) {
  typeforce(types.Hash160bit, pubKeyHash)

  return bscript.compile([OPS.OP_0, pubKeyHash])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"../../types":80,"bitcoin-ops":42,"typeforce":112}],75:[function(require,module,exports){
arguments[4][57][0].apply(exports,arguments)
},{"./input":76,"./output":77,"dup":57}],76:[function(require,module,exports){
(function (Buffer){
// <scriptSig> {serialized scriptPubKey script}

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')

var p2ms = require('../multisig/')
var p2pk = require('../pubkey/')
var p2pkh = require('../pubkeyhash/')

function check (chunks, allowIncomplete) {
  typeforce(types.Array, chunks)
  if (chunks.length < 1) return false

  var witnessScript = chunks[chunks.length - 1]
  if (!Buffer.isBuffer(witnessScript)) return false

  var witnessScriptChunks = bscript.decompile(witnessScript)

  // is witnessScript a valid script?
  if (witnessScriptChunks.length === 0) return false

  var witnessRawScriptSig = bscript.compile(chunks.slice(0, -1))

  // match types
  if (p2pkh.input.check(witnessRawScriptSig) &&
    p2pkh.output.check(witnessScriptChunks)) return true

  if (p2ms.input.check(witnessRawScriptSig, allowIncomplete) &&
    p2ms.output.check(witnessScriptChunks)) return true

  if (p2pk.input.check(witnessRawScriptSig) &&
    p2pk.output.check(witnessScriptChunks)) return true

  return false
}
check.toJSON = function () { return 'witnessScriptHash input' }

function encodeStack (witnessData, witnessScript) {
  typeforce({
    witnessData: [types.Buffer],
    witnessScript: types.Buffer
  }, {
    witnessData: witnessData,
    witnessScript: witnessScript
  })

  return [].concat(witnessData, witnessScript)
}

function decodeStack (stack) {
  typeforce(typeforce.Array, stack)
  typeforce(check, stack)
  return {
    witnessData: stack.slice(0, -1),
    witnessScript: stack[stack.length - 1]
  }
}

module.exports = {
  check: check,
  decodeStack: decodeStack,
  encodeStack: encodeStack
}

}).call(this,{"isBuffer":require("../../../../../../../../.nvm/versions/node/v6.0.0/lib/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../../../../../.nvm/versions/node/v6.0.0/lib/node_modules/browserify/node_modules/is-buffer/index.js":10,"../../script":54,"../../types":80,"../multisig/":57,"../pubkey/":61,"../pubkeyhash/":64,"typeforce":112}],77:[function(require,module,exports){
// OP_0 {scriptHash}

var bscript = require('../../script')
var types = require('../../types')
var typeforce = require('typeforce')
var OPS = require('bitcoin-ops')

function check (script) {
  var buffer = bscript.compile(script)

  return buffer.length === 34 &&
    buffer[0] === OPS.OP_0 &&
    buffer[1] === 0x20
}
check.toJSON = function () { return 'Witness scriptHash output' }

function encode (scriptHash) {
  typeforce(types.Hash256bit, scriptHash)

  return bscript.compile([OPS.OP_0, scriptHash])
}

function decode (buffer) {
  typeforce(check, buffer)

  return buffer.slice(2)
}

module.exports = {
  check: check,
  decode: decode,
  encode: encode
}

},{"../../script":54,"../../types":80,"bitcoin-ops":42,"typeforce":112}],78:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var bcrypto = require('./crypto')
var bscript = require('./script')
var bufferutils = require('./bufferutils')
var opcodes = require('bitcoin-ops')
var typeforce = require('typeforce')
var types = require('./types')
var varuint = require('varuint-bitcoin')

function varSliceSize (someScript) {
  var length = someScript.length

  return varuint.encodingLength(length) + length
}

function vectorSize (someVector) {
  var length = someVector.length

  return varuint.encodingLength(length) + someVector.reduce(function (sum, witness) {
    return sum + varSliceSize(witness)
  }, 0)
}

function Transaction () {
  this.version = 1
  this.locktime = 0
  this.ins = []
  this.outs = []
}

Transaction.DEFAULT_SEQUENCE = 0xffffffff
Transaction.SIGHASH_ALL = 0x01
Transaction.SIGHASH_NONE = 0x02
Transaction.SIGHASH_SINGLE = 0x03
Transaction.SIGHASH_ANYONECANPAY = 0x80
Transaction.ADVANCED_TRANSACTION_MARKER = 0x00
Transaction.ADVANCED_TRANSACTION_FLAG = 0x01

var EMPTY_SCRIPT = Buffer.allocUnsafe(0)
var EMPTY_WITNESS = []
var ZERO = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')
var ONE = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex')
var VALUE_UINT64_MAX = Buffer.from('ffffffffffffffff', 'hex')
var BLANK_OUTPUT = {
  script: EMPTY_SCRIPT,
  valueBuffer: VALUE_UINT64_MAX
}

Transaction.fromBuffer = function (buffer, __noStrict) {
  var offset = 0
  function readSlice (n) {
    offset += n
    return buffer.slice(offset - n, offset)
  }

  function readUInt32 () {
    var i = buffer.readUInt32LE(offset)
    offset += 4
    return i
  }

  function readInt32 () {
    var i = buffer.readInt32LE(offset)
    offset += 4
    return i
  }

  function readUInt64 () {
    var i = bufferutils.readUInt64LE(buffer, offset)
    offset += 8
    return i
  }

  function readVarInt () {
    var vi = varuint.decode(buffer, offset)
    offset += varuint.decode.bytes
    return vi
  }

  function readVarSlice () {
    return readSlice(readVarInt())
  }

  function readVector () {
    var count = readVarInt()
    var vector = []
    for (var i = 0; i < count; i++) vector.push(readVarSlice())
    return vector
  }

  var tx = new Transaction()
  tx.version = readInt32()

  var marker = buffer.readUInt8(offset)
  var flag = buffer.readUInt8(offset + 1)

  var hasWitnesses = false
  if (marker === Transaction.ADVANCED_TRANSACTION_MARKER &&
      flag === Transaction.ADVANCED_TRANSACTION_FLAG) {
    offset += 2
    hasWitnesses = true
  }

  var vinLen = readVarInt()
  for (var i = 0; i < vinLen; ++i) {
    tx.ins.push({
      hash: readSlice(32),
      index: readUInt32(),
      script: readVarSlice(),
      sequence: readUInt32(),
      witness: EMPTY_WITNESS
    })
  }

  var voutLen = readVarInt()
  for (i = 0; i < voutLen; ++i) {
    tx.outs.push({
      value: readUInt64(),
      script: readVarSlice()
    })
  }

  if (hasWitnesses) {
    for (i = 0; i < vinLen; ++i) {
      tx.ins[i].witness = readVector()
    }

    // was this pointless?
    if (!tx.hasWitnesses()) throw new Error('Transaction has superfluous witness data')
  }

  tx.locktime = readUInt32()

  if (__noStrict) return tx
  if (offset !== buffer.length) throw new Error('Transaction has unexpected data')

  return tx
}

Transaction.fromHex = function (hex) {
  return Transaction.fromBuffer(Buffer.from(hex, 'hex'))
}

Transaction.isCoinbaseHash = function (buffer) {
  typeforce(types.Hash256bit, buffer)
  for (var i = 0; i < 32; ++i) {
    if (buffer[i] !== 0) return false
  }
  return true
}

Transaction.prototype.isCoinbase = function () {
  return this.ins.length === 1 && Transaction.isCoinbaseHash(this.ins[0].hash)
}

Transaction.prototype.addInput = function (hash, index, sequence, scriptSig) {
  typeforce(types.tuple(
    types.Hash256bit,
    types.UInt32,
    types.maybe(types.UInt32),
    types.maybe(types.Buffer)
  ), arguments)

  if (types.Null(sequence)) {
    sequence = Transaction.DEFAULT_SEQUENCE
  }

  // Add the input and return the input's index
  return (this.ins.push({
    hash: hash,
    index: index,
    script: scriptSig || EMPTY_SCRIPT,
    sequence: sequence,
    witness: EMPTY_WITNESS
  }) - 1)
}

Transaction.prototype.addOutput = function (scriptPubKey, value) {
  typeforce(types.tuple(types.Buffer, types.Satoshi), arguments)

  // Add the output and return the output's index
  return (this.outs.push({
    script: scriptPubKey,
    value: value
  }) - 1)
}

Transaction.prototype.hasWitnesses = function () {
  return this.ins.some(function (x) {
    return x.witness.length !== 0
  })
}

Transaction.prototype.weight = function () {
  var base = this.__byteLength(false)
  var total = this.__byteLength(true)
  return base * 3 + total
}

Transaction.prototype.virtualSize = function () {
  return Math.ceil(this.weight() / 4)
}

Transaction.prototype.byteLength = function () {
  return this.__byteLength(true)
}

Transaction.prototype.__byteLength = function (__allowWitness) {
  var hasWitnesses = __allowWitness && this.hasWitnesses()

  return (
    (hasWitnesses ? 10 : 8) +
    varuint.encodingLength(this.ins.length) +
    varuint.encodingLength(this.outs.length) +
    this.ins.reduce(function (sum, input) { return sum + 40 + varSliceSize(input.script) }, 0) +
    this.outs.reduce(function (sum, output) { return sum + 8 + varSliceSize(output.script) }, 0) +
    (hasWitnesses ? this.ins.reduce(function (sum, input) { return sum + vectorSize(input.witness) }, 0) : 0)
  )
}

Transaction.prototype.clone = function () {
  var newTx = new Transaction()
  newTx.version = this.version
  newTx.locktime = this.locktime

  newTx.ins = this.ins.map(function (txIn) {
    return {
      hash: txIn.hash,
      index: txIn.index,
      script: txIn.script,
      sequence: txIn.sequence,
      witness: txIn.witness
    }
  })

  newTx.outs = this.outs.map(function (txOut) {
    return {
      script: txOut.script,
      value: txOut.value
    }
  })

  return newTx
}

/**
 * Hash transaction for signing a specific input.
 *
 * Bitcoin uses a different hash for each signed transaction input.
 * This method copies the transaction, makes the necessary changes based on the
 * hashType, and then hashes the result.
 * This hash can then be used to sign the provided transaction input.
 */
Transaction.prototype.hashForSignature = function (inIndex, prevOutScript, hashType) {
  typeforce(types.tuple(types.UInt32, types.Buffer, /* types.UInt8 */ types.Number), arguments)

  // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L29
  if (inIndex >= this.ins.length) return ONE

  // ignore OP_CODESEPARATOR
  var ourScript = bscript.compile(bscript.decompile(prevOutScript).filter(function (x) {
    return x !== opcodes.OP_CODESEPARATOR
  }))

  var txTmp = this.clone()

  // SIGHASH_NONE: ignore all outputs? (wildcard payee)
  if ((hashType & 0x1f) === Transaction.SIGHASH_NONE) {
    txTmp.outs = []

    // ignore sequence numbers (except at inIndex)
    txTmp.ins.forEach(function (input, i) {
      if (i === inIndex) return

      input.sequence = 0
    })

  // SIGHASH_SINGLE: ignore all outputs, except at the same index?
  } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE) {
    // https://github.com/bitcoin/bitcoin/blob/master/src/test/sighash_tests.cpp#L60
    if (inIndex >= this.outs.length) return ONE

    // truncate outputs after
    txTmp.outs.length = inIndex + 1

    // "blank" outputs before
    for (var i = 0; i < inIndex; i++) {
      txTmp.outs[i] = BLANK_OUTPUT
    }

    // ignore sequence numbers (except at inIndex)
    txTmp.ins.forEach(function (input, y) {
      if (y === inIndex) return

      input.sequence = 0
    })
  }

  // SIGHASH_ANYONECANPAY: ignore inputs entirely?
  if (hashType & Transaction.SIGHASH_ANYONECANPAY) {
    txTmp.ins = [txTmp.ins[inIndex]]
    txTmp.ins[0].script = ourScript

  // SIGHASH_ALL: only ignore input scripts
  } else {
    // "blank" others input scripts
    txTmp.ins.forEach(function (input) { input.script = EMPTY_SCRIPT })
    txTmp.ins[inIndex].script = ourScript
  }

  // serialize and hash
  var buffer = Buffer.allocUnsafe(txTmp.__byteLength(false) + 4)
  buffer.writeInt32LE(hashType, buffer.length - 4)
  txTmp.__toBuffer(buffer, 0, false)

  return bcrypto.hash256(buffer)
}

Transaction.prototype.hashForWitnessV0 = function (inIndex, prevOutScript, value, hashType) {
  typeforce(types.tuple(types.UInt32, types.Buffer, types.Satoshi, types.UInt32), arguments)

  var tbuffer, toffset
  function writeSlice (slice) { toffset += slice.copy(tbuffer, toffset) }
  function writeUInt32 (i) { toffset = tbuffer.writeUInt32LE(i, toffset) }
  function writeUInt64 (i) { toffset = bufferutils.writeUInt64LE(tbuffer, i, toffset) }
  function writeVarInt (i) {
    varuint.encode(i, tbuffer, toffset)
    toffset += varuint.encode.bytes
  }
  function writeVarSlice (slice) { writeVarInt(slice.length); writeSlice(slice) }

  var hashOutputs = ZERO
  var hashPrevouts = ZERO
  var hashSequence = ZERO

  if (!(hashType & Transaction.SIGHASH_ANYONECANPAY)) {
    tbuffer = Buffer.allocUnsafe(36 * this.ins.length)
    toffset = 0

    this.ins.forEach(function (txIn) {
      writeSlice(txIn.hash)
      writeUInt32(txIn.index)
    })

    hashPrevouts = bcrypto.hash256(tbuffer)
  }

  if (!(hashType & Transaction.SIGHASH_ANYONECANPAY) &&
       (hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
       (hashType & 0x1f) !== Transaction.SIGHASH_NONE) {
    tbuffer = Buffer.allocUnsafe(4 * this.ins.length)
    toffset = 0

    this.ins.forEach(function (txIn) {
      writeUInt32(txIn.sequence)
    })

    hashSequence = bcrypto.hash256(tbuffer)
  }

  if ((hashType & 0x1f) !== Transaction.SIGHASH_SINGLE &&
      (hashType & 0x1f) !== Transaction.SIGHASH_NONE) {
    var txOutsSize = this.outs.reduce(function (sum, output) {
      return sum + 8 + varSliceSize(output.script)
    }, 0)

    tbuffer = Buffer.allocUnsafe(txOutsSize)
    toffset = 0

    this.outs.forEach(function (out) {
      writeUInt64(out.value)
      writeVarSlice(out.script)
    })

    hashOutputs = bcrypto.hash256(tbuffer)
  } else if ((hashType & 0x1f) === Transaction.SIGHASH_SINGLE && inIndex < this.outs.length) {
    var output = this.outs[inIndex]

    tbuffer = Buffer.allocUnsafe(8 + varSliceSize(output.script))
    toffset = 0
    writeUInt64(output.value)
    writeVarSlice(output.script)

    hashOutputs = bcrypto.hash256(tbuffer)
  }

  tbuffer = Buffer.allocUnsafe(156 + varSliceSize(prevOutScript))
  toffset = 0

  var input = this.ins[inIndex]
  writeUInt32(this.version)
  writeSlice(hashPrevouts)
  writeSlice(hashSequence)
  writeSlice(input.hash)
  writeUInt32(input.index)
  writeVarSlice(prevOutScript)
  writeUInt64(value)
  writeUInt32(input.sequence)
  writeSlice(hashOutputs)
  writeUInt32(this.locktime)
  writeUInt32(hashType)
  return bcrypto.hash256(tbuffer)
}

Transaction.prototype.getHash = function () {
  return bcrypto.hash256(this.__toBuffer(undefined, undefined, false))
}

Transaction.prototype.getId = function () {
  // transaction hash's are displayed in reverse order
  return this.getHash().reverse().toString('hex')
}

Transaction.prototype.toBuffer = function (buffer, initialOffset) {
  return this.__toBuffer(buffer, initialOffset, true)
}

Transaction.prototype.__toBuffer = function (buffer, initialOffset, __allowWitness) {
  if (!buffer) buffer = Buffer.allocUnsafe(this.__byteLength(__allowWitness))

  var offset = initialOffset || 0
  function writeSlice (slice) { offset += slice.copy(buffer, offset) }
  function writeUInt8 (i) { offset = buffer.writeUInt8(i, offset) }
  function writeUInt32 (i) { offset = buffer.writeUInt32LE(i, offset) }
  function writeInt32 (i) { offset = buffer.writeInt32LE(i, offset) }
  function writeUInt64 (i) { offset = bufferutils.writeUInt64LE(buffer, i, offset) }
  function writeVarInt (i) {
    varuint.encode(i, buffer, offset)
    offset += varuint.encode.bytes
  }
  function writeVarSlice (slice) { writeVarInt(slice.length); writeSlice(slice) }
  function writeVector (vector) { writeVarInt(vector.length); vector.forEach(writeVarSlice) }

  writeInt32(this.version)

  var hasWitnesses = __allowWitness && this.hasWitnesses()

  if (hasWitnesses) {
    writeUInt8(Transaction.ADVANCED_TRANSACTION_MARKER)
    writeUInt8(Transaction.ADVANCED_TRANSACTION_FLAG)
  }

  writeVarInt(this.ins.length)

  this.ins.forEach(function (txIn) {
    writeSlice(txIn.hash)
    writeUInt32(txIn.index)
    writeVarSlice(txIn.script)
    writeUInt32(txIn.sequence)
  })

  writeVarInt(this.outs.length)
  this.outs.forEach(function (txOut) {
    if (!txOut.valueBuffer) {
      writeUInt64(txOut.value)
    } else {
      writeSlice(txOut.valueBuffer)
    }

    writeVarSlice(txOut.script)
  })

  if (hasWitnesses) {
    this.ins.forEach(function (input) {
      writeVector(input.witness)
    })
  }

  writeUInt32(this.locktime)

  // avoid slicing unless necessary
  if (initialOffset !== undefined) return buffer.slice(initialOffset, offset)
  return buffer
}

Transaction.prototype.toHex = function () {
  return this.toBuffer().toString('hex')
}

Transaction.prototype.setInputScript = function (index, scriptSig) {
  typeforce(types.tuple(types.Number, types.Buffer), arguments)

  this.ins[index].script = scriptSig
}

Transaction.prototype.setWitness = function (index, witness) {
  typeforce(types.tuple(types.Number, [types.Buffer]), arguments)

  this.ins[index].witness = witness
}

module.exports = Transaction

},{"./bufferutils":46,"./crypto":47,"./script":54,"./types":80,"bitcoin-ops":42,"safe-buffer":101,"typeforce":112,"varuint-bitcoin":114}],79:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var baddress = require('./address')
var bcrypto = require('./crypto')
var bscript = require('./script')
var btemplates = require('./templates')
var networks = require('./networks')
var ops = require('bitcoin-ops')
var typeforce = require('typeforce')
var types = require('./types')
var scriptTypes = btemplates.types
var SIGNABLE = [btemplates.types.P2PKH, btemplates.types.P2PK, btemplates.types.MULTISIG]
var P2SH = SIGNABLE.concat([btemplates.types.P2WPKH, btemplates.types.P2WSH])

var ECPair = require('./ecpair')
var ECSignature = require('./ecsignature')
var Transaction = require('./transaction')

function supportedType (type) {
  return SIGNABLE.indexOf(type) !== -1
}

function supportedP2SHType (type) {
  return P2SH.indexOf(type) !== -1
}

function extractChunks (type, chunks, script) {
  var pubKeys = []
  var signatures = []
  switch (type) {
    case scriptTypes.P2PKH:
      // if (redeemScript) throw new Error('Nonstandard... P2SH(P2PKH)')
      pubKeys = chunks.slice(1)
      signatures = chunks.slice(0, 1)
      break

    case scriptTypes.P2PK:
      pubKeys[0] = script ? btemplates.pubKey.output.decode(script) : undefined
      signatures = chunks.slice(0, 1)
      break

    case scriptTypes.MULTISIG:
      if (script) {
        var multisig = btemplates.multisig.output.decode(script)
        pubKeys = multisig.pubKeys
      }

      signatures = chunks.slice(1).map(function (chunk) {
        return chunk.length === 0 ? undefined : chunk
      })
      break
  }

  return {
    pubKeys: pubKeys,
    signatures: signatures
  }
}
function expandInput (scriptSig, witnessStack) {
  if (scriptSig.length === 0 && witnessStack.length === 0) return {}

  var prevOutScript
  var prevOutType
  var scriptType
  var script
  var redeemScript
  var witnessScript
  var witnessScriptType
  var redeemScriptType
  var witness = false
  var p2wsh = false
  var p2sh = false
  var witnessProgram
  var chunks

  var scriptSigChunks = bscript.decompile(scriptSig)
  var sigType = btemplates.classifyInput(scriptSigChunks, true)
  if (sigType === scriptTypes.P2SH) {
    p2sh = true
    redeemScript = scriptSigChunks[scriptSigChunks.length - 1]
    redeemScriptType = btemplates.classifyOutput(redeemScript)
    prevOutScript = btemplates.scriptHash.output.encode(bcrypto.hash160(redeemScript))
    prevOutType = scriptTypes.P2SH
    script = redeemScript
  }

  var classifyWitness = btemplates.classifyWitness(witnessStack, true)
  if (classifyWitness === scriptTypes.P2WSH) {
    witnessScript = witnessStack[witnessStack.length - 1]
    witnessScriptType = btemplates.classifyOutput(witnessScript)
    p2wsh = true
    witness = true
    if (scriptSig.length === 0) {
      prevOutScript = btemplates.witnessScriptHash.output.encode(bcrypto.sha256(witnessScript))
      prevOutType = scriptTypes.P2WSH
      if (redeemScript !== undefined) {
        throw new Error('Redeem script given when unnecessary')
      }
      // bare witness
    } else {
      if (!redeemScript) {
        throw new Error('No redeemScript provided for P2WSH, but scriptSig non-empty')
      }
      witnessProgram = btemplates.witnessScriptHash.output.encode(bcrypto.sha256(witnessScript))
      if (!redeemScript.equals(witnessProgram)) {
        throw new Error('Redeem script didn\'t match witnessScript')
      }
    }

    if (!supportedType(btemplates.classifyOutput(witnessScript))) {
      throw new Error('unsupported witness script')
    }

    script = witnessScript
    scriptType = witnessScriptType
    chunks = witnessStack.slice(0, -1)
  } else if (classifyWitness === scriptTypes.P2WPKH) {
    witness = true
    var key = witnessStack[witnessStack.length - 1]
    var keyHash = bcrypto.hash160(key)
    if (scriptSig.length === 0) {
      prevOutScript = btemplates.witnessPubKeyHash.output.encode(keyHash)
      prevOutType = scriptTypes.P2WPKH
      if (typeof redeemScript !== 'undefined') {
        throw new Error('Redeem script given when unnecessary')
      }
    } else {
      if (!redeemScript) {
        throw new Error('No redeemScript provided for P2WPKH, but scriptSig wasn\'t empty')
      }
      witnessProgram = btemplates.witnessPubKeyHash.output.encode(keyHash)
      if (!redeemScript.equals(witnessProgram)) {
        throw new Error('Redeem script did not have the right witness program')
      }
    }

    scriptType = scriptTypes.P2PKH
    chunks = witnessStack
  } else if (redeemScript) {
    if (!supportedP2SHType(redeemScriptType)) {
      throw new Error('Bad redeemscript!')
    }

    script = redeemScript
    scriptType = redeemScriptType
    chunks = scriptSigChunks.slice(0, -1)
  } else {
    prevOutType = scriptType = btemplates.classifyInput(scriptSig)
    chunks = scriptSigChunks
  }

  var expanded = extractChunks(scriptType, chunks, script)

  var result = {
    pubKeys: expanded.pubKeys,
    signatures: expanded.signatures,
    prevOutScript: prevOutScript,
    prevOutType: prevOutType,
    signType: scriptType,
    signScript: script,
    witness: Boolean(witness)
  }

  if (p2sh) {
    result.redeemScript = redeemScript
    result.redeemScriptType = redeemScriptType
  }

  if (p2wsh) {
    result.witnessScript = witnessScript
    result.witnessScriptType = witnessScriptType
  }

  return result
}

// could be done in expandInput, but requires the original Transaction for hashForSignature
function fixMultisigOrder (input, transaction, vin) {
  if (input.redeemScriptType !== scriptTypes.MULTISIG || !input.redeemScript) return
  if (input.pubKeys.length === input.signatures.length) return

  var unmatched = input.signatures.concat()

  input.signatures = input.pubKeys.map(function (pubKey) {
    var keyPair = ECPair.fromPublicKeyBuffer(pubKey)
    var match

    // check for a signature
    unmatched.some(function (signature, i) {
      // skip if undefined || OP_0
      if (!signature) return false

      // TODO: avoid O(n) hashForSignature
      var parsed = ECSignature.parseScriptSignature(signature)
      var hash = transaction.hashForSignature(vin, input.redeemScript, parsed.hashType)

      // skip if signature does not match pubKey
      if (!keyPair.verify(hash, parsed.signature)) return false

      // remove matched signature from unmatched
      unmatched[i] = undefined
      match = signature

      return true
    })

    return match
  })
}

function expandOutput (script, scriptType, ourPubKey) {
  typeforce(types.Buffer, script)

  var scriptChunks = bscript.decompile(script)
  if (!scriptType) {
    scriptType = btemplates.classifyOutput(script)
  }

  var pubKeys = []

  switch (scriptType) {
    // does our hash160(pubKey) match the output scripts?
    case scriptTypes.P2PKH:
      if (!ourPubKey) break

      var pkh1 = scriptChunks[2]
      var pkh2 = bcrypto.hash160(ourPubKey)
      if (pkh1.equals(pkh2)) pubKeys = [ourPubKey]
      break

    // does our hash160(pubKey) match the output scripts?
    case scriptTypes.P2WPKH:
      if (!ourPubKey) break

      var wpkh1 = scriptChunks[1]
      var wpkh2 = bcrypto.hash160(ourPubKey)
      if (wpkh1.equals(wpkh2)) pubKeys = [ourPubKey]
      break

    case scriptTypes.P2PK:
      pubKeys = scriptChunks.slice(0, 1)
      break

    case scriptTypes.MULTISIG:
      pubKeys = scriptChunks.slice(1, -2)
      break

    default: return { scriptType: scriptType }
  }

  return {
    pubKeys: pubKeys,
    scriptType: scriptType,
    signatures: pubKeys.map(function () { return undefined })
  }
}

function checkP2SHInput (input, redeemScriptHash) {
  if (input.prevOutType) {
    if (input.prevOutType !== scriptTypes.P2SH) throw new Error('PrevOutScript must be P2SH')

    var prevOutScriptScriptHash = bscript.decompile(input.prevOutScript)[1]
    if (!prevOutScriptScriptHash.equals(redeemScriptHash)) throw new Error('Inconsistent hash160(RedeemScript)')
  }
}

function checkP2WSHInput (input, witnessScriptHash) {
  if (input.prevOutType) {
    if (input.prevOutType !== scriptTypes.P2WSH) throw new Error('PrevOutScript must be P2WSH')

    var scriptHash = bscript.decompile(input.prevOutScript)[1]
    if (!scriptHash.equals(witnessScriptHash)) throw new Error('Inconsistent sha25(WitnessScript)')
  }
}

function prepareInput (input, kpPubKey, redeemScript, witnessValue, witnessScript) {
  var expanded
  var prevOutType
  var prevOutScript

  var p2sh = false
  var p2shType
  var redeemScriptHash

  var witness = false
  var p2wsh = false
  var witnessType
  var witnessScriptHash

  var signType
  var signScript

  if (redeemScript && witnessScript) {
    redeemScriptHash = bcrypto.hash160(redeemScript)
    witnessScriptHash = bcrypto.sha256(witnessScript)
    checkP2SHInput(input, redeemScriptHash)

    if (!redeemScript.equals(btemplates.witnessScriptHash.output.encode(witnessScriptHash))) throw new Error('Witness script inconsistent with redeem script')

    expanded = expandOutput(witnessScript, undefined, kpPubKey)
    if (!expanded.pubKeys) throw new Error('WitnessScript not supported "' + bscript.toASM(redeemScript) + '"')

    prevOutType = btemplates.types.P2SH
    prevOutScript = btemplates.scriptHash.output.encode(redeemScriptHash)
    p2sh = witness = p2wsh = true
    p2shType = btemplates.types.P2WSH
    signType = witnessType = expanded.scriptType
    signScript = witnessScript
  } else if (redeemScript) {
    redeemScriptHash = bcrypto.hash160(redeemScript)
    checkP2SHInput(input, redeemScriptHash)

    expanded = expandOutput(redeemScript, undefined, kpPubKey)
    if (!expanded.pubKeys) throw new Error('RedeemScript not supported "' + bscript.toASM(redeemScript) + '"')

    prevOutType = btemplates.types.P2SH
    prevOutScript = btemplates.scriptHash.output.encode(redeemScriptHash)
    p2sh = true
    signType = p2shType = expanded.scriptType
    signScript = redeemScript
    witness = signType === btemplates.types.P2WPKH
  } else if (witnessScript) {
    witnessScriptHash = bcrypto.sha256(witnessScript)
    checkP2WSHInput(input, witnessScriptHash)

    expanded = expandOutput(witnessScript, undefined, kpPubKey)
    if (!expanded.pubKeys) throw new Error('WitnessScript not supported "' + bscript.toASM(redeemScript) + '"')

    prevOutType = btemplates.types.P2WSH
    prevOutScript = btemplates.witnessScriptHash.output.encode(witnessScriptHash)
    witness = p2wsh = true
    signType = witnessType = expanded.scriptType
    signScript = witnessScript
  } else if (input.prevOutType) {
    // embedded scripts are not possible without a redeemScript
    if (input.prevOutType === scriptTypes.P2SH ||
      input.prevOutType === scriptTypes.P2WSH) {
      throw new Error('PrevOutScript is ' + input.prevOutType + ', requires redeemScript')
    }

    prevOutType = input.prevOutType
    prevOutScript = input.prevOutScript
    expanded = expandOutput(input.prevOutScript, input.prevOutType, kpPubKey)
    if (!expanded.pubKeys) return

    witness = (input.prevOutType === scriptTypes.P2WPKH)
    signType = prevOutType
    signScript = prevOutScript
  } else {
    prevOutScript = btemplates.pubKeyHash.output.encode(bcrypto.hash160(kpPubKey))
    expanded = expandOutput(prevOutScript, scriptTypes.P2PKH, kpPubKey)

    prevOutType = scriptTypes.P2PKH
    witness = false
    signType = prevOutType
    signScript = prevOutScript
  }

  if (signType === scriptTypes.P2WPKH) {
    signScript = btemplates.pubKeyHash.output.encode(btemplates.witnessPubKeyHash.output.decode(signScript))
  }

  if (p2sh) {
    input.redeemScript = redeemScript
    input.redeemScriptType = p2shType
  }

  if (p2wsh) {
    input.witnessScript = witnessScript
    input.witnessScriptType = witnessType
  }

  input.pubKeys = expanded.pubKeys
  input.signatures = expanded.signatures
  input.signScript = signScript
  input.signType = signType
  input.prevOutScript = prevOutScript
  input.prevOutType = prevOutType
  input.witness = witness
}

function buildStack (type, signatures, pubKeys, allowIncomplete) {
  if (type === scriptTypes.P2PKH) {
    if (signatures.length === 1 && Buffer.isBuffer(signatures[0]) && pubKeys.length === 1) return btemplates.pubKeyHash.input.encodeStack(signatures[0], pubKeys[0])
  } else if (type === scriptTypes.P2PK) {
    if (signatures.length === 1 && Buffer.isBuffer(signatures[0])) return btemplates.pubKey.input.encodeStack(signatures[0])
  } else if (type === scriptTypes.MULTISIG) {
    if (signatures.length > 0) {
      signatures = signatures.map(function (signature) {
        return signature || ops.OP_0
      })
      if (!allowIncomplete) {
        // remove blank signatures
        signatures = signatures.filter(function (x) { return x !== ops.OP_0 })
      }

      return btemplates.multisig.input.encodeStack(signatures)
    }
  } else {
    throw new Error('Not yet supported')
  }

  if (!allowIncomplete) throw new Error('Not enough signatures provided')
  return []
}

function buildInput (input, allowIncomplete) {
  var scriptType = input.prevOutType
  var sig = []
  var witness = []

  if (supportedType(scriptType)) {
    sig = buildStack(scriptType, input.signatures, input.pubKeys, allowIncomplete)
  }

  var p2sh = false
  if (scriptType === btemplates.types.P2SH) {
    // We can remove this error later when we have a guarantee prepareInput
    // rejects unsignable scripts - it MUST be signable at this point.
    if (!allowIncomplete && !supportedP2SHType(input.redeemScriptType)) {
      throw new Error('Impossible to sign this type')
    }

    if (supportedType(input.redeemScriptType)) {
      sig = buildStack(input.redeemScriptType, input.signatures, input.pubKeys, allowIncomplete)
    }

    // If it wasn't SIGNABLE, it's witness, defer to that
    if (input.redeemScriptType) {
      p2sh = true
      scriptType = input.redeemScriptType
    }
  }

  switch (scriptType) {
    // P2WPKH is a special case of P2PKH
    case btemplates.types.P2WPKH:
      witness = buildStack(btemplates.types.P2PKH, input.signatures, input.pubKeys, allowIncomplete)
      break

    case btemplates.types.P2WSH:
      // We can remove this check later
      if (!allowIncomplete && !supportedType(input.witnessScriptType)) {
        throw new Error('Impossible to sign this type')
      }

      if (supportedType(input.witnessScriptType)) {
        witness = buildStack(input.witnessScriptType, input.signatures, input.pubKeys, allowIncomplete)
        witness.push(input.witnessScript)
        scriptType = input.witnessScriptType
      }

      break
  }

  // append redeemScript if necessary
  if (p2sh) {
    sig.push(input.redeemScript)
  }

  return {
    type: scriptType,
    script: bscript.compile(sig),
    witness: witness
  }
}

function TransactionBuilder (network, maximumFeeRate) {
  this.prevTxMap = {}
  this.network = network || networks.bitcoin

  // WARNING: This is __NOT__ to be relied on, its just another potential safety mechanism (safety in-depth)
  this.maximumFeeRate = maximumFeeRate || 2500

  this.inputs = []
  this.tx = new Transaction()
}

TransactionBuilder.prototype.setLockTime = function (locktime) {
  typeforce(types.UInt32, locktime)

  // if any signatures exist, throw
  if (this.inputs.some(function (input) {
    if (!input.signatures) return false

    return input.signatures.some(function (s) { return s })
  })) {
    throw new Error('No, this would invalidate signatures')
  }

  this.tx.locktime = locktime
}

TransactionBuilder.prototype.setVersion = function (version) {
  typeforce(types.UInt32, version)

  // XXX: this might eventually become more complex depending on what the versions represent
  this.tx.version = version
}

TransactionBuilder.fromTransaction = function (transaction, network) {
  var txb = new TransactionBuilder(network)

  // Copy transaction fields
  txb.setVersion(transaction.version)
  txb.setLockTime(transaction.locktime)

  // Copy outputs (done first to avoid signature invalidation)
  transaction.outs.forEach(function (txOut) {
    txb.addOutput(txOut.script, txOut.value)
  })

  // Copy inputs
  transaction.ins.forEach(function (txIn) {
    txb.__addInputUnsafe(txIn.hash, txIn.index, {
      sequence: txIn.sequence,
      script: txIn.script,
      witness: txIn.witness
    })
  })

  // fix some things not possible through the public API
  txb.inputs.forEach(function (input, i) {
    fixMultisigOrder(input, transaction, i)
  })

  return txb
}

TransactionBuilder.prototype.addInput = function (txHash, vout, sequence, prevOutScript) {
  if (!this.__canModifyInputs()) {
    throw new Error('No, this would invalidate signatures')
  }

  var value

  // is it a hex string?
  if (typeof txHash === 'string') {
    // transaction hashs's are displayed in reverse order, un-reverse it
    txHash = Buffer.from(txHash, 'hex').reverse()

  // is it a Transaction object?
  } else if (txHash instanceof Transaction) {
    var txOut = txHash.outs[vout]
    prevOutScript = txOut.script
    value = txOut.value

    txHash = txHash.getHash()
  }

  return this.__addInputUnsafe(txHash, vout, {
    sequence: sequence,
    prevOutScript: prevOutScript,
    value: value
  })
}

TransactionBuilder.prototype.__addInputUnsafe = function (txHash, vout, options) {
  if (Transaction.isCoinbaseHash(txHash)) {
    throw new Error('coinbase inputs not supported')
  }

  var prevTxOut = txHash.toString('hex') + ':' + vout
  if (this.prevTxMap[prevTxOut] !== undefined) throw new Error('Duplicate TxOut: ' + prevTxOut)

  var input = {}

  // derive what we can from the scriptSig
  if (options.script !== undefined) {
    input = expandInput(options.script, options.witness || [])
  }

  // if an input value was given, retain it
  if (options.value !== undefined) {
    input.value = options.value
  }

  // derive what we can from the previous transactions output script
  if (!input.prevOutScript && options.prevOutScript) {
    var prevOutType

    if (!input.pubKeys && !input.signatures) {
      var expanded = expandOutput(options.prevOutScript)

      if (expanded.pubKeys) {
        input.pubKeys = expanded.pubKeys
        input.signatures = expanded.signatures
      }

      prevOutType = expanded.scriptType
    }

    input.prevOutScript = options.prevOutScript
    input.prevOutType = prevOutType || btemplates.classifyOutput(options.prevOutScript)
  }

  var vin = this.tx.addInput(txHash, vout, options.sequence, options.scriptSig)
  this.inputs[vin] = input
  this.prevTxMap[prevTxOut] = vin
  return vin
}

TransactionBuilder.prototype.addOutput = function (scriptPubKey, value) {
  if (!this.__canModifyOutputs()) {
    throw new Error('No, this would invalidate signatures')
  }

  // Attempt to get a script if it's a base58 address string
  if (typeof scriptPubKey === 'string') {
    scriptPubKey = baddress.toOutputScript(scriptPubKey, this.network)
  }

  return this.tx.addOutput(scriptPubKey, value)
}

TransactionBuilder.prototype.build = function () {
  return this.__build(false)
}
TransactionBuilder.prototype.buildIncomplete = function () {
  return this.__build(true)
}

TransactionBuilder.prototype.__build = function (allowIncomplete) {
  if (!allowIncomplete) {
    if (!this.tx.ins.length) throw new Error('Transaction has no inputs')
    if (!this.tx.outs.length) throw new Error('Transaction has no outputs')
  }

  var tx = this.tx.clone()
  // Create script signatures from inputs
  this.inputs.forEach(function (input, i) {
    var scriptType = input.witnessScriptType || input.redeemScriptType || input.prevOutType
    if (!scriptType && !allowIncomplete) throw new Error('Transaction is not complete')
    var result = buildInput(input, allowIncomplete)

    // skip if no result
    if (!allowIncomplete) {
      if (!supportedType(result.type) && result.type !== btemplates.types.P2WPKH) {
        throw new Error(result.type + ' not supported')
      }
    }

    tx.setInputScript(i, result.script)
    tx.setWitness(i, result.witness)
  })

  if (!allowIncomplete) {
    // do not rely on this, its merely a last resort
    if (this.__overMaximumFees(tx.virtualSize())) {
      throw new Error('Transaction has absurd fees')
    }
  }

  return tx
}

function canSign (input) {
  return input.prevOutScript !== undefined &&
    input.signScript !== undefined &&
    input.pubKeys !== undefined &&
    input.signatures !== undefined &&
    input.signatures.length === input.pubKeys.length &&
    input.pubKeys.length > 0 &&
    (
      input.witness === false ||
      (input.witness === true && input.value !== undefined)
    )
}

TransactionBuilder.prototype.sign = function (vin, keyPair, redeemScript, hashType, witnessValue, witnessScript) {
  // TODO: remove keyPair.network matching in 4.0.0
  if (keyPair.network && keyPair.network !== this.network) throw new TypeError('Inconsistent network')
  if (!this.inputs[vin]) throw new Error('No input at index: ' + vin)
  hashType = hashType || Transaction.SIGHASH_ALL

  var input = this.inputs[vin]

  // if redeemScript was previously provided, enforce consistency
  if (input.redeemScript !== undefined &&
      redeemScript &&
      !input.redeemScript.equals(redeemScript)) {
    throw new Error('Inconsistent redeemScript')
  }

  var kpPubKey = keyPair.publicKey || keyPair.getPublicKeyBuffer()
  if (!canSign(input)) {
    if (witnessValue !== undefined) {
      if (input.value !== undefined && input.value !== witnessValue) throw new Error('Input didn\'t match witnessValue')
      typeforce(types.Satoshi, witnessValue)
      input.value = witnessValue
    }

    if (!canSign(input)) prepareInput(input, kpPubKey, redeemScript, witnessValue, witnessScript)
    if (!canSign(input)) throw Error(input.prevOutType + ' not supported')
  }

  // ready to sign
  var signatureHash
  if (input.witness) {
    signatureHash = this.tx.hashForWitnessV0(vin, input.signScript, input.value, hashType)
  } else {
    signatureHash = this.tx.hashForSignature(vin, input.signScript, hashType)
  }

  // enforce in order signing of public keys
  var signed = input.pubKeys.some(function (pubKey, i) {
    if (!kpPubKey.equals(pubKey)) return false
    if (input.signatures[i]) throw new Error('Signature already exists')
    if (kpPubKey.length !== 33 &&
      input.signType === scriptTypes.P2WPKH) throw new Error('BIP143 rejects uncompressed public keys in P2WPKH or P2WSH')

    var signature = keyPair.sign(signatureHash)
    if (Buffer.isBuffer(signature)) signature = ECSignature.fromRSBuffer(signature)

    input.signatures[i] = signature.toScriptSignature(hashType)
    return true
  })

  if (!signed) throw new Error('Key pair cannot sign for this input')
}

function signatureHashType (buffer) {
  return buffer.readUInt8(buffer.length - 1)
}

TransactionBuilder.prototype.__canModifyInputs = function () {
  return this.inputs.every(function (input) {
    // any signatures?
    if (input.signatures === undefined) return true

    return input.signatures.every(function (signature) {
      if (!signature) return true
      var hashType = signatureHashType(signature)

      // if SIGHASH_ANYONECANPAY is set, signatures would not
      // be invalidated by more inputs
      return hashType & Transaction.SIGHASH_ANYONECANPAY
    })
  })
}

TransactionBuilder.prototype.__canModifyOutputs = function () {
  var nInputs = this.tx.ins.length
  var nOutputs = this.tx.outs.length

  return this.inputs.every(function (input) {
    if (input.signatures === undefined) return true

    return input.signatures.every(function (signature) {
      if (!signature) return true
      var hashType = signatureHashType(signature)

      var hashTypeMod = hashType & 0x1f
      if (hashTypeMod === Transaction.SIGHASH_NONE) return true
      if (hashTypeMod === Transaction.SIGHASH_SINGLE) {
        // if SIGHASH_SINGLE is set, and nInputs > nOutputs
        // some signatures would be invalidated by the addition
        // of more outputs
        return nInputs <= nOutputs
      }
    })
  })
}

TransactionBuilder.prototype.__overMaximumFees = function (bytes) {
  // not all inputs will have .value defined
  var incoming = this.inputs.reduce(function (a, x) { return a + (x.value >>> 0) }, 0)

  // but all outputs do, and if we have any input value
  // we can immediately determine if the outputs are too small
  var outgoing = this.tx.outs.reduce(function (a, x) { return a + x.value }, 0)
  var fee = incoming - outgoing
  var feeRate = fee / bytes

  return feeRate > this.maximumFeeRate
}

module.exports = TransactionBuilder

},{"./address":44,"./crypto":47,"./ecpair":49,"./ecsignature":50,"./networks":53,"./script":54,"./templates":56,"./transaction":78,"./types":80,"bitcoin-ops":42,"safe-buffer":101,"typeforce":112}],80:[function(require,module,exports){
var typeforce = require('typeforce')

var UINT31_MAX = Math.pow(2, 31) - 1
function UInt31 (value) {
  return typeforce.UInt32(value) && value <= UINT31_MAX
}

function BIP32Path (value) {
  return typeforce.String(value) && value.match(/^(m\/)?(\d+'?\/)*\d+'?$/)
}
BIP32Path.toJSON = function () { return 'BIP32 derivation path' }

var SATOSHI_MAX = 21 * 1e14
function Satoshi (value) {
  return typeforce.UInt53(value) && value <= SATOSHI_MAX
}

// external dependent types
var BigInt = typeforce.quacksLike('BigInteger')
var ECPoint = typeforce.quacksLike('Point')

// exposed, external API
var ECSignature = typeforce.compile({ r: BigInt, s: BigInt })
var Network = typeforce.compile({
  messagePrefix: typeforce.oneOf(typeforce.Buffer, typeforce.String),
  bip32: {
    public: typeforce.UInt32,
    private: typeforce.UInt32
  },
  pubKeyHash: typeforce.oneOf(typeforce.UInt8, typeforce.UInt16),
  scriptHash: typeforce.oneOf(typeforce.UInt8, typeforce.UInt16),
  wif: typeforce.UInt8
})

// extend typeforce types with ours
var types = {
  BigInt: BigInt,
  BIP32Path: BIP32Path,
  Buffer256bit: typeforce.BufferN(32),
  ECPoint: ECPoint,
  ECSignature: ECSignature,
  Hash160bit: typeforce.BufferN(20),
  Hash256bit: typeforce.BufferN(32),
  Network: Network,
  Satoshi: Satoshi,
  UInt31: UInt31
}

for (var typeName in typeforce) {
  types[typeName] = typeforce[typeName]
}

module.exports = types

},{"typeforce":112}],81:[function(require,module,exports){
var basex = require('base-x')
var ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

module.exports = basex(ALPHABET)

},{"base-x":35}],82:[function(require,module,exports){
'use strict'

var base58 = require('bs58')
var Buffer = require('safe-buffer').Buffer

module.exports = function (checksumFn) {
  // Encode a buffer as a base58-check encoded string
  function encode (payload) {
    var checksum = checksumFn(payload)

    return base58.encode(Buffer.concat([
      payload,
      checksum
    ], payload.length + 4))
  }

  function decodeRaw (buffer) {
    var payload = buffer.slice(0, -4)
    var checksum = buffer.slice(-4)
    var newChecksum = checksumFn(payload)

    if (checksum[0] ^ newChecksum[0] |
        checksum[1] ^ newChecksum[1] |
        checksum[2] ^ newChecksum[2] |
        checksum[3] ^ newChecksum[3]) return

    return payload
  }

  // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
  function decodeUnsafe (string) {
    var buffer = base58.decodeUnsafe(string)
    if (!buffer) return

    return decodeRaw(buffer)
  }

  function decode (string) {
    var buffer = base58.decode(string)
    var payload = decodeRaw(buffer, checksumFn)
    if (!payload) throw new Error('Invalid checksum')
    return payload
  }

  return {
    encode: encode,
    decode: decode,
    decodeUnsafe: decodeUnsafe
  }
}

},{"bs58":81,"safe-buffer":101}],83:[function(require,module,exports){
'use strict'

var createHash = require('create-hash')
var bs58checkBase = require('./base')

// SHA256(SHA256(buffer))
function sha256x2 (buffer) {
  var tmp = createHash('sha256').update(buffer).digest()
  return createHash('sha256').update(tmp).digest()
}

module.exports = bs58checkBase(sha256x2)

},{"./base":82,"create-hash":85}],84:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer
var Transform = require('stream').Transform
var StringDecoder = require('string_decoder').StringDecoder
var inherits = require('inherits')

function CipherBase (hashMode) {
  Transform.call(this)
  this.hashMode = typeof hashMode === 'string'
  if (this.hashMode) {
    this[hashMode] = this._finalOrDigest
  } else {
    this.final = this._finalOrDigest
  }
  if (this._final) {
    this.__final = this._final
    this._final = null
  }
  this._decoder = null
  this._encoding = null
}
inherits(CipherBase, Transform)

CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
  if (typeof data === 'string') {
    data = Buffer.from(data, inputEnc)
  }

  var outData = this._update(data)
  if (this.hashMode) return this

  if (outputEnc) {
    outData = this._toString(outData, outputEnc)
  }

  return outData
}

CipherBase.prototype.setAutoPadding = function () {}
CipherBase.prototype.getAuthTag = function () {
  throw new Error('trying to get auth tag in unsupported state')
}

CipherBase.prototype.setAuthTag = function () {
  throw new Error('trying to set auth tag in unsupported state')
}

CipherBase.prototype.setAAD = function () {
  throw new Error('trying to set aad in unsupported state')
}

CipherBase.prototype._transform = function (data, _, next) {
  var err
  try {
    if (this.hashMode) {
      this._update(data)
    } else {
      this.push(this._update(data))
    }
  } catch (e) {
    err = e
  } finally {
    next(err)
  }
}
CipherBase.prototype._flush = function (done) {
  var err
  try {
    this.push(this.__final())
  } catch (e) {
    err = e
  }

  done(err)
}
CipherBase.prototype._finalOrDigest = function (outputEnc) {
  var outData = this.__final() || Buffer.alloc(0)
  if (outputEnc) {
    outData = this._toString(outData, outputEnc, true)
  }
  return outData
}

CipherBase.prototype._toString = function (value, enc, fin) {
  if (!this._decoder) {
    this._decoder = new StringDecoder(enc)
    this._encoding = enc
  }

  if (this._encoding !== enc) throw new Error('can\'t switch encodings')

  var out = this._decoder.write(value)
  if (fin) {
    out += this._decoder.end()
  }

  return out
}

module.exports = CipherBase

},{"inherits":96,"safe-buffer":101,"stream":28,"string_decoder":29}],85:[function(require,module,exports){
(function (Buffer){
'use strict'
var inherits = require('inherits')
var md5 = require('./md5')
var RIPEMD160 = require('ripemd160')
var sha = require('sha.js')

var Base = require('cipher-base')

function HashNoConstructor (hash) {
  Base.call(this, 'digest')

  this._hash = hash
  this.buffers = []
}

inherits(HashNoConstructor, Base)

HashNoConstructor.prototype._update = function (data) {
  this.buffers.push(data)
}

HashNoConstructor.prototype._final = function () {
  var buf = Buffer.concat(this.buffers)
  var r = this._hash(buf)
  this.buffers = null

  return r
}

function Hash (hash) {
  Base.call(this, 'digest')

  this._hash = hash
}

inherits(Hash, Base)

Hash.prototype._update = function (data) {
  this._hash.update(data)
}

Hash.prototype._final = function () {
  return this._hash.digest()
}

module.exports = function createHash (alg) {
  alg = alg.toLowerCase()
  if (alg === 'md5') return new HashNoConstructor(md5)
  if (alg === 'rmd160' || alg === 'ripemd160') return new Hash(new RIPEMD160())

  return new Hash(sha(alg))
}

}).call(this,require("buffer").Buffer)
},{"./md5":87,"buffer":5,"cipher-base":84,"inherits":96,"ripemd160":100,"sha.js":103}],86:[function(require,module,exports){
(function (Buffer){
'use strict'
var intSize = 4
var zeroBuffer = new Buffer(intSize)
zeroBuffer.fill(0)

var charSize = 8
var hashSize = 16

function toArray (buf) {
  if ((buf.length % intSize) !== 0) {
    var len = buf.length + (intSize - (buf.length % intSize))
    buf = Buffer.concat([buf, zeroBuffer], len)
  }

  var arr = new Array(buf.length >>> 2)
  for (var i = 0, j = 0; i < buf.length; i += intSize, j++) {
    arr[j] = buf.readInt32LE(i)
  }

  return arr
}

module.exports = function hash (buf, fn) {
  var arr = fn(toArray(buf), buf.length * charSize)
  buf = new Buffer(hashSize)
  for (var i = 0; i < arr.length; i++) {
    buf.writeInt32LE(arr[i], i << 2, true)
  }
  return buf
}

}).call(this,require("buffer").Buffer)
},{"buffer":5}],87:[function(require,module,exports){
'use strict'
/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.1 Copyright (C) Paul Johnston 1999 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

var makeHash = require('./make-hash')

/*
 * Calculate the MD5 of an array of little-endian words, and a bit length
 */
function core_md5 (x, len) {
  /* append padding */
  x[len >> 5] |= 0x80 << ((len) % 32)
  x[(((len + 64) >>> 9) << 4) + 14] = len

  var a = 1732584193
  var b = -271733879
  var c = -1732584194
  var d = 271733878

  for (var i = 0; i < x.length; i += 16) {
    var olda = a
    var oldb = b
    var oldc = c
    var oldd = d

    a = md5_ff(a, b, c, d, x[i + 0], 7, -680876936)
    d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
    c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
    b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
    a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
    d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
    c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
    b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
    a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
    d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
    c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
    b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
    a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
    d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
    c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
    b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

    a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
    d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
    c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
    b = md5_gg(b, c, d, a, x[i + 0], 20, -373897302)
    a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
    d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
    c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
    b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
    a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
    d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
    c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
    b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
    a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
    d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
    c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
    b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

    a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
    d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
    c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
    b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
    a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
    d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
    c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
    b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
    a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
    d = md5_hh(d, a, b, c, x[i + 0], 11, -358537222)
    c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
    b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
    a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
    d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
    c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
    b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

    a = md5_ii(a, b, c, d, x[i + 0], 6, -198630844)
    d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
    c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
    b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
    a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
    d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
    c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
    b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
    a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
    d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
    c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
    b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
    a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
    d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
    c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
    b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

    a = safe_add(a, olda)
    b = safe_add(b, oldb)
    c = safe_add(c, oldc)
    d = safe_add(d, oldd)
  }

  return [a, b, c, d]
}

/*
 * These functions implement the four basic operations the algorithm uses.
 */
function md5_cmn (q, a, b, x, s, t) {
  return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
}

function md5_ff (a, b, c, d, x, s, t) {
  return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
}

function md5_gg (a, b, c, d, x, s, t) {
  return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
}

function md5_hh (a, b, c, d, x, s, t) {
  return md5_cmn(b ^ c ^ d, a, b, x, s, t)
}

function md5_ii (a, b, c, d, x, s, t) {
  return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function safe_add (x, y) {
  var lsw = (x & 0xFFFF) + (y & 0xFFFF)
  var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
  return (msw << 16) | (lsw & 0xFFFF)
}

/*
 * Bitwise rotate a 32-bit number to the left.
 */
function bit_rol (num, cnt) {
  return (num << cnt) | (num >>> (32 - cnt))
}

module.exports = function md5 (buf) {
  return makeHash(buf, core_md5)
}

},{"./make-hash":86}],88:[function(require,module,exports){
'use strict'
var inherits = require('inherits')
var Legacy = require('./legacy')
var Base = require('cipher-base')
var Buffer = require('safe-buffer').Buffer
var md5 = require('create-hash/md5')
var RIPEMD160 = require('ripemd160')

var sha = require('sha.js')

var ZEROS = Buffer.alloc(128)

function Hmac (alg, key) {
  Base.call(this, 'digest')
  if (typeof key === 'string') {
    key = Buffer.from(key)
  }

  var blocksize = (alg === 'sha512' || alg === 'sha384') ? 128 : 64

  this._alg = alg
  this._key = key
  if (key.length > blocksize) {
    var hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
    key = hash.update(key).digest()
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = this._ipad = Buffer.allocUnsafe(blocksize)
  var opad = this._opad = Buffer.allocUnsafe(blocksize)

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }
  this._hash = alg === 'rmd160' ? new RIPEMD160() : sha(alg)
  this._hash.update(ipad)
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.update(data)
}

Hmac.prototype._final = function () {
  var h = this._hash.digest()
  var hash = this._alg === 'rmd160' ? new RIPEMD160() : sha(this._alg)
  return hash.update(this._opad).update(h).digest()
}

module.exports = function createHmac (alg, key) {
  alg = alg.toLowerCase()
  if (alg === 'rmd160' || alg === 'ripemd160') {
    return new Hmac('rmd160', key)
  }
  if (alg === 'md5') {
    return new Legacy(md5, key)
  }
  return new Hmac(alg, key)
}

},{"./legacy":89,"cipher-base":84,"create-hash/md5":87,"inherits":96,"ripemd160":100,"safe-buffer":101,"sha.js":103}],89:[function(require,module,exports){
'use strict'
var inherits = require('inherits')
var Buffer = require('safe-buffer').Buffer

var Base = require('cipher-base')

var ZEROS = Buffer.alloc(128)
var blocksize = 64

function Hmac (alg, key) {
  Base.call(this, 'digest')
  if (typeof key === 'string') {
    key = Buffer.from(key)
  }

  this._alg = alg
  this._key = key

  if (key.length > blocksize) {
    key = alg(key)
  } else if (key.length < blocksize) {
    key = Buffer.concat([key, ZEROS], blocksize)
  }

  var ipad = this._ipad = Buffer.allocUnsafe(blocksize)
  var opad = this._opad = Buffer.allocUnsafe(blocksize)

  for (var i = 0; i < blocksize; i++) {
    ipad[i] = key[i] ^ 0x36
    opad[i] = key[i] ^ 0x5C
  }

  this._hash = [ipad]
}

inherits(Hmac, Base)

Hmac.prototype._update = function (data) {
  this._hash.push(data)
}

Hmac.prototype._final = function () {
  var h = this._alg(Buffer.concat(this._hash))
  return this._alg(Buffer.concat([this._opad, h]))
}
module.exports = Hmac

},{"cipher-base":84,"inherits":96,"safe-buffer":101}],90:[function(require,module,exports){
var assert = require('assert')
var BigInteger = require('bigi')

var Point = require('./point')

function Curve (p, a, b, Gx, Gy, n, h) {
  this.p = p
  this.a = a
  this.b = b
  this.G = Point.fromAffine(this, Gx, Gy)
  this.n = n
  this.h = h

  this.infinity = new Point(this, null, null, BigInteger.ZERO)

  // result caching
  this.pOverFour = p.add(BigInteger.ONE).shiftRight(2)

  // determine size of p in bytes
  this.pLength = Math.floor((this.p.bitLength() + 7) / 8)
}

Curve.prototype.pointFromX = function (isOdd, x) {
  var alpha = x.pow(3).add(this.a.multiply(x)).add(this.b).mod(this.p)
  var beta = alpha.modPow(this.pOverFour, this.p) // XXX: not compatible with all curves

  var y = beta
  if (beta.isEven() ^ !isOdd) {
    y = this.p.subtract(y) // -y % p
  }

  return Point.fromAffine(this, x, y)
}

Curve.prototype.isInfinity = function (Q) {
  if (Q === this.infinity) return true

  return Q.z.signum() === 0 && Q.y.signum() !== 0
}

Curve.prototype.isOnCurve = function (Q) {
  if (this.isInfinity(Q)) return true

  var x = Q.affineX
  var y = Q.affineY
  var a = this.a
  var b = this.b
  var p = this.p

  // Check that xQ and yQ are integers in the interval [0, p - 1]
  if (x.signum() < 0 || x.compareTo(p) >= 0) return false
  if (y.signum() < 0 || y.compareTo(p) >= 0) return false

  // and check that y^2 = x^3 + ax + b (mod p)
  var lhs = y.square().mod(p)
  var rhs = x.pow(3).add(a.multiply(x)).add(b).mod(p)
  return lhs.equals(rhs)
}

/**
 * Validate an elliptic curve point.
 *
 * See SEC 1, section 3.2.2.1: Elliptic Curve Public Key Validation Primitive
 */
Curve.prototype.validate = function (Q) {
  // Check Q != O
  assert(!this.isInfinity(Q), 'Point is at infinity')
  assert(this.isOnCurve(Q), 'Point is not on the curve')

  // Check nQ = O (where Q is a scalar multiple of G)
  var nQ = Q.multiply(this.n)
  assert(this.isInfinity(nQ), 'Point is not a scalar multiple of G')

  return true
}

module.exports = Curve

},{"./point":94,"assert":1,"bigi":39}],91:[function(require,module,exports){
module.exports={
  "secp128r1": {
    "p": "fffffffdffffffffffffffffffffffff",
    "a": "fffffffdfffffffffffffffffffffffc",
    "b": "e87579c11079f43dd824993c2cee5ed3",
    "n": "fffffffe0000000075a30d1b9038a115",
    "h": "01",
    "Gx": "161ff7528b899b2d0c28607ca52c5b86",
    "Gy": "cf5ac8395bafeb13c02da292dded7a83"
  },
  "secp160k1": {
    "p": "fffffffffffffffffffffffffffffffeffffac73",
    "a": "00",
    "b": "07",
    "n": "0100000000000000000001b8fa16dfab9aca16b6b3",
    "h": "01",
    "Gx": "3b4c382ce37aa192a4019e763036f4f5dd4d7ebb",
    "Gy": "938cf935318fdced6bc28286531733c3f03c4fee"
  },
  "secp160r1": {
    "p": "ffffffffffffffffffffffffffffffff7fffffff",
    "a": "ffffffffffffffffffffffffffffffff7ffffffc",
    "b": "1c97befc54bd7a8b65acf89f81d4d4adc565fa45",
    "n": "0100000000000000000001f4c8f927aed3ca752257",
    "h": "01",
    "Gx": "4a96b5688ef573284664698968c38bb913cbfc82",
    "Gy": "23a628553168947d59dcc912042351377ac5fb32"
  },
  "secp192k1": {
    "p": "fffffffffffffffffffffffffffffffffffffffeffffee37",
    "a": "00",
    "b": "03",
    "n": "fffffffffffffffffffffffe26f2fc170f69466a74defd8d",
    "h": "01",
    "Gx": "db4ff10ec057e9ae26b07d0280b7f4341da5d1b1eae06c7d",
    "Gy": "9b2f2f6d9c5628a7844163d015be86344082aa88d95e2f9d"
  },
  "secp192r1": {
    "p": "fffffffffffffffffffffffffffffffeffffffffffffffff",
    "a": "fffffffffffffffffffffffffffffffefffffffffffffffc",
    "b": "64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1",
    "n": "ffffffffffffffffffffffff99def836146bc9b1b4d22831",
    "h": "01",
    "Gx": "188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012",
    "Gy": "07192b95ffc8da78631011ed6b24cdd573f977a11e794811"
  },
  "secp256k1": {
    "p": "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
    "a": "00",
    "b": "07",
    "n": "fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141",
    "h": "01",
    "Gx": "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    "Gy": "483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8"
  },
  "secp256r1": {
    "p": "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
    "a": "ffffffff00000001000000000000000000000000fffffffffffffffffffffffc",
    "b": "5ac635d8aa3a93e7b3ebbd55769886bc651d06b0cc53b0f63bce3c3e27d2604b",
    "n": "ffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551",
    "h": "01",
    "Gx": "6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296",
    "Gy": "4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5"
  }
}

},{}],92:[function(require,module,exports){
var Point = require('./point')
var Curve = require('./curve')

var getCurveByName = require('./names')

module.exports = {
  Curve: Curve,
  Point: Point,
  getCurveByName: getCurveByName
}

},{"./curve":90,"./names":93,"./point":94}],93:[function(require,module,exports){
var BigInteger = require('bigi')

var curves = require('./curves.json')
var Curve = require('./curve')

function getCurveByName (name) {
  var curve = curves[name]
  if (!curve) return null

  var p = new BigInteger(curve.p, 16)
  var a = new BigInteger(curve.a, 16)
  var b = new BigInteger(curve.b, 16)
  var n = new BigInteger(curve.n, 16)
  var h = new BigInteger(curve.h, 16)
  var Gx = new BigInteger(curve.Gx, 16)
  var Gy = new BigInteger(curve.Gy, 16)

  return new Curve(p, a, b, Gx, Gy, n, h)
}

module.exports = getCurveByName

},{"./curve":90,"./curves.json":91,"bigi":39}],94:[function(require,module,exports){
var assert = require('assert')
var Buffer = require('safe-buffer').Buffer
var BigInteger = require('bigi')

var THREE = BigInteger.valueOf(3)

function Point (curve, x, y, z) {
  assert.notStrictEqual(z, undefined, 'Missing Z coordinate')

  this.curve = curve
  this.x = x
  this.y = y
  this.z = z
  this._zInv = null

  this.compressed = true
}

Object.defineProperty(Point.prototype, 'zInv', {
  get: function () {
    if (this._zInv === null) {
      this._zInv = this.z.modInverse(this.curve.p)
    }

    return this._zInv
  }
})

Object.defineProperty(Point.prototype, 'affineX', {
  get: function () {
    return this.x.multiply(this.zInv).mod(this.curve.p)
  }
})

Object.defineProperty(Point.prototype, 'affineY', {
  get: function () {
    return this.y.multiply(this.zInv).mod(this.curve.p)
  }
})

Point.fromAffine = function (curve, x, y) {
  return new Point(curve, x, y, BigInteger.ONE)
}

Point.prototype.equals = function (other) {
  if (other === this) return true
  if (this.curve.isInfinity(this)) return this.curve.isInfinity(other)
  if (this.curve.isInfinity(other)) return this.curve.isInfinity(this)

  // u = Y2 * Z1 - Y1 * Z2
  var u = other.y.multiply(this.z).subtract(this.y.multiply(other.z)).mod(this.curve.p)

  if (u.signum() !== 0) return false

  // v = X2 * Z1 - X1 * Z2
  var v = other.x.multiply(this.z).subtract(this.x.multiply(other.z)).mod(this.curve.p)

  return v.signum() === 0
}

Point.prototype.negate = function () {
  var y = this.curve.p.subtract(this.y)

  return new Point(this.curve, this.x, y, this.z)
}

Point.prototype.add = function (b) {
  if (this.curve.isInfinity(this)) return b
  if (this.curve.isInfinity(b)) return this

  var x1 = this.x
  var y1 = this.y
  var x2 = b.x
  var y2 = b.y

  // u = Y2 * Z1 - Y1 * Z2
  var u = y2.multiply(this.z).subtract(y1.multiply(b.z)).mod(this.curve.p)
  // v = X2 * Z1 - X1 * Z2
  var v = x2.multiply(this.z).subtract(x1.multiply(b.z)).mod(this.curve.p)

  if (v.signum() === 0) {
    if (u.signum() === 0) {
      return this.twice() // this == b, so double
    }

    return this.curve.infinity // this = -b, so infinity
  }

  var v2 = v.square()
  var v3 = v2.multiply(v)
  var x1v2 = x1.multiply(v2)
  var zu2 = u.square().multiply(this.z)

  // x3 = v * (z2 * (z1 * u^2 - 2 * x1 * v^2) - v^3)
  var x3 = zu2.subtract(x1v2.shiftLeft(1)).multiply(b.z).subtract(v3).multiply(v).mod(this.curve.p)
  // y3 = z2 * (3 * x1 * u * v^2 - y1 * v^3 - z1 * u^3) + u * v^3
  var y3 = x1v2.multiply(THREE).multiply(u).subtract(y1.multiply(v3)).subtract(zu2.multiply(u)).multiply(b.z).add(u.multiply(v3)).mod(this.curve.p)
  // z3 = v^3 * z1 * z2
  var z3 = v3.multiply(this.z).multiply(b.z).mod(this.curve.p)

  return new Point(this.curve, x3, y3, z3)
}

Point.prototype.twice = function () {
  if (this.curve.isInfinity(this)) return this
  if (this.y.signum() === 0) return this.curve.infinity

  var x1 = this.x
  var y1 = this.y

  var y1z1 = y1.multiply(this.z).mod(this.curve.p)
  var y1sqz1 = y1z1.multiply(y1).mod(this.curve.p)
  var a = this.curve.a

  // w = 3 * x1^2 + a * z1^2
  var w = x1.square().multiply(THREE)

  if (a.signum() !== 0) {
    w = w.add(this.z.square().multiply(a))
  }

  w = w.mod(this.curve.p)
  // x3 = 2 * y1 * z1 * (w^2 - 8 * x1 * y1^2 * z1)
  var x3 = w.square().subtract(x1.shiftLeft(3).multiply(y1sqz1)).shiftLeft(1).multiply(y1z1).mod(this.curve.p)
  // y3 = 4 * y1^2 * z1 * (3 * w * x1 - 2 * y1^2 * z1) - w^3
  var y3 = w.multiply(THREE).multiply(x1).subtract(y1sqz1.shiftLeft(1)).shiftLeft(2).multiply(y1sqz1).subtract(w.pow(3)).mod(this.curve.p)
  // z3 = 8 * (y1 * z1)^3
  var z3 = y1z1.pow(3).shiftLeft(3).mod(this.curve.p)

  return new Point(this.curve, x3, y3, z3)
}

// Simple NAF (Non-Adjacent Form) multiplication algorithm
// TODO: modularize the multiplication algorithm
Point.prototype.multiply = function (k) {
  if (this.curve.isInfinity(this)) return this
  if (k.signum() === 0) return this.curve.infinity

  var e = k
  var h = e.multiply(THREE)

  var neg = this.negate()
  var R = this

  for (var i = h.bitLength() - 2; i > 0; --i) {
    var hBit = h.testBit(i)
    var eBit = e.testBit(i)

    R = R.twice()

    if (hBit !== eBit) {
      R = R.add(hBit ? this : neg)
    }
  }

  return R
}

// Compute this*j + x*k (simultaneous multiplication)
Point.prototype.multiplyTwo = function (j, x, k) {
  var i = Math.max(j.bitLength(), k.bitLength()) - 1
  var R = this.curve.infinity
  var both = this.add(x)

  while (i >= 0) {
    var jBit = j.testBit(i)
    var kBit = k.testBit(i)

    R = R.twice()

    if (jBit) {
      if (kBit) {
        R = R.add(both)
      } else {
        R = R.add(this)
      }
    } else if (kBit) {
      R = R.add(x)
    }
    --i
  }

  return R
}

Point.prototype.getEncoded = function (compressed) {
  if (compressed == null) compressed = this.compressed
  if (this.curve.isInfinity(this)) return Buffer.alloc(1, 0) // Infinity point encoded is simply '00'

  var x = this.affineX
  var y = this.affineY
  var byteLength = this.curve.pLength
  var buffer

  // 0x02/0x03 | X
  if (compressed) {
    buffer = Buffer.allocUnsafe(1 + byteLength)
    buffer.writeUInt8(y.isEven() ? 0x02 : 0x03, 0)

  // 0x04 | X | Y
  } else {
    buffer = Buffer.allocUnsafe(1 + byteLength + byteLength)
    buffer.writeUInt8(0x04, 0)

    y.toBuffer(byteLength).copy(buffer, 1 + byteLength)
  }

  x.toBuffer(byteLength).copy(buffer, 1)

  return buffer
}

Point.decodeFrom = function (curve, buffer) {
  var type = buffer.readUInt8(0)
  var compressed = (type !== 4)

  var byteLength = Math.floor((curve.p.bitLength() + 7) / 8)
  var x = BigInteger.fromBuffer(buffer.slice(1, 1 + byteLength))

  var Q
  if (compressed) {
    assert.equal(buffer.length, byteLength + 1, 'Invalid sequence length')
    assert(type === 0x02 || type === 0x03, 'Invalid sequence tag')

    var isOdd = (type === 0x03)
    Q = curve.pointFromX(isOdd, x)
  } else {
    assert.equal(buffer.length, 1 + byteLength + byteLength, 'Invalid sequence length')

    var y = BigInteger.fromBuffer(buffer.slice(1 + byteLength))
    Q = Point.fromAffine(curve, x, y)
  }

  Q.compressed = compressed
  return Q
}

Point.prototype.toString = function () {
  if (this.curve.isInfinity(this)) return '(INFINITY)'

  return '(' + this.affineX.toString() + ',' + this.affineY.toString() + ')'
}

module.exports = Point

},{"assert":1,"bigi":39,"safe-buffer":101}],95:[function(require,module,exports){
(function (Buffer){
'use strict'
var Transform = require('stream').Transform
var inherits = require('inherits')

function HashBase (blockSize) {
  Transform.call(this)

  this._block = new Buffer(blockSize)
  this._blockSize = blockSize
  this._blockOffset = 0
  this._length = [0, 0, 0, 0]

  this._finalized = false
}

inherits(HashBase, Transform)

HashBase.prototype._transform = function (chunk, encoding, callback) {
  var error = null
  try {
    if (encoding !== 'buffer') chunk = new Buffer(chunk, encoding)
    this.update(chunk)
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype._flush = function (callback) {
  var error = null
  try {
    this.push(this._digest())
  } catch (err) {
    error = err
  }

  callback(error)
}

HashBase.prototype.update = function (data, encoding) {
  if (!Buffer.isBuffer(data) && typeof data !== 'string') throw new TypeError('Data must be a string or a buffer')
  if (this._finalized) throw new Error('Digest already called')
  if (!Buffer.isBuffer(data)) data = new Buffer(data, encoding || 'binary')

  // consume data
  var block = this._block
  var offset = 0
  while (this._blockOffset + data.length - offset >= this._blockSize) {
    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++]
    this._update()
    this._blockOffset = 0
  }
  while (offset < data.length) block[this._blockOffset++] = data[offset++]

  // update length
  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
    this._length[j] += carry
    carry = (this._length[j] / 0x0100000000) | 0
    if (carry > 0) this._length[j] -= 0x0100000000 * carry
  }

  return this
}

HashBase.prototype._update = function (data) {
  throw new Error('_update is not implemented')
}

HashBase.prototype.digest = function (encoding) {
  if (this._finalized) throw new Error('Digest already called')
  this._finalized = true

  var digest = this._digest()
  if (encoding !== undefined) digest = digest.toString(encoding)
  return digest
}

HashBase.prototype._digest = function () {
  throw new Error('_digest is not implemented')
}

module.exports = HashBase

}).call(this,require("buffer").Buffer)
},{"buffer":5,"inherits":96,"stream":28}],96:[function(require,module,exports){
arguments[4][9][0].apply(exports,arguments)
},{"dup":9}],97:[function(require,module,exports){
(function (Buffer){
// constant-space merkle root calculation algorithm
module.exports = function fastRoot (values, digestFn) {
  if (!Array.isArray(values)) throw TypeError('Expected values Array')
  if (typeof digestFn !== 'function') throw TypeError('Expected digest Function')

  var length = values.length
  var results = values.concat()

  while (length > 1) {
    var j = 0

    for (var i = 0; i < length; i += 2, ++j) {
      var left = results[i]
      var right = i + 1 === length ? left : results[i + 1]
      var data = Buffer.concat([left, right])

      results[j] = digestFn(data)
    }

    length = j
  }

  return results[0]
}

}).call(this,require("buffer").Buffer)
},{"buffer":5}],98:[function(require,module,exports){
var OPS = require('bitcoin-ops')

function encodingLength (i) {
  return i < OPS.OP_PUSHDATA1 ? 1
  : i <= 0xff ? 2
  : i <= 0xffff ? 3
  : 5
}

function encode (buffer, number, offset) {
  var size = encodingLength(number)

  // ~6 bit
  if (size === 1) {
    buffer.writeUInt8(number, offset)

  // 8 bit
  } else if (size === 2) {
    buffer.writeUInt8(OPS.OP_PUSHDATA1, offset)
    buffer.writeUInt8(number, offset + 1)

  // 16 bit
  } else if (size === 3) {
    buffer.writeUInt8(OPS.OP_PUSHDATA2, offset)
    buffer.writeUInt16LE(number, offset + 1)

  // 32 bit
  } else {
    buffer.writeUInt8(OPS.OP_PUSHDATA4, offset)
    buffer.writeUInt32LE(number, offset + 1)
  }

  return size
}

function decode (buffer, offset) {
  var opcode = buffer.readUInt8(offset)
  var number, size

  // ~6 bit
  if (opcode < OPS.OP_PUSHDATA1) {
    number = opcode
    size = 1

  // 8 bit
  } else if (opcode === OPS.OP_PUSHDATA1) {
    if (offset + 2 > buffer.length) return null
    number = buffer.readUInt8(offset + 1)
    size = 2

  // 16 bit
  } else if (opcode === OPS.OP_PUSHDATA2) {
    if (offset + 3 > buffer.length) return null
    number = buffer.readUInt16LE(offset + 1)
    size = 3

  // 32 bit
  } else {
    if (offset + 5 > buffer.length) return null
    if (opcode !== OPS.OP_PUSHDATA4) throw new Error('Unexpected opcode')

    number = buffer.readUInt32LE(offset + 1)
    size = 5
  }

  return {
    opcode: opcode,
    number: number,
    size: size
  }
}

module.exports = {
  encodingLength: encodingLength,
  encode: encode,
  decode: decode
}

},{"bitcoin-ops":42}],99:[function(require,module,exports){
(function (process,global){
'use strict'

function oldBrowser () {
  throw new Error('Secure random number generation is not supported by this browser.\nUse Chrome, Firefox or Internet Explorer 11')
}

var Buffer = require('safe-buffer').Buffer
var crypto = global.crypto || global.msCrypto

if (crypto && crypto.getRandomValues) {
  module.exports = randomBytes
} else {
  module.exports = oldBrowser
}

function randomBytes (size, cb) {
  // phantomjs needs to throw
  if (size > 65536) throw new Error('requested too many random bytes')
  // in case browserify  isn't using the Uint8Array version
  var rawBytes = new global.Uint8Array(size)

  // This will not work in older browsers.
  // See https://developer.mozilla.org/en-US/docs/Web/API/window.crypto.getRandomValues
  if (size > 0) {  // getRandomValues fails on IE if size == 0
    crypto.getRandomValues(rawBytes)
  }

  // XXX: phantomjs doesn't like a buffer being passed here
  var bytes = Buffer.from(rawBytes.buffer)

  if (typeof cb === 'function') {
    return process.nextTick(function () {
      cb(null, bytes)
    })
  }

  return bytes
}

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":13,"safe-buffer":101}],100:[function(require,module,exports){
(function (Buffer){
'use strict'
var inherits = require('inherits')
var HashBase = require('hash-base')

function RIPEMD160 () {
  HashBase.call(this, 64)

  // state
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0
}

inherits(RIPEMD160, HashBase)

RIPEMD160.prototype._update = function () {
  var m = new Array(16)
  for (var i = 0; i < 16; ++i) m[i] = this._block.readInt32LE(i * 4)

  var al = this._a
  var bl = this._b
  var cl = this._c
  var dl = this._d
  var el = this._e

  // Mj = 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
  // K = 0x00000000
  // Sj = 11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8
  al = fn1(al, bl, cl, dl, el, m[0], 0x00000000, 11); cl = rotl(cl, 10)
  el = fn1(el, al, bl, cl, dl, m[1], 0x00000000, 14); bl = rotl(bl, 10)
  dl = fn1(dl, el, al, bl, cl, m[2], 0x00000000, 15); al = rotl(al, 10)
  cl = fn1(cl, dl, el, al, bl, m[3], 0x00000000, 12); el = rotl(el, 10)
  bl = fn1(bl, cl, dl, el, al, m[4], 0x00000000, 5); dl = rotl(dl, 10)
  al = fn1(al, bl, cl, dl, el, m[5], 0x00000000, 8); cl = rotl(cl, 10)
  el = fn1(el, al, bl, cl, dl, m[6], 0x00000000, 7); bl = rotl(bl, 10)
  dl = fn1(dl, el, al, bl, cl, m[7], 0x00000000, 9); al = rotl(al, 10)
  cl = fn1(cl, dl, el, al, bl, m[8], 0x00000000, 11); el = rotl(el, 10)
  bl = fn1(bl, cl, dl, el, al, m[9], 0x00000000, 13); dl = rotl(dl, 10)
  al = fn1(al, bl, cl, dl, el, m[10], 0x00000000, 14); cl = rotl(cl, 10)
  el = fn1(el, al, bl, cl, dl, m[11], 0x00000000, 15); bl = rotl(bl, 10)
  dl = fn1(dl, el, al, bl, cl, m[12], 0x00000000, 6); al = rotl(al, 10)
  cl = fn1(cl, dl, el, al, bl, m[13], 0x00000000, 7); el = rotl(el, 10)
  bl = fn1(bl, cl, dl, el, al, m[14], 0x00000000, 9); dl = rotl(dl, 10)
  al = fn1(al, bl, cl, dl, el, m[15], 0x00000000, 8); cl = rotl(cl, 10)

  // Mj = 7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8
  // K = 0x5a827999
  // Sj = 7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12
  el = fn2(el, al, bl, cl, dl, m[7], 0x5a827999, 7); bl = rotl(bl, 10)
  dl = fn2(dl, el, al, bl, cl, m[4], 0x5a827999, 6); al = rotl(al, 10)
  cl = fn2(cl, dl, el, al, bl, m[13], 0x5a827999, 8); el = rotl(el, 10)
  bl = fn2(bl, cl, dl, el, al, m[1], 0x5a827999, 13); dl = rotl(dl, 10)
  al = fn2(al, bl, cl, dl, el, m[10], 0x5a827999, 11); cl = rotl(cl, 10)
  el = fn2(el, al, bl, cl, dl, m[6], 0x5a827999, 9); bl = rotl(bl, 10)
  dl = fn2(dl, el, al, bl, cl, m[15], 0x5a827999, 7); al = rotl(al, 10)
  cl = fn2(cl, dl, el, al, bl, m[3], 0x5a827999, 15); el = rotl(el, 10)
  bl = fn2(bl, cl, dl, el, al, m[12], 0x5a827999, 7); dl = rotl(dl, 10)
  al = fn2(al, bl, cl, dl, el, m[0], 0x5a827999, 12); cl = rotl(cl, 10)
  el = fn2(el, al, bl, cl, dl, m[9], 0x5a827999, 15); bl = rotl(bl, 10)
  dl = fn2(dl, el, al, bl, cl, m[5], 0x5a827999, 9); al = rotl(al, 10)
  cl = fn2(cl, dl, el, al, bl, m[2], 0x5a827999, 11); el = rotl(el, 10)
  bl = fn2(bl, cl, dl, el, al, m[14], 0x5a827999, 7); dl = rotl(dl, 10)
  al = fn2(al, bl, cl, dl, el, m[11], 0x5a827999, 13); cl = rotl(cl, 10)
  el = fn2(el, al, bl, cl, dl, m[8], 0x5a827999, 12); bl = rotl(bl, 10)

  // Mj = 3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12
  // K = 0x6ed9eba1
  // Sj = 11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5
  dl = fn3(dl, el, al, bl, cl, m[3], 0x6ed9eba1, 11); al = rotl(al, 10)
  cl = fn3(cl, dl, el, al, bl, m[10], 0x6ed9eba1, 13); el = rotl(el, 10)
  bl = fn3(bl, cl, dl, el, al, m[14], 0x6ed9eba1, 6); dl = rotl(dl, 10)
  al = fn3(al, bl, cl, dl, el, m[4], 0x6ed9eba1, 7); cl = rotl(cl, 10)
  el = fn3(el, al, bl, cl, dl, m[9], 0x6ed9eba1, 14); bl = rotl(bl, 10)
  dl = fn3(dl, el, al, bl, cl, m[15], 0x6ed9eba1, 9); al = rotl(al, 10)
  cl = fn3(cl, dl, el, al, bl, m[8], 0x6ed9eba1, 13); el = rotl(el, 10)
  bl = fn3(bl, cl, dl, el, al, m[1], 0x6ed9eba1, 15); dl = rotl(dl, 10)
  al = fn3(al, bl, cl, dl, el, m[2], 0x6ed9eba1, 14); cl = rotl(cl, 10)
  el = fn3(el, al, bl, cl, dl, m[7], 0x6ed9eba1, 8); bl = rotl(bl, 10)
  dl = fn3(dl, el, al, bl, cl, m[0], 0x6ed9eba1, 13); al = rotl(al, 10)
  cl = fn3(cl, dl, el, al, bl, m[6], 0x6ed9eba1, 6); el = rotl(el, 10)
  bl = fn3(bl, cl, dl, el, al, m[13], 0x6ed9eba1, 5); dl = rotl(dl, 10)
  al = fn3(al, bl, cl, dl, el, m[11], 0x6ed9eba1, 12); cl = rotl(cl, 10)
  el = fn3(el, al, bl, cl, dl, m[5], 0x6ed9eba1, 7); bl = rotl(bl, 10)
  dl = fn3(dl, el, al, bl, cl, m[12], 0x6ed9eba1, 5); al = rotl(al, 10)

  // Mj = 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2
  // K = 0x8f1bbcdc
  // Sj = 11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12
  cl = fn4(cl, dl, el, al, bl, m[1], 0x8f1bbcdc, 11); el = rotl(el, 10)
  bl = fn4(bl, cl, dl, el, al, m[9], 0x8f1bbcdc, 12); dl = rotl(dl, 10)
  al = fn4(al, bl, cl, dl, el, m[11], 0x8f1bbcdc, 14); cl = rotl(cl, 10)
  el = fn4(el, al, bl, cl, dl, m[10], 0x8f1bbcdc, 15); bl = rotl(bl, 10)
  dl = fn4(dl, el, al, bl, cl, m[0], 0x8f1bbcdc, 14); al = rotl(al, 10)
  cl = fn4(cl, dl, el, al, bl, m[8], 0x8f1bbcdc, 15); el = rotl(el, 10)
  bl = fn4(bl, cl, dl, el, al, m[12], 0x8f1bbcdc, 9); dl = rotl(dl, 10)
  al = fn4(al, bl, cl, dl, el, m[4], 0x8f1bbcdc, 8); cl = rotl(cl, 10)
  el = fn4(el, al, bl, cl, dl, m[13], 0x8f1bbcdc, 9); bl = rotl(bl, 10)
  dl = fn4(dl, el, al, bl, cl, m[3], 0x8f1bbcdc, 14); al = rotl(al, 10)
  cl = fn4(cl, dl, el, al, bl, m[7], 0x8f1bbcdc, 5); el = rotl(el, 10)
  bl = fn4(bl, cl, dl, el, al, m[15], 0x8f1bbcdc, 6); dl = rotl(dl, 10)
  al = fn4(al, bl, cl, dl, el, m[14], 0x8f1bbcdc, 8); cl = rotl(cl, 10)
  el = fn4(el, al, bl, cl, dl, m[5], 0x8f1bbcdc, 6); bl = rotl(bl, 10)
  dl = fn4(dl, el, al, bl, cl, m[6], 0x8f1bbcdc, 5); al = rotl(al, 10)
  cl = fn4(cl, dl, el, al, bl, m[2], 0x8f1bbcdc, 12); el = rotl(el, 10)

  // Mj = 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
  // K = 0xa953fd4e
  // Sj = 9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
  bl = fn5(bl, cl, dl, el, al, m[4], 0xa953fd4e, 9); dl = rotl(dl, 10)
  al = fn5(al, bl, cl, dl, el, m[0], 0xa953fd4e, 15); cl = rotl(cl, 10)
  el = fn5(el, al, bl, cl, dl, m[5], 0xa953fd4e, 5); bl = rotl(bl, 10)
  dl = fn5(dl, el, al, bl, cl, m[9], 0xa953fd4e, 11); al = rotl(al, 10)
  cl = fn5(cl, dl, el, al, bl, m[7], 0xa953fd4e, 6); el = rotl(el, 10)
  bl = fn5(bl, cl, dl, el, al, m[12], 0xa953fd4e, 8); dl = rotl(dl, 10)
  al = fn5(al, bl, cl, dl, el, m[2], 0xa953fd4e, 13); cl = rotl(cl, 10)
  el = fn5(el, al, bl, cl, dl, m[10], 0xa953fd4e, 12); bl = rotl(bl, 10)
  dl = fn5(dl, el, al, bl, cl, m[14], 0xa953fd4e, 5); al = rotl(al, 10)
  cl = fn5(cl, dl, el, al, bl, m[1], 0xa953fd4e, 12); el = rotl(el, 10)
  bl = fn5(bl, cl, dl, el, al, m[3], 0xa953fd4e, 13); dl = rotl(dl, 10)
  al = fn5(al, bl, cl, dl, el, m[8], 0xa953fd4e, 14); cl = rotl(cl, 10)
  el = fn5(el, al, bl, cl, dl, m[11], 0xa953fd4e, 11); bl = rotl(bl, 10)
  dl = fn5(dl, el, al, bl, cl, m[6], 0xa953fd4e, 8); al = rotl(al, 10)
  cl = fn5(cl, dl, el, al, bl, m[15], 0xa953fd4e, 5); el = rotl(el, 10)
  bl = fn5(bl, cl, dl, el, al, m[13], 0xa953fd4e, 6); dl = rotl(dl, 10)

  var ar = this._a
  var br = this._b
  var cr = this._c
  var dr = this._d
  var er = this._e

  // M'j = 5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12
  // K' = 0x50a28be6
  // S'j = 8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6
  ar = fn5(ar, br, cr, dr, er, m[5], 0x50a28be6, 8); cr = rotl(cr, 10)
  er = fn5(er, ar, br, cr, dr, m[14], 0x50a28be6, 9); br = rotl(br, 10)
  dr = fn5(dr, er, ar, br, cr, m[7], 0x50a28be6, 9); ar = rotl(ar, 10)
  cr = fn5(cr, dr, er, ar, br, m[0], 0x50a28be6, 11); er = rotl(er, 10)
  br = fn5(br, cr, dr, er, ar, m[9], 0x50a28be6, 13); dr = rotl(dr, 10)
  ar = fn5(ar, br, cr, dr, er, m[2], 0x50a28be6, 15); cr = rotl(cr, 10)
  er = fn5(er, ar, br, cr, dr, m[11], 0x50a28be6, 15); br = rotl(br, 10)
  dr = fn5(dr, er, ar, br, cr, m[4], 0x50a28be6, 5); ar = rotl(ar, 10)
  cr = fn5(cr, dr, er, ar, br, m[13], 0x50a28be6, 7); er = rotl(er, 10)
  br = fn5(br, cr, dr, er, ar, m[6], 0x50a28be6, 7); dr = rotl(dr, 10)
  ar = fn5(ar, br, cr, dr, er, m[15], 0x50a28be6, 8); cr = rotl(cr, 10)
  er = fn5(er, ar, br, cr, dr, m[8], 0x50a28be6, 11); br = rotl(br, 10)
  dr = fn5(dr, er, ar, br, cr, m[1], 0x50a28be6, 14); ar = rotl(ar, 10)
  cr = fn5(cr, dr, er, ar, br, m[10], 0x50a28be6, 14); er = rotl(er, 10)
  br = fn5(br, cr, dr, er, ar, m[3], 0x50a28be6, 12); dr = rotl(dr, 10)
  ar = fn5(ar, br, cr, dr, er, m[12], 0x50a28be6, 6); cr = rotl(cr, 10)

  // M'j = 6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2
  // K' = 0x5c4dd124
  // S'j = 9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11
  er = fn4(er, ar, br, cr, dr, m[6], 0x5c4dd124, 9); br = rotl(br, 10)
  dr = fn4(dr, er, ar, br, cr, m[11], 0x5c4dd124, 13); ar = rotl(ar, 10)
  cr = fn4(cr, dr, er, ar, br, m[3], 0x5c4dd124, 15); er = rotl(er, 10)
  br = fn4(br, cr, dr, er, ar, m[7], 0x5c4dd124, 7); dr = rotl(dr, 10)
  ar = fn4(ar, br, cr, dr, er, m[0], 0x5c4dd124, 12); cr = rotl(cr, 10)
  er = fn4(er, ar, br, cr, dr, m[13], 0x5c4dd124, 8); br = rotl(br, 10)
  dr = fn4(dr, er, ar, br, cr, m[5], 0x5c4dd124, 9); ar = rotl(ar, 10)
  cr = fn4(cr, dr, er, ar, br, m[10], 0x5c4dd124, 11); er = rotl(er, 10)
  br = fn4(br, cr, dr, er, ar, m[14], 0x5c4dd124, 7); dr = rotl(dr, 10)
  ar = fn4(ar, br, cr, dr, er, m[15], 0x5c4dd124, 7); cr = rotl(cr, 10)
  er = fn4(er, ar, br, cr, dr, m[8], 0x5c4dd124, 12); br = rotl(br, 10)
  dr = fn4(dr, er, ar, br, cr, m[12], 0x5c4dd124, 7); ar = rotl(ar, 10)
  cr = fn4(cr, dr, er, ar, br, m[4], 0x5c4dd124, 6); er = rotl(er, 10)
  br = fn4(br, cr, dr, er, ar, m[9], 0x5c4dd124, 15); dr = rotl(dr, 10)
  ar = fn4(ar, br, cr, dr, er, m[1], 0x5c4dd124, 13); cr = rotl(cr, 10)
  er = fn4(er, ar, br, cr, dr, m[2], 0x5c4dd124, 11); br = rotl(br, 10)

  // M'j = 15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13
  // K' = 0x6d703ef3
  // S'j = 9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5
  dr = fn3(dr, er, ar, br, cr, m[15], 0x6d703ef3, 9); ar = rotl(ar, 10)
  cr = fn3(cr, dr, er, ar, br, m[5], 0x6d703ef3, 7); er = rotl(er, 10)
  br = fn3(br, cr, dr, er, ar, m[1], 0x6d703ef3, 15); dr = rotl(dr, 10)
  ar = fn3(ar, br, cr, dr, er, m[3], 0x6d703ef3, 11); cr = rotl(cr, 10)
  er = fn3(er, ar, br, cr, dr, m[7], 0x6d703ef3, 8); br = rotl(br, 10)
  dr = fn3(dr, er, ar, br, cr, m[14], 0x6d703ef3, 6); ar = rotl(ar, 10)
  cr = fn3(cr, dr, er, ar, br, m[6], 0x6d703ef3, 6); er = rotl(er, 10)
  br = fn3(br, cr, dr, er, ar, m[9], 0x6d703ef3, 14); dr = rotl(dr, 10)
  ar = fn3(ar, br, cr, dr, er, m[11], 0x6d703ef3, 12); cr = rotl(cr, 10)
  er = fn3(er, ar, br, cr, dr, m[8], 0x6d703ef3, 13); br = rotl(br, 10)
  dr = fn3(dr, er, ar, br, cr, m[12], 0x6d703ef3, 5); ar = rotl(ar, 10)
  cr = fn3(cr, dr, er, ar, br, m[2], 0x6d703ef3, 14); er = rotl(er, 10)
  br = fn3(br, cr, dr, er, ar, m[10], 0x6d703ef3, 13); dr = rotl(dr, 10)
  ar = fn3(ar, br, cr, dr, er, m[0], 0x6d703ef3, 13); cr = rotl(cr, 10)
  er = fn3(er, ar, br, cr, dr, m[4], 0x6d703ef3, 7); br = rotl(br, 10)
  dr = fn3(dr, er, ar, br, cr, m[13], 0x6d703ef3, 5); ar = rotl(ar, 10)

  // M'j = 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14
  // K' = 0x7a6d76e9
  // S'j = 15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8
  cr = fn2(cr, dr, er, ar, br, m[8], 0x7a6d76e9, 15); er = rotl(er, 10)
  br = fn2(br, cr, dr, er, ar, m[6], 0x7a6d76e9, 5); dr = rotl(dr, 10)
  ar = fn2(ar, br, cr, dr, er, m[4], 0x7a6d76e9, 8); cr = rotl(cr, 10)
  er = fn2(er, ar, br, cr, dr, m[1], 0x7a6d76e9, 11); br = rotl(br, 10)
  dr = fn2(dr, er, ar, br, cr, m[3], 0x7a6d76e9, 14); ar = rotl(ar, 10)
  cr = fn2(cr, dr, er, ar, br, m[11], 0x7a6d76e9, 14); er = rotl(er, 10)
  br = fn2(br, cr, dr, er, ar, m[15], 0x7a6d76e9, 6); dr = rotl(dr, 10)
  ar = fn2(ar, br, cr, dr, er, m[0], 0x7a6d76e9, 14); cr = rotl(cr, 10)
  er = fn2(er, ar, br, cr, dr, m[5], 0x7a6d76e9, 6); br = rotl(br, 10)
  dr = fn2(dr, er, ar, br, cr, m[12], 0x7a6d76e9, 9); ar = rotl(ar, 10)
  cr = fn2(cr, dr, er, ar, br, m[2], 0x7a6d76e9, 12); er = rotl(er, 10)
  br = fn2(br, cr, dr, er, ar, m[13], 0x7a6d76e9, 9); dr = rotl(dr, 10)
  ar = fn2(ar, br, cr, dr, er, m[9], 0x7a6d76e9, 12); cr = rotl(cr, 10)
  er = fn2(er, ar, br, cr, dr, m[7], 0x7a6d76e9, 5); br = rotl(br, 10)
  dr = fn2(dr, er, ar, br, cr, m[10], 0x7a6d76e9, 15); ar = rotl(ar, 10)
  cr = fn2(cr, dr, er, ar, br, m[14], 0x7a6d76e9, 8); er = rotl(er, 10)

  // M'j = 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
  // K' = 0x00000000
  // S'j = 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
  br = fn1(br, cr, dr, er, ar, m[12], 0x00000000, 8); dr = rotl(dr, 10)
  ar = fn1(ar, br, cr, dr, er, m[15], 0x00000000, 5); cr = rotl(cr, 10)
  er = fn1(er, ar, br, cr, dr, m[10], 0x00000000, 12); br = rotl(br, 10)
  dr = fn1(dr, er, ar, br, cr, m[4], 0x00000000, 9); ar = rotl(ar, 10)
  cr = fn1(cr, dr, er, ar, br, m[1], 0x00000000, 12); er = rotl(er, 10)
  br = fn1(br, cr, dr, er, ar, m[5], 0x00000000, 5); dr = rotl(dr, 10)
  ar = fn1(ar, br, cr, dr, er, m[8], 0x00000000, 14); cr = rotl(cr, 10)
  er = fn1(er, ar, br, cr, dr, m[7], 0x00000000, 6); br = rotl(br, 10)
  dr = fn1(dr, er, ar, br, cr, m[6], 0x00000000, 8); ar = rotl(ar, 10)
  cr = fn1(cr, dr, er, ar, br, m[2], 0x00000000, 13); er = rotl(er, 10)
  br = fn1(br, cr, dr, er, ar, m[13], 0x00000000, 6); dr = rotl(dr, 10)
  ar = fn1(ar, br, cr, dr, er, m[14], 0x00000000, 5); cr = rotl(cr, 10)
  er = fn1(er, ar, br, cr, dr, m[0], 0x00000000, 15); br = rotl(br, 10)
  dr = fn1(dr, er, ar, br, cr, m[3], 0x00000000, 13); ar = rotl(ar, 10)
  cr = fn1(cr, dr, er, ar, br, m[9], 0x00000000, 11); er = rotl(er, 10)
  br = fn1(br, cr, dr, er, ar, m[11], 0x00000000, 11); dr = rotl(dr, 10)

  // change state
  var t = (this._b + cl + dr) | 0
  this._b = (this._c + dl + er) | 0
  this._c = (this._d + el + ar) | 0
  this._d = (this._e + al + br) | 0
  this._e = (this._a + bl + cr) | 0
  this._a = t
}

RIPEMD160.prototype._digest = function () {
  // create padding and handle blocks
  this._block[this._blockOffset++] = 0x80
  if (this._blockOffset > 56) {
    this._block.fill(0, this._blockOffset, 64)
    this._update()
    this._blockOffset = 0
  }

  this._block.fill(0, this._blockOffset, 56)
  this._block.writeUInt32LE(this._length[0], 56)
  this._block.writeUInt32LE(this._length[1], 60)
  this._update()

  // produce result
  var buffer = new Buffer(20)
  buffer.writeInt32LE(this._a, 0)
  buffer.writeInt32LE(this._b, 4)
  buffer.writeInt32LE(this._c, 8)
  buffer.writeInt32LE(this._d, 12)
  buffer.writeInt32LE(this._e, 16)
  return buffer
}

function rotl (x, n) {
  return (x << n) | (x >>> (32 - n))
}

function fn1 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
}

function fn2 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0
}

function fn3 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0
}

function fn4 (a, b, c, d, e, m, k, s) {
  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0
}

function fn5 (a, b, c, d, e, m, k, s) {
  return (rotl((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0
}

module.exports = RIPEMD160

}).call(this,require("buffer").Buffer)
},{"buffer":5,"hash-base":95,"inherits":96}],101:[function(require,module,exports){
/* eslint-disable node/no-deprecated-api */
var buffer = require('buffer')
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}

},{"buffer":5}],102:[function(require,module,exports){
var Buffer = require('safe-buffer').Buffer

// prototype class for hash functions
function Hash (blockSize, finalSize) {
  this._block = Buffer.alloc(blockSize)
  this._finalSize = finalSize
  this._blockSize = blockSize
  this._len = 0
}

Hash.prototype.update = function (data, enc) {
  if (typeof data === 'string') {
    enc = enc || 'utf8'
    data = Buffer.from(data, enc)
  }

  var block = this._block
  var blockSize = this._blockSize
  var length = data.length
  var accum = this._len

  for (var offset = 0; offset < length;) {
    var assigned = accum % blockSize
    var remainder = Math.min(length - offset, blockSize - assigned)

    for (var i = 0; i < remainder; i++) {
      block[assigned + i] = data[offset + i]
    }

    accum += remainder
    offset += remainder

    if ((accum % blockSize) === 0) {
      this._update(block)
    }
  }

  this._len += length
  return this
}

Hash.prototype.digest = function (enc) {
  var rem = this._len % this._blockSize

  this._block[rem] = 0x80

  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
  this._block.fill(0, rem + 1)

  if (rem >= this._finalSize) {
    this._update(this._block)
    this._block.fill(0)
  }

  var bits = this._len * 8

  // uint32
  if (bits <= 0xffffffff) {
    this._block.writeUInt32BE(bits, this._blockSize - 4)

  // uint64
  } else {
    var lowBits = (bits & 0xffffffff) >>> 0
    var highBits = (bits - lowBits) / 0x100000000

    this._block.writeUInt32BE(highBits, this._blockSize - 8)
    this._block.writeUInt32BE(lowBits, this._blockSize - 4)
  }

  this._update(this._block)
  var hash = this._hash()

  return enc ? hash.toString(enc) : hash
}

Hash.prototype._update = function () {
  throw new Error('_update must be implemented by subclass')
}

module.exports = Hash

},{"safe-buffer":101}],103:[function(require,module,exports){
var exports = module.exports = function SHA (algorithm) {
  algorithm = algorithm.toLowerCase()

  var Algorithm = exports[algorithm]
  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

  return new Algorithm()
}

exports.sha = require('./sha')
exports.sha1 = require('./sha1')
exports.sha224 = require('./sha224')
exports.sha256 = require('./sha256')
exports.sha384 = require('./sha384')
exports.sha512 = require('./sha512')

},{"./sha":104,"./sha1":105,"./sha224":106,"./sha256":107,"./sha384":108,"./sha512":109}],104:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
 * in FIPS PUB 180-1
 * This source code is derived from sha1.js of the same repository.
 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
 * operation was added.
 */

var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha, Hash)

Sha.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha

},{"./hash":102,"inherits":96,"safe-buffer":101}],105:[function(require,module,exports){
/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS PUB 180-1
 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */

var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
]

var W = new Array(80)

function Sha1 () {
  this.init()
  this._w = W

  Hash.call(this, 64, 56)
}

inherits(Sha1, Hash)

Sha1.prototype.init = function () {
  this._a = 0x67452301
  this._b = 0xefcdab89
  this._c = 0x98badcfe
  this._d = 0x10325476
  this._e = 0xc3d2e1f0

  return this
}

function rotl1 (num) {
  return (num << 1) | (num >>> 31)
}

function rotl5 (num) {
  return (num << 5) | (num >>> 27)
}

function rotl30 (num) {
  return (num << 30) | (num >>> 2)
}

function ft (s, b, c, d) {
  if (s === 0) return (b & c) | ((~b) & d)
  if (s === 2) return (b & c) | (b & d) | (c & d)
  return b ^ c ^ d
}

Sha1.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16])

  for (var j = 0; j < 80; ++j) {
    var s = ~~(j / 20)
    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K[s]) | 0

    e = d
    d = c
    c = rotl30(b)
    b = a
    a = t
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
}

Sha1.prototype._hash = function () {
  var H = Buffer.allocUnsafe(20)

  H.writeInt32BE(this._a | 0, 0)
  H.writeInt32BE(this._b | 0, 4)
  H.writeInt32BE(this._c | 0, 8)
  H.writeInt32BE(this._d | 0, 12)
  H.writeInt32BE(this._e | 0, 16)

  return H
}

module.exports = Sha1

},{"./hash":102,"inherits":96,"safe-buffer":101}],106:[function(require,module,exports){
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('inherits')
var Sha256 = require('./sha256')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var W = new Array(64)

function Sha224 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha224, Sha256)

Sha224.prototype.init = function () {
  this._a = 0xc1059ed8
  this._b = 0x367cd507
  this._c = 0x3070dd17
  this._d = 0xf70e5939
  this._e = 0xffc00b31
  this._f = 0x68581511
  this._g = 0x64f98fa7
  this._h = 0xbefa4fa4

  return this
}

Sha224.prototype._hash = function () {
  var H = Buffer.allocUnsafe(28)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)

  return H
}

module.exports = Sha224

},{"./hash":102,"./sha256":107,"inherits":96,"safe-buffer":101}],107:[function(require,module,exports){
/**
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
 * in FIPS 180-2
 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 *
 */

var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
]

var W = new Array(64)

function Sha256 () {
  this.init()

  this._w = W // new Array(64)

  Hash.call(this, 64, 56)
}

inherits(Sha256, Hash)

Sha256.prototype.init = function () {
  this._a = 0x6a09e667
  this._b = 0xbb67ae85
  this._c = 0x3c6ef372
  this._d = 0xa54ff53a
  this._e = 0x510e527f
  this._f = 0x9b05688c
  this._g = 0x1f83d9ab
  this._h = 0x5be0cd19

  return this
}

function ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x) {
  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
}

function sigma1 (x) {
  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
}

function gamma0 (x) {
  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
}

function gamma1 (x) {
  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
}

Sha256.prototype._update = function (M) {
  var W = this._w

  var a = this._a | 0
  var b = this._b | 0
  var c = this._c | 0
  var d = this._d | 0
  var e = this._e | 0
  var f = this._f | 0
  var g = this._g | 0
  var h = this._h | 0

  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4)
  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0

  for (var j = 0; j < 64; ++j) {
    var T1 = (h + sigma1(e) + ch(e, f, g) + K[j] + W[j]) | 0
    var T2 = (sigma0(a) + maj(a, b, c)) | 0

    h = g
    g = f
    f = e
    e = (d + T1) | 0
    d = c
    c = b
    b = a
    a = (T1 + T2) | 0
  }

  this._a = (a + this._a) | 0
  this._b = (b + this._b) | 0
  this._c = (c + this._c) | 0
  this._d = (d + this._d) | 0
  this._e = (e + this._e) | 0
  this._f = (f + this._f) | 0
  this._g = (g + this._g) | 0
  this._h = (h + this._h) | 0
}

Sha256.prototype._hash = function () {
  var H = Buffer.allocUnsafe(32)

  H.writeInt32BE(this._a, 0)
  H.writeInt32BE(this._b, 4)
  H.writeInt32BE(this._c, 8)
  H.writeInt32BE(this._d, 12)
  H.writeInt32BE(this._e, 16)
  H.writeInt32BE(this._f, 20)
  H.writeInt32BE(this._g, 24)
  H.writeInt32BE(this._h, 28)

  return H
}

module.exports = Sha256

},{"./hash":102,"inherits":96,"safe-buffer":101}],108:[function(require,module,exports){
var inherits = require('inherits')
var SHA512 = require('./sha512')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var W = new Array(160)

function Sha384 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha384, SHA512)

Sha384.prototype.init = function () {
  this._ah = 0xcbbb9d5d
  this._bh = 0x629a292a
  this._ch = 0x9159015a
  this._dh = 0x152fecd8
  this._eh = 0x67332667
  this._fh = 0x8eb44a87
  this._gh = 0xdb0c2e0d
  this._hh = 0x47b5481d

  this._al = 0xc1059ed8
  this._bl = 0x367cd507
  this._cl = 0x3070dd17
  this._dl = 0xf70e5939
  this._el = 0xffc00b31
  this._fl = 0x68581511
  this._gl = 0x64f98fa7
  this._hl = 0xbefa4fa4

  return this
}

Sha384.prototype._hash = function () {
  var H = Buffer.allocUnsafe(48)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)

  return H
}

module.exports = Sha384

},{"./hash":102,"./sha512":109,"inherits":96,"safe-buffer":101}],109:[function(require,module,exports){
var inherits = require('inherits')
var Hash = require('./hash')
var Buffer = require('safe-buffer').Buffer

var K = [
  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
]

var W = new Array(160)

function Sha512 () {
  this.init()
  this._w = W

  Hash.call(this, 128, 112)
}

inherits(Sha512, Hash)

Sha512.prototype.init = function () {
  this._ah = 0x6a09e667
  this._bh = 0xbb67ae85
  this._ch = 0x3c6ef372
  this._dh = 0xa54ff53a
  this._eh = 0x510e527f
  this._fh = 0x9b05688c
  this._gh = 0x1f83d9ab
  this._hh = 0x5be0cd19

  this._al = 0xf3bcc908
  this._bl = 0x84caa73b
  this._cl = 0xfe94f82b
  this._dl = 0x5f1d36f1
  this._el = 0xade682d1
  this._fl = 0x2b3e6c1f
  this._gl = 0xfb41bd6b
  this._hl = 0x137e2179

  return this
}

function Ch (x, y, z) {
  return z ^ (x & (y ^ z))
}

function maj (x, y, z) {
  return (x & y) | (z & (x | y))
}

function sigma0 (x, xl) {
  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
}

function sigma1 (x, xl) {
  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
}

function Gamma0 (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
}

function Gamma0l (x, xl) {
  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
}

function Gamma1 (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
}

function Gamma1l (x, xl) {
  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
}

function getCarry (a, b) {
  return (a >>> 0) < (b >>> 0) ? 1 : 0
}

Sha512.prototype._update = function (M) {
  var W = this._w

  var ah = this._ah | 0
  var bh = this._bh | 0
  var ch = this._ch | 0
  var dh = this._dh | 0
  var eh = this._eh | 0
  var fh = this._fh | 0
  var gh = this._gh | 0
  var hh = this._hh | 0

  var al = this._al | 0
  var bl = this._bl | 0
  var cl = this._cl | 0
  var dl = this._dl | 0
  var el = this._el | 0
  var fl = this._fl | 0
  var gl = this._gl | 0
  var hl = this._hl | 0

  for (var i = 0; i < 32; i += 2) {
    W[i] = M.readInt32BE(i * 4)
    W[i + 1] = M.readInt32BE(i * 4 + 4)
  }
  for (; i < 160; i += 2) {
    var xh = W[i - 15 * 2]
    var xl = W[i - 15 * 2 + 1]
    var gamma0 = Gamma0(xh, xl)
    var gamma0l = Gamma0l(xl, xh)

    xh = W[i - 2 * 2]
    xl = W[i - 2 * 2 + 1]
    var gamma1 = Gamma1(xh, xl)
    var gamma1l = Gamma1l(xl, xh)

    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
    var Wi7h = W[i - 7 * 2]
    var Wi7l = W[i - 7 * 2 + 1]

    var Wi16h = W[i - 16 * 2]
    var Wi16l = W[i - 16 * 2 + 1]

    var Wil = (gamma0l + Wi7l) | 0
    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0
    Wil = (Wil + gamma1l) | 0
    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0
    Wil = (Wil + Wi16l) | 0
    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0

    W[i] = Wih
    W[i + 1] = Wil
  }

  for (var j = 0; j < 160; j += 2) {
    Wih = W[j]
    Wil = W[j + 1]

    var majh = maj(ah, bh, ch)
    var majl = maj(al, bl, cl)

    var sigma0h = sigma0(ah, al)
    var sigma0l = sigma0(al, ah)
    var sigma1h = sigma1(eh, el)
    var sigma1l = sigma1(el, eh)

    // t1 = h + sigma1 + ch + K[j] + W[j]
    var Kih = K[j]
    var Kil = K[j + 1]

    var chh = Ch(eh, fh, gh)
    var chl = Ch(el, fl, gl)

    var t1l = (hl + sigma1l) | 0
    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0
    t1l = (t1l + chl) | 0
    t1h = (t1h + chh + getCarry(t1l, chl)) | 0
    t1l = (t1l + Kil) | 0
    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0
    t1l = (t1l + Wil) | 0
    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0

    // t2 = sigma0 + maj
    var t2l = (sigma0l + majl) | 0
    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0

    hh = gh
    hl = gl
    gh = fh
    gl = fl
    fh = eh
    fl = el
    el = (dl + t1l) | 0
    eh = (dh + t1h + getCarry(el, dl)) | 0
    dh = ch
    dl = cl
    ch = bh
    cl = bl
    bh = ah
    bl = al
    al = (t1l + t2l) | 0
    ah = (t1h + t2h + getCarry(al, t1l)) | 0
  }

  this._al = (this._al + al) | 0
  this._bl = (this._bl + bl) | 0
  this._cl = (this._cl + cl) | 0
  this._dl = (this._dl + dl) | 0
  this._el = (this._el + el) | 0
  this._fl = (this._fl + fl) | 0
  this._gl = (this._gl + gl) | 0
  this._hl = (this._hl + hl) | 0

  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0
  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0
  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0
  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0
  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0
  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0
  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0
  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0
}

Sha512.prototype._hash = function () {
  var H = Buffer.allocUnsafe(64)

  function writeInt64BE (h, l, offset) {
    H.writeInt32BE(h, offset)
    H.writeInt32BE(l, offset + 4)
  }

  writeInt64BE(this._ah, this._al, 0)
  writeInt64BE(this._bh, this._bl, 8)
  writeInt64BE(this._ch, this._cl, 16)
  writeInt64BE(this._dh, this._dl, 24)
  writeInt64BE(this._eh, this._el, 32)
  writeInt64BE(this._fh, this._fl, 40)
  writeInt64BE(this._gh, this._gl, 48)
  writeInt64BE(this._hh, this._hl, 56)

  return H
}

module.exports = Sha512

},{"./hash":102,"inherits":96,"safe-buffer":101}],110:[function(require,module,exports){
var native = require('./native')

function getTypeName (fn) {
  return fn.name || fn.toString().match(/function (.*?)\s*\(/)[1]
}

function getValueTypeName (value) {
  return native.Nil(value) ? '' : getTypeName(value.constructor)
}

function getValue (value) {
  if (native.Function(value)) return ''
  if (native.String(value)) return JSON.stringify(value)
  if (value && native.Object(value)) return ''
  return value
}

function tfJSON (type) {
  if (native.Function(type)) return type.toJSON ? type.toJSON() : getTypeName(type)
  if (native.Array(type)) return 'Array'
  if (type && native.Object(type)) return 'Object'

  return type !== undefined ? type : ''
}

function tfErrorString (type, value, valueTypeName) {
  var valueJson = getValue(value)

  return 'Expected ' + tfJSON(type) + ', got' +
    (valueTypeName !== '' ? ' ' + valueTypeName : '') +
    (valueJson !== '' ? ' ' + valueJson : '')
}

function TfTypeError (type, value, valueTypeName) {
  valueTypeName = valueTypeName || getValueTypeName(value)
  this.message = tfErrorString(type, value, valueTypeName)

  Error.captureStackTrace(this, TfTypeError)
  this.__type = type
  this.__value = value
  this.__valueTypeName = valueTypeName
}

TfTypeError.prototype = Object.create(Error.prototype)
TfTypeError.prototype.constructor = TfTypeError

function tfPropertyErrorString (type, label, name, value, valueTypeName) {
  var description = '" of type '
  if (label === 'key') description = '" with key type '

  return tfErrorString('property "' + tfJSON(name) + description + tfJSON(type), value, valueTypeName)
}

function TfPropertyTypeError (type, property, label, value, valueTypeName) {
  if (type) {
    valueTypeName = valueTypeName || getValueTypeName(value)
    this.message = tfPropertyErrorString(type, label, property, value, valueTypeName)
  } else {
    this.message = 'Unexpected property "' + property + '"'
  }

  Error.captureStackTrace(this, TfTypeError)
  this.__label = label
  this.__property = property
  this.__type = type
  this.__value = value
  this.__valueTypeName = valueTypeName
}

TfPropertyTypeError.prototype = Object.create(Error.prototype)
TfPropertyTypeError.prototype.constructor = TfTypeError

function tfCustomError (expected, actual) {
  return new TfTypeError(expected, {}, actual)
}

function tfSubError (e, property, label) {
  // sub child?
  if (e instanceof TfPropertyTypeError) {
    property = property + '.' + e.__property

    e = new TfPropertyTypeError(
      e.__type, property, e.__label, e.__value, e.__valueTypeName
    )

  // child?
  } else if (e instanceof TfTypeError) {
    e = new TfPropertyTypeError(
      e.__type, property, label, e.__value, e.__valueTypeName
    )
  }

  Error.captureStackTrace(e)
  return e
}

module.exports = {
  TfTypeError: TfTypeError,
  TfPropertyTypeError: TfPropertyTypeError,
  tfCustomError: tfCustomError,
  tfSubError: tfSubError,
  tfJSON: tfJSON,
  getValueTypeName: getValueTypeName
}

},{"./native":113}],111:[function(require,module,exports){
(function (Buffer){
var NATIVE = require('./native')
var ERRORS = require('./errors')

function _Buffer (value) {
  return Buffer.isBuffer(value)
}

function Hex (value) {
  return typeof value === 'string' && /^([0-9a-f]{2})+$/i.test(value)
}

function _LengthN (type, length) {
  var name = type.toJSON()

  function Length (value) {
    if (!type(value)) return false
    if (value.length === length) return true

    throw ERRORS.tfCustomError(name + '(Length: ' + length + ')', name + '(Length: ' + value.length + ')')
  }
  Length.toJSON = function () { return name }

  return Length
}

var _ArrayN = _LengthN.bind(null, NATIVE.Array)
var _BufferN = _LengthN.bind(null, _Buffer)
var _HexN = _LengthN.bind(null, Hex)
var _StringN = _LengthN.bind(null, NATIVE.String)

var UINT53_MAX = Math.pow(2, 53) - 1

function Finite (value) {
  return typeof value === 'number' && isFinite(value)
}
function Int8 (value) { return ((value << 24) >> 24) === value }
function Int16 (value) { return ((value << 16) >> 16) === value }
function Int32 (value) { return (value | 0) === value }
function UInt8 (value) { return (value & 0xff) === value }
function UInt16 (value) { return (value & 0xffff) === value }
function UInt32 (value) { return (value >>> 0) === value }
function UInt53 (value) {
  return typeof value === 'number' &&
    value >= 0 &&
    value <= UINT53_MAX &&
    Math.floor(value) === value
}

var types = {
  ArrayN: _ArrayN,
  Buffer: _Buffer,
  BufferN: _BufferN,
  Finite: Finite,
  Hex: Hex,
  HexN: _HexN,
  Int8: Int8,
  Int16: Int16,
  Int32: Int32,
  StringN: _StringN,
  UInt8: UInt8,
  UInt16: UInt16,
  UInt32: UInt32,
  UInt53: UInt53
}

for (var typeName in types) {
  types[typeName].toJSON = function (t) {
    return t
  }.bind(null, typeName)
}

module.exports = types

}).call(this,{"isBuffer":require("../../../../../.nvm/versions/node/v6.0.0/lib/node_modules/browserify/node_modules/is-buffer/index.js")})
},{"../../../../../.nvm/versions/node/v6.0.0/lib/node_modules/browserify/node_modules/is-buffer/index.js":10,"./errors":110,"./native":113}],112:[function(require,module,exports){
var ERRORS = require('./errors')
var NATIVE = require('./native')

// short-hand
var tfJSON = ERRORS.tfJSON
var TfTypeError = ERRORS.TfTypeError
var TfPropertyTypeError = ERRORS.TfPropertyTypeError
var tfSubError = ERRORS.tfSubError
var getValueTypeName = ERRORS.getValueTypeName

var TYPES = {
  arrayOf: function arrayOf (type) {
    type = compile(type)

    function _arrayOf (array, strict) {
      if (!NATIVE.Array(array)) return false
      if (NATIVE.Nil(array)) return false

      return array.every(function (value, i) {
        try {
          return typeforce(type, value, strict)
        } catch (e) {
          throw tfSubError(e, i)
        }
      })
    }
    _arrayOf.toJSON = function () { return '[' + tfJSON(type) + ']' }

    return _arrayOf
  },

  maybe: function maybe (type) {
    type = compile(type)

    function _maybe (value, strict) {
      return NATIVE.Nil(value) || type(value, strict, maybe)
    }
    _maybe.toJSON = function () { return '?' + tfJSON(type) }

    return _maybe
  },

  map: function map (propertyType, propertyKeyType) {
    propertyType = compile(propertyType)
    if (propertyKeyType) propertyKeyType = compile(propertyKeyType)

    function _map (value, strict) {
      if (!NATIVE.Object(value)) return false
      if (NATIVE.Nil(value)) return false

      for (var propertyName in value) {
        try {
          if (propertyKeyType) {
            typeforce(propertyKeyType, propertyName, strict)
          }
        } catch (e) {
          throw tfSubError(e, propertyName, 'key')
        }

        try {
          var propertyValue = value[propertyName]
          typeforce(propertyType, propertyValue, strict)
        } catch (e) {
          throw tfSubError(e, propertyName)
        }
      }

      return true
    }

    if (propertyKeyType) {
      _map.toJSON = function () {
        return '{' + tfJSON(propertyKeyType) + ': ' + tfJSON(propertyType) + '}'
      }
    } else {
      _map.toJSON = function () { return '{' + tfJSON(propertyType) + '}' }
    }

    return _map
  },

  object: function object (uncompiled) {
    var type = {}

    for (var typePropertyName in uncompiled) {
      type[typePropertyName] = compile(uncompiled[typePropertyName])
    }

    function _object (value, strict) {
      if (!NATIVE.Object(value)) return false
      if (NATIVE.Nil(value)) return false

      var propertyName

      try {
        for (propertyName in type) {
          var propertyType = type[propertyName]
          var propertyValue = value[propertyName]

          typeforce(propertyType, propertyValue, strict)
        }
      } catch (e) {
        throw tfSubError(e, propertyName)
      }

      if (strict) {
        for (propertyName in value) {
          if (type[propertyName]) continue

          throw new TfPropertyTypeError(undefined, propertyName)
        }
      }

      return true
    }
    _object.toJSON = function () { return tfJSON(type) }

    return _object
  },

  oneOf: function oneOf () {
    var types = [].slice.call(arguments).map(compile)

    function _oneOf (value, strict) {
      return types.some(function (type) {
        try {
          return typeforce(type, value, strict)
        } catch (e) {
          return false
        }
      })
    }
    _oneOf.toJSON = function () { return types.map(tfJSON).join('|') }

    return _oneOf
  },

  quacksLike: function quacksLike (type) {
    function _quacksLike (value) {
      return type === getValueTypeName(value)
    }
    _quacksLike.toJSON = function () { return type }

    return _quacksLike
  },

  tuple: function tuple () {
    var types = [].slice.call(arguments).map(compile)

    function _tuple (values, strict) {
      if (NATIVE.Nil(values)) return false
      if (NATIVE.Nil(values.length)) return false
      if (strict && (values.length !== types.length)) return false

      return types.every(function (type, i) {
        try {
          return typeforce(type, values[i], strict)
        } catch (e) {
          throw tfSubError(e, i)
        }
      })
    }
    _tuple.toJSON = function () { return '(' + types.map(tfJSON).join(', ') + ')' }

    return _tuple
  },

  value: function value (expected) {
    function _value (actual) {
      return actual === expected
    }
    _value.toJSON = function () { return expected }

    return _value
  }
}

function compile (type) {
  if (NATIVE.String(type)) {
    if (type[0] === '?') return TYPES.maybe(type.slice(1))

    return NATIVE[type] || TYPES.quacksLike(type)
  } else if (type && NATIVE.Object(type)) {
    if (NATIVE.Array(type)) return TYPES.arrayOf(type[0])

    return TYPES.object(type)
  } else if (NATIVE.Function(type)) {
    return type
  }

  return TYPES.value(type)
}

function typeforce (type, value, strict, surrogate) {
  if (NATIVE.Function(type)) {
    if (type(value, strict)) return true

    throw new TfTypeError(surrogate || type, value)
  }

  // JIT
  return typeforce(compile(type), value, strict)
}

// assign types to typeforce function
for (var typeName in NATIVE) {
  typeforce[typeName] = NATIVE[typeName]
}

for (typeName in TYPES) {
  typeforce[typeName] = TYPES[typeName]
}

var EXTRA = require('./extra')
for (typeName in EXTRA) {
  typeforce[typeName] = EXTRA[typeName]
}

// async wrapper
function __async (type, value, strict, callback) {
  // default to falsy strict if using shorthand overload
  if (typeof strict === 'function') return __async(type, value, false, strict)

  try {
    typeforce(type, value, strict)
  } catch (e) {
    return callback(e)
  }

  callback()
}

typeforce.async = __async
typeforce.compile = compile
typeforce.TfTypeError = TfTypeError
typeforce.TfPropertyTypeError = TfPropertyTypeError

module.exports = typeforce

},{"./errors":110,"./extra":111,"./native":113}],113:[function(require,module,exports){
var types = {
  Array: function (value) { return value !== null && value !== undefined && value.constructor === Array },
  Boolean: function (value) { return typeof value === 'boolean' },
  Function: function (value) { return typeof value === 'function' },
  Nil: function (value) { return value === undefined || value === null },
  Number: function (value) { return typeof value === 'number' },
  Object: function (value) { return typeof value === 'object' },
  String: function (value) { return typeof value === 'string' },
  '': function () { return true }
}

// TODO: deprecate
types.Null = types.Nil

for (var typeName in types) {
  types[typeName].toJSON = function (t) {
    return t
  }.bind(null, typeName)
}

module.exports = types

},{}],114:[function(require,module,exports){
'use strict'
var Buffer = require('safe-buffer').Buffer

// Number.MAX_SAFE_INTEGER
var MAX_SAFE_INTEGER = 9007199254740991

function checkUInt53 (n) {
  if (n < 0 || n > MAX_SAFE_INTEGER || n % 1 !== 0) throw new RangeError('value out of range')
}

function encode (number, buffer, offset) {
  checkUInt53(number)

  if (!buffer) buffer = Buffer.allocUnsafe(encodingLength(number))
  if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance')
  if (!offset) offset = 0

  // 8 bit
  if (number < 0xfd) {
    buffer.writeUInt8(number, offset)
    encode.bytes = 1

  // 16 bit
  } else if (number <= 0xffff) {
    buffer.writeUInt8(0xfd, offset)
    buffer.writeUInt16LE(number, offset + 1)
    encode.bytes = 3

  // 32 bit
  } else if (number <= 0xffffffff) {
    buffer.writeUInt8(0xfe, offset)
    buffer.writeUInt32LE(number, offset + 1)
    encode.bytes = 5

  // 64 bit
  } else {
    buffer.writeUInt8(0xff, offset)
    buffer.writeUInt32LE(number >>> 0, offset + 1)
    buffer.writeUInt32LE((number / 0x100000000) | 0, offset + 5)
    encode.bytes = 9
  }

  return buffer
}

function decode (buffer, offset) {
  if (!Buffer.isBuffer(buffer)) throw new TypeError('buffer must be a Buffer instance')
  if (!offset) offset = 0

  var first = buffer.readUInt8(offset)

  // 8 bit
  if (first < 0xfd) {
    decode.bytes = 1
    return first

  // 16 bit
  } else if (first === 0xfd) {
    decode.bytes = 3
    return buffer.readUInt16LE(offset + 1)

  // 32 bit
  } else if (first === 0xfe) {
    decode.bytes = 5
    return buffer.readUInt32LE(offset + 1)

  // 64 bit
  } else {
    decode.bytes = 9
    var lo = buffer.readUInt32LE(offset + 1)
    var hi = buffer.readUInt32LE(offset + 5)
    var number = hi * 0x0100000000 + lo
    checkUInt53(number)

    return number
  }
}

function encodingLength (number) {
  checkUInt53(number)

  return (
    number < 0xfd ? 1
  : number <= 0xffff ? 3
  : number <= 0xffffffff ? 5
  : 9
  )
}

module.exports = { encode: encode, decode: decode, encodingLength: encodingLength }

},{"safe-buffer":101}],115:[function(require,module,exports){
(function (Buffer){
var bs58check = require('bs58check')

function decodeRaw (buffer, version) {
  // check version only if defined
  if (version !== undefined && buffer[0] !== version) throw new Error('Invalid network version')

  // uncompressed
  if (buffer.length === 33) {
    return {
      version: buffer[0],
      privateKey: buffer.slice(1, 33),
      compressed: false
    }
  }

  // invalid length
  if (buffer.length !== 34) throw new Error('Invalid WIF length')

  // invalid compression flag
  if (buffer[33] !== 0x01) throw new Error('Invalid compression flag')

  return {
    version: buffer[0],
    privateKey: buffer.slice(1, 33),
    compressed: true
  }
}

function encodeRaw (version, privateKey, compressed) {
  var result = new Buffer(compressed ? 34 : 33)

  result.writeUInt8(version, 0)
  privateKey.copy(result, 1)

  if (compressed) {
    result[33] = 0x01
  }

  return result
}

function decode (string, version) {
  return decodeRaw(bs58check.decode(string), version)
}

function encode (version, privateKey, compressed) {
  if (typeof version === 'number') return bs58check.encode(encodeRaw(version, privateKey, compressed))

  return bs58check.encode(
    encodeRaw(
      version.version,
      version.privateKey,
      version.compressed
    )
  )
}

module.exports = {
  decode: decode,
  decodeRaw: decodeRaw,
  encode: encode,
  encodeRaw: encodeRaw
}

}).call(this,require("buffer").Buffer)
},{"bs58check":83,"buffer":5}]},{},[34])(34)
});
};
rebuild();
window['bip39']={rebuild:rebuild};bitcoinjs.bitcoin.networks.bitcoin={messagePrefix:"\u0018DigiByte Signed Message:\n",bech32:"dgb",bip32:{"public":76067358,"private":76066276},pubKeyHash:30,scriptHash:99,wif:128};bitcoinjs.bitcoin.networks.bitcoin.p2wpkh={baseNetwork:"digibyte",messagePrefix:"\u0018DigiByte Signed Message:\n",bech32:"dgb",bip32:{"public":76067358,"private":76066276},pubKeyHash:30,scriptHash:99,wif:128};
bitcoinjs.bitcoin.networks.bitcoin.p2wpkhInP2sh={baseNetwork:"digibyte",messagePrefix:"\u0018DigiByte Signed Message:\n",bech32:"dgb",bip32:{"public":76067358,"private":76066276},pubKeyHash:30,scriptHash:99,wif:128};(function(){var a=function(b){for(var d=Array.prototype.slice.call(arguments,1),a=0;a<d.length;++a){var q=d[a],p;for(p in q)q.hasOwnProperty(p)&&(b[p]=q[p])}return b},b={get:function(b,a){if(b===a)return 0;if(0===b.length)return a.length;if(0===a.length)return b.length;var d=Array(a.length+1),f,p,c,l,g;for(c=0;c<d.length;++c)d[c]=c;for(c=0;c<b.length;++c){p=c+1;for(l=0;l<a.length;++l)f=p,p=d[l]+(b.charAt(c)===a.charAt(l)?0:1),g=f+1,p>g&&(p=g),g=d[l+1]+1,p>g&&(p=g),d[l]=f;d[l]=p}return p},getAsync:function(b,
f,e,q){q=a({},{progress:null},q);if(b===f)return e(null,0);if(0===b.length)return e(null,f.length);if(0===f.length)return e(null,b.length);var d=Array(f.length+1),c,l,g,h,r,k,n;for(g=0;g<d.length;++g)d[g]=g;l=1;g=0;h=-1;var m=function(){for(n=k=(new Date).valueOf();1E3>n-k;){if(f.length<=++h){d[h]=l;if(b.length<=++g)return e(null,l);l=g+1;h=0}c=l;l=d[h]+(b.charAt(g)===f.charAt(h)?0:1);r=c+1;l>r&&(l=r);r=d[h+1]+1;l>r&&(l=r);d[h]=c;n=(new Date).valueOf()}if(null!==q.progress)try{q.progress.call(null,
100*g/b.length)}catch(M){return e("Progress callback: "+M.toString())}var a=m;"function"===typeof setImmediate?setImmediate(a):setTimeout(a,0)};m()}};"undefined"!==typeof define&&null!==define&&define.amd?define(function(){return b}):"undefined"!==typeof module&&null!==module&&"undefined"!==typeof exports&&module.exports===exports?module.exports=b:"undefined"!==typeof self&&"function"===typeof self.postMessage&&"function"===typeof self.importScripts?self.Levenshtein=b:"undefined"!==typeof window&&
null!==window&&(window.Levenshtein=b)})();var sjcl={cipher:{},hash:{},keyexchange:{},mode:{},misc:{},codec:{},exception:{corrupt:function(a){this.toString=function(){return"CORRUPT: "+this.message};this.message=a},invalid:function(a){this.toString=function(){return"INVALID: "+this.message};this.message=a},bug:function(a){this.toString=function(){return"BUG: "+this.message};this.message=a},notReady:function(a){this.toString=function(){return"NOT READY: "+this.message};this.message=a}}};
"undefined"!==typeof module&&module.exports&&(module.exports=sjcl);"function"===typeof define&&define([],function(){return sjcl});
sjcl.bitArray={bitSlice:function(a,b,d){a=sjcl.bitArray._shiftRight(a.slice(b/32),32-(b&31)).slice(1);return void 0===d?a:sjcl.bitArray.clamp(a,d-b)},extract:function(a,b,d){var f=Math.floor(-b-d&31);return((b+d-1^b)&-32?a[b/32|0]<<32-f^a[b/32+1|0]>>>f:a[b/32|0]>>>f)&(1<<d)-1},concat:function(a,b){if(0===a.length||0===b.length)return a.concat(b);var d=a[a.length-1],f=sjcl.bitArray.getPartial(d);return 32===f?a.concat(b):sjcl.bitArray._shiftRight(b,f,d|0,a.slice(0,a.length-1))},bitLength:function(a){var b=
a.length;return 0===b?0:32*(b-1)+sjcl.bitArray.getPartial(a[b-1])},clamp:function(a,b){if(32*a.length<b)return a;a=a.slice(0,Math.ceil(b/32));var d=a.length;b&=31;0<d&&b&&(a[d-1]=sjcl.bitArray.partial(b,a[d-1]&2147483648>>b-1,1));return a},partial:function(a,b,d){return 32===a?b:(d?b|0:b<<32-a)+1099511627776*a},getPartial:function(a){return Math.round(a/1099511627776)||32},equal:function(a,b){if(sjcl.bitArray.bitLength(a)!==sjcl.bitArray.bitLength(b))return!1;var d=0,f;for(f=0;f<a.length;f++)d|=a[f]^
b[f];return 0===d},_shiftRight:function(a,b,d,f){var e;for(void 0===f&&(f=[]);32<=b;b-=32)f.push(d),d=0;if(0===b)return f.concat(a);for(e=0;e<a.length;e++)f.push(d|a[e]>>>b),d=a[e]<<32-b;a=sjcl.bitArray.getPartial(a.length?a[a.length-1]:0);f.push(sjcl.bitArray.partial(b+a&31,32<b+a?d:f.pop(),1));return f},_xor4:function(a,b){return[a[0]^b[0],a[1]^b[1],a[2]^b[2],a[3]^b[3]]},byteswapM:function(a){var b,d;for(b=0;b<a.length;++b)d=a[b],a[b]=d>>>24|d>>>8&65280|(d&65280)<<8|d<<24;return a}};
sjcl.codec.utf8String={fromBits:function(a){var b="",d=sjcl.bitArray.bitLength(a),f,e;for(f=0;f<d/8;f++)0===(f&3)&&(e=a[f/4]),b+=String.fromCharCode(e>>>24),e<<=8;return decodeURIComponent(escape(b))},toBits:function(a){a=unescape(encodeURIComponent(a));var b=[],d,f=0;for(d=0;d<a.length;d++)f=f<<8|a.charCodeAt(d),3===(d&3)&&(b.push(f),f=0);d&3&&b.push(sjcl.bitArray.partial(8*(d&3),f));return b}};
sjcl.codec.hex={fromBits:function(a){var b="",d;for(d=0;d<a.length;d++)b+=((a[d]|0)+0xf00000000000).toString(16).substr(4);return b.substr(0,sjcl.bitArray.bitLength(a)/4)},toBits:function(a){var b,d=[],f;a=a.replace(/\s|0x/g,"");f=a.length;a+="00000000";for(b=0;b<a.length;b+=8)d.push(parseInt(a.substr(b,8),16)^0);return sjcl.bitArray.clamp(d,4*f)}};sjcl.hash.sha512=function(a){this._key[0]||this._precompute();a?(this._h=a._h.slice(0),this._buffer=a._buffer.slice(0),this._length=a._length):this.reset()};
sjcl.hash.sha512.hash=function(a){return(new sjcl.hash.sha512).update(a).finalize()};
sjcl.hash.sha512.prototype={blockSize:1024,reset:function(){this._h=this._init.slice(0);this._buffer=[];this._length=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,d=this._buffer=sjcl.bitArray.concat(this._buffer,a);b=this._length;a=this._length=b+sjcl.bitArray.bitLength(a);for(b=1024+b&-1024;b<=a;b+=1024)this._block(d.splice(0,32));return this},finalize:function(){var a,b=this._buffer,d=this._h,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);
for(a=b.length+4;a&31;a++)b.push(0);b.push(0);b.push(0);b.push(Math.floor(this._length/4294967296));for(b.push(this._length|0);b.length;)this._block(b.splice(0,32));this.reset();return d},_init:[],_initr:[12372232,13281083,9762859,1914609,15106769,4090911,4308331,8266105],_key:[],_keyr:[2666018,15689165,5061423,9034684,4764984,380953,1658779,7176472,197186,7368638,14987916,16757986,8096111,1480369,13046325,6891156,15813330,5187043,9229749,11312229,2818677,10937475,4324308,1135541,6741931,11809296,
16458047,15666916,11046850,698149,229999,945776,13774844,2541862,12856045,9810911,11494366,7844520,15576806,8533307,15795044,4337665,16291729,5553712,15684120,6662416,7413802,12308920,13816008,4303699,9366425,10176680,13195875,4295371,6546291,11712675,15708924,1519456,15772530,6568428,6495784,8568297,13007125,7492395,2515356,12632583,14740254,7262584,1535930,13146278,16321966,1853211,294276,13051027,13221564,1051980,4080310,6651434,14088940,4675607],_precompute:function(){function a(b){return 4294967296*
(b-Math.floor(b))|0}function b(b){return 1099511627776*(b-Math.floor(b))&255}var d=0,f=2,e;a:for(;80>d;f++){for(e=2;e*e<=f;e++)if(0===f%e)continue a;8>d&&(this._init[2*d]=a(Math.pow(f,.5)),this._init[2*d+1]=b(Math.pow(f,.5))<<24|this._initr[d]);this._key[2*d]=a(Math.pow(f,1/3));this._key[2*d+1]=b(Math.pow(f,1/3))<<24|this._keyr[d];d++}},_block:function(a){var b,d,f=a.slice(0),e=this._h,q=this._key,p=e[0],c=e[1],l=e[2],g=e[3],h=e[4],r=e[5],k=e[6],n=e[7],m=e[8],N=e[9],M=e[10],A=e[11],B=e[12],O=e[13],
W=e[14],P=e[15],x=p,u=c,F=l,D=g,G=h,E=r,S=k,H=n,y=m,w=N,Q=M,I=A,R=B,J=O,T=W,K=P;for(a=0;80>a;a++){if(16>a)b=f[2*a],d=f[2*a+1];else{d=f[2*(a-15)];var t=f[2*(a-15)+1];b=(t<<31|d>>>1)^(t<<24|d>>>8)^d>>>7;var z=(d<<31|t>>>1)^(d<<24|t>>>8)^(d<<25|t>>>7);d=f[2*(a-2)];var C=f[2*(a-2)+1],t=(C<<13|d>>>19)^(d<<3|C>>>29)^d>>>6,C=(d<<13|C>>>19)^(C<<3|d>>>29)^(d<<26|C>>>6),U=f[2*(a-7)],V=f[2*(a-16)],L=f[2*(a-16)+1];d=z+f[2*(a-7)+1];b=b+U+(d>>>0<z>>>0?1:0);d+=C;b+=t+(d>>>0<C>>>0?1:0);d+=L;b+=V+(d>>>0<L>>>0?1:0)}f[2*
a]=b|=0;f[2*a+1]=d|=0;var U=y&Q^~y&R,X=w&I^~w&J,C=x&F^x&G^F&G,Z=u&D^u&E^D&E,V=(u<<4|x>>>28)^(x<<30|u>>>2)^(x<<25|u>>>7),L=(x<<4|u>>>28)^(u<<30|x>>>2)^(u<<25|x>>>7),aa=q[2*a],Y=q[2*a+1],t=K+((y<<18|w>>>14)^(y<<14|w>>>18)^(w<<23|y>>>9)),z=T+((w<<18|y>>>14)^(w<<14|y>>>18)^(y<<23|w>>>9))+(t>>>0<K>>>0?1:0),t=t+X,z=z+(U+(t>>>0<X>>>0?1:0)),t=t+Y,z=z+(aa+(t>>>0<Y>>>0?1:0)),t=t+d|0,z=z+(b+(t>>>0<d>>>0?1:0));d=L+Z;b=V+C+(d>>>0<L>>>0?1:0);T=R;K=J;R=Q;J=I;Q=y;I=w;w=H+t|0;y=S+z+(w>>>0<H>>>0?1:0)|0;S=G;H=E;G=F;
E=D;F=x;D=u;u=t+d|0;x=z+b+(u>>>0<t>>>0?1:0)|0}c=e[1]=c+u|0;e[0]=p+x+(c>>>0<u>>>0?1:0)|0;g=e[3]=g+D|0;e[2]=l+F+(g>>>0<D>>>0?1:0)|0;r=e[5]=r+E|0;e[4]=h+G+(r>>>0<E>>>0?1:0)|0;n=e[7]=n+H|0;e[6]=k+S+(n>>>0<H>>>0?1:0)|0;N=e[9]=N+w|0;e[8]=m+y+(N>>>0<w>>>0?1:0)|0;A=e[11]=A+I|0;e[10]=M+Q+(A>>>0<I>>>0?1:0)|0;O=e[13]=O+J|0;e[12]=B+R+(O>>>0<J>>>0?1:0)|0;P=e[15]=P+K|0;e[14]=W+T+(P>>>0<K>>>0?1:0)|0}};
sjcl.misc.hmac=function(a,b){this._hash=b=b||sjcl.hash.sha256;var d=[[],[]],f,e=b.prototype.blockSize/32;this._baseHash=[new b,new b];a.length>e&&(a=b.hash(a));for(f=0;f<e;f++)d[0][f]=a[f]^909522486,d[1][f]=a[f]^1549556828;this._baseHash[0].update(d[0]);this._baseHash[1].update(d[1]);this._resultHash=new b(this._baseHash[0])};
sjcl.misc.hmac.prototype.encrypt=sjcl.misc.hmac.prototype.mac=function(a){if(this._updated)throw new sjcl.exception.invalid("encrypt on already updated hmac called!");this.update(a);return this.digest(a)};sjcl.misc.hmac.prototype.reset=function(){this._resultHash=new this._hash(this._baseHash[0]);this._updated=!1};sjcl.misc.hmac.prototype.update=function(a){this._updated=!0;this._resultHash.update(a)};
sjcl.misc.hmac.prototype.digest=function(){var a=this._resultHash.finalize(),a=(new this._hash(this._baseHash[1])).update(a).finalize();this.reset();return a};
sjcl.misc.pbkdf2=function(a,b,d,f,e){d=d||1E3;if(0>f||0>d)throw sjcl.exception.invalid("invalid params to pbkdf2");"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));"string"===typeof b&&(b=sjcl.codec.utf8String.toBits(b));e=e||sjcl.misc.hmac;a=new e(a);var q,p,c,l,g=[],h=sjcl.bitArray;for(l=1;32*g.length<(f||1);l++){e=q=a.encrypt(h.concat(b,[l]));for(p=1;p<d;p++)for(q=a.encrypt(q),c=0;c<q.length;c++)e[c]^=q[c];g=g.concat(e)}f&&(g=h.clamp(g,f));return g};
sjcl.hash.sha256=function(a){this._key[0]||this._precompute();a?(this._h=a._h.slice(0),this._buffer=a._buffer.slice(0),this._length=a._length):this.reset()};sjcl.hash.sha256.hash=function(a){return(new sjcl.hash.sha256).update(a).finalize()};
sjcl.hash.sha256.prototype={blockSize:512,reset:function(){this._h=this._init.slice(0);this._buffer=[];this._length=0;return this},update:function(a){"string"===typeof a&&(a=sjcl.codec.utf8String.toBits(a));var b,d=this._buffer=sjcl.bitArray.concat(this._buffer,a);b=this._length;a=this._length=b+sjcl.bitArray.bitLength(a);for(b=512+b&-512;b<=a;b+=512)this._block(d.splice(0,16));return this},finalize:function(){var a,b=this._buffer,d=this._h,b=sjcl.bitArray.concat(b,[sjcl.bitArray.partial(1,1)]);for(a=
b.length+2;a&15;a++)b.push(0);b.push(Math.floor(this._length/4294967296));for(b.push(this._length|0);b.length;)this._block(b.splice(0,16));this.reset();return d},_init:[],_key:[],_precompute:function(){function a(b){return 4294967296*(b-Math.floor(b))|0}var b=0,d=2,f;a:for(;64>b;d++){for(f=2;f*f<=d;f++)if(0===d%f)continue a;8>b&&(this._init[b]=a(Math.pow(d,.5)));this._key[b]=a(Math.pow(d,1/3));b++}},_block:function(a){var b,d,f=a.slice(0),e=this._h,q=this._key,p=e[0],c=e[1],l=e[2],g=e[3],h=e[4],r=
e[5],k=e[6],n=e[7];for(a=0;64>a;a++)16>a?b=f[a]:(b=f[a+1&15],d=f[a+14&15],b=f[a&15]=(b>>>7^b>>>18^b>>>3^b<<25^b<<14)+(d>>>17^d>>>19^d>>>10^d<<15^d<<13)+f[a&15]+f[a+9&15]|0),b=b+n+(h>>>6^h>>>11^h>>>25^h<<26^h<<21^h<<7)+(k^h&(r^k))+q[a],n=k,k=r,r=h,h=g+b|0,g=l,l=c,c=p,p=b+(c&l^g&(c^l))+(c>>>2^c>>>13^c>>>22^c<<30^c<<19^c<<10)|0;e[0]=e[0]+p|0;e[1]=e[1]+c|0;e[2]=e[2]+l|0;e[3]=e[3]+g|0;e[4]=e[4]+h|0;e[5]=e[5]+r|0;e[6]=e[6]+k|0;e[7]=e[7]+n|0}};WORDLISTS={english:"abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual adapt add addict address adjust admit adult advance advice aerobic affair afford afraid again age agent agree ahead aim air airport aisle alarm album alcohol alert alien all alley allow almost alone alpha already also alter always amateur amazing among amount amused analyst anchor ancient anger angle angry animal ankle announce annual another answer antenna antique anxiety any apart apology appear apple approve april arch arctic area arena argue arm armed armor army around arrange arrest arrive arrow art artefact artist artwork ask aspect assault asset assist assume asthma athlete atom attack attend attitude attract auction audit august aunt author auto autumn average avocado avoid awake aware away awesome awful awkward axis baby bachelor bacon badge bag balance balcony ball bamboo banana banner bar barely bargain barrel base basic basket battle beach bean beauty because become beef before begin behave behind believe below belt bench benefit best betray better between beyond bicycle bid bike bind biology bird birth bitter black blade blame blanket blast bleak bless blind blood blossom blouse blue blur blush board boat body boil bomb bone bonus book boost border boring borrow boss bottom bounce box boy bracket brain brand brass brave bread breeze brick bridge brief bright bring brisk broccoli broken bronze broom brother brown brush bubble buddy budget buffalo build bulb bulk bullet bundle bunker burden burger burst bus business busy butter buyer buzz cabbage cabin cable cactus cage cake call calm camera camp can canal cancel candy cannon canoe canvas canyon capable capital captain car carbon card cargo carpet carry cart case cash casino castle casual cat catalog catch category cattle caught cause caution cave ceiling celery cement census century cereal certain chair chalk champion change chaos chapter charge chase chat cheap check cheese chef cherry chest chicken chief child chimney choice choose chronic chuckle chunk churn cigar cinnamon circle citizen city civil claim clap clarify claw clay clean clerk clever click client cliff climb clinic clip clock clog close cloth cloud clown club clump cluster clutch coach coast coconut code coffee coil coin collect color column combine come comfort comic common company concert conduct confirm congress connect consider control convince cook cool copper copy coral core corn correct cost cotton couch country couple course cousin cover coyote crack cradle craft cram crane crash crater crawl crazy cream credit creek crew cricket crime crisp critic crop cross crouch crowd crucial cruel cruise crumble crunch crush cry crystal cube culture cup cupboard curious current curtain curve cushion custom cute cycle dad damage damp dance danger daring dash daughter dawn day deal debate debris decade december decide decline decorate decrease deer defense define defy degree delay deliver demand demise denial dentist deny depart depend deposit depth deputy derive describe desert design desk despair destroy detail detect develop device devote diagram dial diamond diary dice diesel diet differ digital dignity dilemma dinner dinosaur direct dirt disagree discover disease dish dismiss disorder display distance divert divide divorce dizzy doctor document dog doll dolphin domain donate donkey donor door dose double dove draft dragon drama drastic draw dream dress drift drill drink drip drive drop drum dry duck dumb dune during dust dutch duty dwarf dynamic eager eagle early earn earth easily east easy echo ecology economy edge edit educate effort egg eight either elbow elder electric elegant element elephant elevator elite else embark embody embrace emerge emotion employ empower empty enable enact end endless endorse enemy energy enforce engage engine enhance enjoy enlist enough enrich enroll ensure enter entire entry envelope episode equal equip era erase erode erosion error erupt escape essay essence estate eternal ethics evidence evil evoke evolve exact example excess exchange excite exclude excuse execute exercise exhaust exhibit exile exist exit exotic expand expect expire explain expose express extend extra eye eyebrow fabric face faculty fade faint faith fall false fame family famous fan fancy fantasy farm fashion fat fatal father fatigue fault favorite feature february federal fee feed feel female fence festival fetch fever few fiber fiction field figure file film filter final find fine finger finish fire firm first fiscal fish fit fitness fix flag flame flash flat flavor flee flight flip float flock floor flower fluid flush fly foam focus fog foil fold follow food foot force forest forget fork fortune forum forward fossil foster found fox fragile frame frequent fresh friend fringe frog front frost frown frozen fruit fuel fun funny furnace fury future gadget gain galaxy gallery game gap garage garbage garden garlic garment gas gasp gate gather gauge gaze general genius genre gentle genuine gesture ghost giant gift giggle ginger giraffe girl give glad glance glare glass glide glimpse globe gloom glory glove glow glue goat goddess gold good goose gorilla gospel gossip govern gown grab grace grain grant grape grass gravity great green grid grief grit grocery group grow grunt guard guess guide guilt guitar gun gym habit hair half hammer hamster hand happy harbor hard harsh harvest hat have hawk hazard head health heart heavy hedgehog height hello helmet help hen hero hidden high hill hint hip hire history hobby hockey hold hole holiday hollow home honey hood hope horn horror horse hospital host hotel hour hover hub huge human humble humor hundred hungry hunt hurdle hurry hurt husband hybrid ice icon idea identify idle ignore ill illegal illness image imitate immense immune impact impose improve impulse inch include income increase index indicate indoor industry infant inflict inform inhale inherit initial inject injury inmate inner innocent input inquiry insane insect inside inspire install intact interest into invest invite involve iron island isolate issue item ivory jacket jaguar jar jazz jealous jeans jelly jewel job join joke journey joy judge juice jump jungle junior junk just kangaroo keen keep ketchup key kick kid kidney kind kingdom kiss kit kitchen kite kitten kiwi knee knife knock know lab label labor ladder lady lake lamp language laptop large later latin laugh laundry lava law lawn lawsuit layer lazy leader leaf learn leave lecture left leg legal legend leisure lemon lend length lens leopard lesson letter level liar liberty library license life lift light like limb limit link lion liquid list little live lizard load loan lobster local lock logic lonely long loop lottery loud lounge love loyal lucky luggage lumber lunar lunch luxury lyrics machine mad magic magnet maid mail main major make mammal man manage mandate mango mansion manual maple marble march margin marine market marriage mask mass master match material math matrix matter maximum maze meadow mean measure meat mechanic medal media melody melt member memory mention menu mercy merge merit merry mesh message metal method middle midnight milk million mimic mind minimum minor minute miracle mirror misery miss mistake mix mixed mixture mobile model modify mom moment monitor monkey monster month moon moral more morning mosquito mother motion motor mountain mouse move movie much muffin mule multiply muscle museum mushroom music must mutual myself mystery myth naive name napkin narrow nasty nation nature near neck need negative neglect neither nephew nerve nest net network neutral never news next nice night noble noise nominee noodle normal north nose notable note nothing notice novel now nuclear number nurse nut oak obey object oblige obscure observe obtain obvious occur ocean october odor off offer office often oil okay old olive olympic omit once one onion online only open opera opinion oppose option orange orbit orchard order ordinary organ orient original orphan ostrich other outdoor outer output outside oval oven over own owner oxygen oyster ozone pact paddle page pair palace palm panda panel panic panther paper parade parent park parrot party pass patch path patient patrol pattern pause pave payment peace peanut pear peasant pelican pen penalty pencil people pepper perfect permit person pet phone photo phrase physical piano picnic picture piece pig pigeon pill pilot pink pioneer pipe pistol pitch pizza place planet plastic plate play please pledge pluck plug plunge poem poet point polar pole police pond pony pool popular portion position possible post potato pottery poverty powder power practice praise predict prefer prepare present pretty prevent price pride primary print priority prison private prize problem process produce profit program project promote proof property prosper protect proud provide public pudding pull pulp pulse pumpkin punch pupil puppy purchase purity purpose purse push put puzzle pyramid quality quantum quarter question quick quit quiz quote rabbit raccoon race rack radar radio rail rain raise rally ramp ranch random range rapid rare rate rather raven raw razor ready real reason rebel rebuild recall receive recipe record recycle reduce reflect reform refuse region regret regular reject relax release relief rely remain remember remind remove render renew rent reopen repair repeat replace report require rescue resemble resist resource response result retire retreat return reunion reveal review reward rhythm rib ribbon rice rich ride ridge rifle right rigid ring riot ripple risk ritual rival river road roast robot robust rocket romance roof rookie room rose rotate rough round route royal rubber rude rug rule run runway rural sad saddle sadness safe sail salad salmon salon salt salute same sample sand satisfy satoshi sauce sausage save say scale scan scare scatter scene scheme school science scissors scorpion scout scrap screen script scrub sea search season seat second secret section security seed seek segment select sell seminar senior sense sentence series service session settle setup seven shadow shaft shallow share shed shell sheriff shield shift shine ship shiver shock shoe shoot shop short shoulder shove shrimp shrug shuffle shy sibling sick side siege sight sign silent silk silly silver similar simple since sing siren sister situate six size skate sketch ski skill skin skirt skull slab slam sleep slender slice slide slight slim slogan slot slow slush small smart smile smoke smooth snack snake snap sniff snow soap soccer social sock soda soft solar soldier solid solution solve someone song soon sorry sort soul sound soup source south space spare spatial spawn speak special speed spell spend sphere spice spider spike spin spirit split spoil sponsor spoon sport spot spray spread spring spy square squeeze squirrel stable stadium staff stage stairs stamp stand start state stay steak steel stem step stereo stick still sting stock stomach stone stool story stove strategy street strike strong struggle student stuff stumble style subject submit subway success such sudden suffer sugar suggest suit summer sun sunny sunset super supply supreme sure surface surge surprise surround survey suspect sustain swallow swamp swap swarm swear sweet swift swim swing switch sword symbol symptom syrup system table tackle tag tail talent talk tank tape target task taste tattoo taxi teach team tell ten tenant tennis tent term test text thank that theme then theory there they thing this thought three thrive throw thumb thunder ticket tide tiger tilt timber time tiny tip tired tissue title toast tobacco today toddler toe together toilet token tomato tomorrow tone tongue tonight tool tooth top topic topple torch tornado tortoise toss total tourist toward tower town toy track trade traffic tragic train transfer trap trash travel tray treat tree trend trial tribe trick trigger trim trip trophy trouble truck true truly trumpet trust truth try tube tuition tumble tuna tunnel turkey turn turtle twelve twenty twice twin twist two type typical ugly umbrella unable unaware uncle uncover under undo unfair unfold unhappy uniform unique unit universe unknown unlock until unusual unveil update upgrade uphold upon upper upset urban urge usage use used useful useless usual utility vacant vacuum vague valid valley valve van vanish vapor various vast vault vehicle velvet vendor venture venue verb verify version very vessel veteran viable vibrant vicious victory video view village vintage violin virtual virus visa visit visual vital vivid vocal voice void volcano volume vote voyage wage wagon wait walk wall walnut want warfare warm warrior wash wasp waste water wave way wealth weapon wear weasel weather web wedding weekend weird welcome west wet whale what wheat wheel when where whip whisper wide width wife wild will win window wine wing wink winner winter wire wisdom wise wish witness wolf woman wonder wood wool word work world worry worth wrap wreck wrestle wrist write wrong yard year yellow you young youth zebra zero zone zoo".split(" "),
french:"abaisser abandon abdiquer abeille abolir aborder aboutir aboyer abrasif abreuver abriter abroger abrupt absence absolu absurde abusif abyssal acade\u0301mie acajou acarien accabler accepter acclamer accolade accroche accuser acerbe achat acheter aciduler acier acompte acque\u0301rir acronyme acteur actif actuel adepte ade\u0301quat adhe\u0301sif adjectif adjuger admettre admirer adopter adorer adoucir adresse adroit adulte adverbe ae\u0301rer ae\u0301ronef affaire affecter affiche affreux affubler agacer agencer agile agiter agrafer agre\u0301able agrume aider aiguille ailier aimable aisance ajouter ajuster alarmer alchimie alerte alge\u0300bre algue alie\u0301ner aliment alle\u0301ger alliage allouer allumer alourdir alpaga altesse alve\u0301ole amateur ambigu ambre ame\u0301nager amertume amidon amiral amorcer amour amovible amphibie ampleur amusant analyse anaphore anarchie anatomie ancien ane\u0301antir angle angoisse anguleux animal annexer annonce annuel anodin anomalie anonyme anormal antenne antidote anxieux apaiser ape\u0301ritif aplanir apologie appareil appeler apporter appuyer aquarium aqueduc arbitre arbuste ardeur ardoise argent arlequin armature armement armoire armure arpenter arracher arriver arroser arsenic arte\u0301riel article aspect asphalte aspirer assaut asservir assiette associer assurer asticot astre astuce atelier atome atrium atroce attaque attentif attirer attraper aubaine auberge audace audible augurer aurore automne autruche avaler avancer avarice avenir averse aveugle aviateur avide avion aviser avoine avouer avril axial axiome badge bafouer bagage baguette baignade balancer balcon baleine balisage bambin bancaire bandage banlieue bannie\u0300re banquier barbier baril baron barque barrage bassin bastion bataille bateau batterie baudrier bavarder belette be\u0301lier belote be\u0301ne\u0301fice berceau berger berline bermuda besace besogne be\u0301tail beurre biberon bicycle bidule bijou bilan bilingue billard binaire biologie biopsie biotype biscuit bison bistouri bitume bizarre blafard blague blanchir blessant blinder blond bloquer blouson bobard bobine boire boiser bolide bonbon bondir bonheur bonifier bonus bordure borne botte boucle boueux bougie boulon bouquin bourse boussole boutique boxeur branche brasier brave brebis bre\u0300che breuvage bricoler brigade brillant brioche brique brochure broder bronzer brousse broyeur brume brusque brutal bruyant buffle buisson bulletin bureau burin bustier butiner butoir buvable buvette cabanon cabine cachette cadeau cadre cafe\u0301ine caillou caisson calculer calepin calibre calmer calomnie calvaire camarade came\u0301ra camion campagne canal caneton canon cantine canular capable caporal caprice capsule capter capuche carabine carbone caresser caribou carnage carotte carreau carton cascade casier casque cassure causer caution cavalier caverne caviar ce\u0301dille ceinture ce\u0301leste cellule cendrier censurer central cercle ce\u0301re\u0301bral cerise cerner cerveau cesser chagrin chaise chaleur chambre chance chapitre charbon chasseur chaton chausson chavirer chemise chenille che\u0301quier chercher cheval chien chiffre chignon chime\u0300re chiot chlorure chocolat choisir chose chouette chrome chute cigare cigogne cimenter cine\u0301ma cintrer circuler cirer cirque citerne citoyen citron civil clairon clameur claquer classe clavier client cligner climat clivage cloche clonage cloporte cobalt cobra cocasse cocotier coder codifier coffre cogner cohe\u0301sion coiffer coincer cole\u0300re colibri colline colmater colonel combat come\u0301die commande compact concert conduire confier congeler connoter consonne contact convexe copain copie corail corbeau cordage corniche corpus correct corte\u0300ge cosmique costume coton coude coupure courage couteau couvrir coyote crabe crainte cravate crayon cre\u0301ature cre\u0301diter cre\u0301meux creuser crevette cribler crier cristal crite\u0300re croire croquer crotale crucial cruel crypter cubique cueillir cuille\u0300re cuisine cuivre culminer cultiver cumuler cupide curatif curseur cyanure cycle cylindre cynique daigner damier danger danseur dauphin de\u0301battre de\u0301biter de\u0301border de\u0301brider de\u0301butant de\u0301caler de\u0301cembre de\u0301chirer de\u0301cider de\u0301clarer de\u0301corer de\u0301crire de\u0301cupler de\u0301dale de\u0301ductif de\u0301esse de\u0301fensif de\u0301filer de\u0301frayer de\u0301gager de\u0301givrer de\u0301glutir de\u0301grafer de\u0301jeuner de\u0301lice de\u0301loger demander demeurer de\u0301molir de\u0301nicher de\u0301nouer dentelle de\u0301nuder de\u0301part de\u0301penser de\u0301phaser de\u0301placer de\u0301poser de\u0301ranger de\u0301rober de\u0301sastre descente de\u0301sert de\u0301signer de\u0301sobe\u0301ir dessiner destrier de\u0301tacher de\u0301tester de\u0301tourer de\u0301tresse devancer devenir deviner devoir diable dialogue diamant dicter diffe\u0301rer dige\u0301rer digital digne diluer dimanche diminuer dioxyde directif diriger discuter disposer dissiper distance divertir diviser docile docteur dogme doigt domaine domicile dompter donateur donjon donner dopamine dortoir dorure dosage doseur dossier dotation douanier double douceur douter doyen dragon draper dresser dribbler droiture duperie duplexe durable durcir dynastie e\u0301blouir e\u0301carter e\u0301charpe e\u0301chelle e\u0301clairer e\u0301clipse e\u0301clore e\u0301cluse e\u0301cole e\u0301conomie e\u0301corce e\u0301couter e\u0301craser e\u0301cre\u0301mer e\u0301crivain e\u0301crou e\u0301cume e\u0301cureuil e\u0301difier e\u0301duquer effacer effectif effigie effort effrayer effusion e\u0301galiser e\u0301garer e\u0301jecter e\u0301laborer e\u0301largir e\u0301lectron e\u0301le\u0301gant e\u0301le\u0301phant e\u0301le\u0300ve e\u0301ligible e\u0301litisme e\u0301loge e\u0301lucider e\u0301luder emballer embellir embryon e\u0301meraude e\u0301mission emmener e\u0301motion e\u0301mouvoir empereur employer emporter emprise e\u0301mulsion encadrer enche\u0300re enclave encoche endiguer endosser endroit enduire e\u0301nergie enfance enfermer enfouir engager engin englober e\u0301nigme enjamber enjeu enlever ennemi ennuyeux enrichir enrobage enseigne entasser entendre entier entourer entraver e\u0301nume\u0301rer envahir enviable envoyer enzyme e\u0301olien e\u0301paissir e\u0301pargne e\u0301patant e\u0301paule e\u0301picerie e\u0301pide\u0301mie e\u0301pier e\u0301pilogue e\u0301pine e\u0301pisode e\u0301pitaphe e\u0301poque e\u0301preuve e\u0301prouver e\u0301puisant e\u0301querre e\u0301quipe e\u0301riger e\u0301rosion erreur e\u0301ruption escalier espadon espe\u0300ce espie\u0300gle espoir esprit esquiver essayer essence essieu essorer estime estomac estrade e\u0301tage\u0300re e\u0301taler e\u0301tanche e\u0301tatique e\u0301teindre e\u0301tendoir e\u0301ternel e\u0301thanol e\u0301thique ethnie e\u0301tirer e\u0301toffer e\u0301toile e\u0301tonnant e\u0301tourdir e\u0301trange e\u0301troit e\u0301tude euphorie e\u0301valuer e\u0301vasion e\u0301ventail e\u0301vidence e\u0301viter e\u0301volutif e\u0301voquer exact exage\u0301rer exaucer exceller excitant exclusif excuse exe\u0301cuter exemple exercer exhaler exhorter exigence exiler exister exotique expe\u0301dier explorer exposer exprimer exquis extensif extraire exulter fable fabuleux facette facile facture faiblir falaise fameux famille farceur farfelu farine farouche fasciner fatal fatigue faucon fautif faveur favori fe\u0301brile fe\u0301conder fe\u0301de\u0301rer fe\u0301lin femme fe\u0301mur fendoir fe\u0301odal fermer fe\u0301roce ferveur festival feuille feutre fe\u0301vrier fiasco ficeler fictif fide\u0300le figure filature filetage filie\u0300re filleul filmer filou filtrer financer finir fiole firme fissure fixer flairer flamme flasque flatteur fle\u0301au fle\u0300che fleur flexion flocon flore fluctuer fluide fluvial folie fonderie fongible fontaine forcer forgeron formuler fortune fossile foudre fouge\u0300re fouiller foulure fourmi fragile fraise franchir frapper frayeur fre\u0301gate freiner frelon fre\u0301mir fre\u0301ne\u0301sie fre\u0300re friable friction frisson frivole froid fromage frontal frotter fruit fugitif fuite fureur furieux furtif fusion futur gagner galaxie galerie gambader garantir gardien garnir garrigue gazelle gazon ge\u0301ant ge\u0301latine ge\u0301lule gendarme ge\u0301ne\u0301ral ge\u0301nie genou gentil ge\u0301ologie ge\u0301ome\u0300tre ge\u0301ranium germe gestuel geyser gibier gicler girafe givre glace glaive glisser globe gloire glorieux golfeur gomme gonfler gorge gorille goudron gouffre goulot goupille gourmand goutte graduel graffiti graine grand grappin gratuit gravir grenat griffure griller grimper grogner gronder grotte groupe gruger grutier gruye\u0300re gue\u0301pard guerrier guide guimauve guitare gustatif gymnaste gyrostat habitude hachoir halte hameau hangar hanneton haricot harmonie harpon hasard he\u0301lium he\u0301matome herbe he\u0301risson hermine he\u0301ron he\u0301siter heureux hiberner hibou hilarant histoire hiver homard hommage homoge\u0300ne honneur honorer honteux horde horizon horloge hormone horrible houleux housse hublot huileux humain humble humide humour hurler hydromel hygie\u0300ne hymne hypnose idylle ignorer iguane illicite illusion image imbiber imiter immense immobile immuable impact impe\u0301rial implorer imposer imprimer imputer incarner incendie incident incliner incolore indexer indice inductif ine\u0301dit ineptie inexact infini infliger informer infusion inge\u0301rer inhaler inhiber injecter injure innocent inoculer inonder inscrire insecte insigne insolite inspirer instinct insulter intact intense intime intrigue intuitif inutile invasion inventer inviter invoquer ironique irradier irre\u0301el irriter isoler ivoire ivresse jaguar jaillir jambe janvier jardin jauger jaune javelot jetable jeton jeudi jeunesse joindre joncher jongler joueur jouissif journal jovial joyau joyeux jubiler jugement junior jupon juriste justice juteux juve\u0301nile kayak kimono kiosque label labial labourer lace\u0301rer lactose lagune laine laisser laitier lambeau lamelle lampe lanceur langage lanterne lapin largeur larme laurier lavabo lavoir lecture le\u0301gal le\u0301ger le\u0301gume lessive lettre levier lexique le\u0301zard liasse libe\u0301rer libre licence licorne lie\u0300ge lie\u0300vre ligature ligoter ligue limer limite limonade limpide line\u0301aire lingot lionceau liquide lisie\u0300re lister lithium litige littoral livreur logique lointain loisir lombric loterie louer lourd loutre louve loyal lubie lucide lucratif lueur lugubre luisant lumie\u0300re lunaire lundi luron lutter luxueux machine magasin magenta magique maigre maillon maintien mairie maison majorer malaxer male\u0301fice malheur malice mallette mammouth mandater maniable manquant manteau manuel marathon marbre marchand mardi maritime marqueur marron marteler mascotte massif mate\u0301riel matie\u0300re matraque maudire maussade mauve maximal me\u0301chant me\u0301connu me\u0301daille me\u0301decin me\u0301diter me\u0301duse meilleur me\u0301lange me\u0301lodie membre me\u0301moire menacer mener menhir mensonge mentor mercredi me\u0301rite merle messager mesure me\u0301tal me\u0301te\u0301ore me\u0301thode me\u0301tier meuble miauler microbe miette mignon migrer milieu million mimique mince mine\u0301ral minimal minorer minute miracle miroiter missile mixte mobile moderne moelleux mondial moniteur monnaie monotone monstre montagne monument moqueur morceau morsure mortier moteur motif mouche moufle moulin mousson mouton mouvant multiple munition muraille mure\u0300ne murmure muscle muse\u0301um musicien mutation muter mutuel myriade myrtille myste\u0300re mythique nageur nappe narquois narrer natation nation nature naufrage nautique navire ne\u0301buleux nectar ne\u0301faste ne\u0301gation ne\u0301gliger ne\u0301gocier neige nerveux nettoyer neurone neutron neveu niche nickel nitrate niveau noble nocif nocturne noirceur noisette nomade nombreux nommer normatif notable notifier notoire nourrir nouveau novateur novembre novice nuage nuancer nuire nuisible nume\u0301ro nuptial nuque nutritif obe\u0301ir objectif obliger obscur observer obstacle obtenir obturer occasion occuper oce\u0301an octobre octroyer octupler oculaire odeur odorant offenser officier offrir ogive oiseau oisillon olfactif olivier ombrage omettre onctueux onduler one\u0301reux onirique opale opaque ope\u0301rer opinion opportun opprimer opter optique orageux orange orbite ordonner oreille organe orgueil orifice ornement orque ortie osciller osmose ossature otarie ouragan ourson outil outrager ouvrage ovation oxyde oxyge\u0300ne ozone paisible palace palmare\u0300s palourde palper panache panda pangolin paniquer panneau panorama pantalon papaye papier papoter papyrus paradoxe parcelle paresse parfumer parler parole parrain parsemer partager parure parvenir passion paste\u0300que paternel patience patron pavillon pavoiser payer paysage peigne peintre pelage pe\u0301lican pelle pelouse peluche pendule pe\u0301ne\u0301trer pe\u0301nible pensif pe\u0301nurie pe\u0301pite pe\u0301plum perdrix perforer pe\u0301riode permuter perplexe persil perte peser pe\u0301tale petit pe\u0301trir peuple pharaon phobie phoque photon phrase physique piano pictural pie\u0300ce pierre pieuvre pilote pinceau pipette piquer pirogue piscine piston pivoter pixel pizza placard plafond plaisir planer plaque plastron plateau pleurer plexus pliage plomb plonger pluie plumage pochette poe\u0301sie poe\u0300te pointe poirier poisson poivre polaire policier pollen polygone pommade pompier ponctuel ponde\u0301rer poney portique position posse\u0301der posture potager poteau potion pouce poulain poumon pourpre poussin pouvoir prairie pratique pre\u0301cieux pre\u0301dire pre\u0301fixe pre\u0301lude pre\u0301nom pre\u0301sence pre\u0301texte pre\u0301voir primitif prince prison priver proble\u0300me proce\u0301der prodige profond progre\u0300s proie projeter prologue promener propre prospe\u0300re prote\u0301ger prouesse proverbe prudence pruneau psychose public puceron puiser pulpe pulsar punaise punitif pupitre purifier puzzle pyramide quasar querelle question quie\u0301tude quitter quotient racine raconter radieux ragondin raideur raisin ralentir rallonge ramasser rapide rasage ratisser ravager ravin rayonner re\u0301actif re\u0301agir re\u0301aliser re\u0301animer recevoir re\u0301citer re\u0301clamer re\u0301colter recruter reculer recycler re\u0301diger redouter refaire re\u0301flexe re\u0301former refrain refuge re\u0301galien re\u0301gion re\u0301glage re\u0301gulier re\u0301ite\u0301rer rejeter rejouer relatif relever relief remarque reme\u0300de remise remonter remplir remuer renard renfort renifler renoncer rentrer renvoi replier reporter reprise reptile requin re\u0301serve re\u0301sineux re\u0301soudre respect rester re\u0301sultat re\u0301tablir retenir re\u0301ticule retomber retracer re\u0301union re\u0301ussir revanche revivre re\u0301volte re\u0301vulsif richesse rideau rieur rigide rigoler rincer riposter risible risque rituel rival rivie\u0300re rocheux romance rompre ronce rondin roseau rosier rotatif rotor rotule rouge rouille rouleau routine royaume ruban rubis ruche ruelle rugueux ruiner ruisseau ruser rustique rythme sabler saboter sabre sacoche safari sagesse saisir salade salive salon saluer samedi sanction sanglier sarcasme sardine saturer saugrenu saumon sauter sauvage savant savonner scalpel scandale sce\u0301le\u0301rat sce\u0301nario sceptre sche\u0301ma science scinder score scrutin sculpter se\u0301ance se\u0301cable se\u0301cher secouer se\u0301cre\u0301ter se\u0301datif se\u0301duire seigneur se\u0301jour se\u0301lectif semaine sembler semence se\u0301minal se\u0301nateur sensible sentence se\u0301parer se\u0301quence serein sergent se\u0301rieux serrure se\u0301rum service se\u0301same se\u0301vir sevrage sextuple side\u0301ral sie\u0300cle sie\u0301ger siffler sigle signal silence silicium simple since\u0300re sinistre siphon sirop sismique situer skier social socle sodium soigneux soldat soleil solitude soluble sombre sommeil somnoler sonde songeur sonnette sonore sorcier sortir sosie sottise soucieux soudure souffle soulever soupape source soutirer souvenir spacieux spatial spe\u0301cial sphe\u0300re spiral stable station sternum stimulus stipuler strict studieux stupeur styliste sublime substrat subtil subvenir succe\u0300s sucre suffixe sugge\u0301rer suiveur sulfate superbe supplier surface suricate surmener surprise sursaut survie suspect syllabe symbole syme\u0301trie synapse syntaxe syste\u0300me tabac tablier tactile tailler talent talisman talonner tambour tamiser tangible tapis taquiner tarder tarif tartine tasse tatami tatouage taupe taureau taxer te\u0301moin temporel tenaille tendre teneur tenir tension terminer terne terrible te\u0301tine texte the\u0300me the\u0301orie the\u0301rapie thorax tibia tie\u0300de timide tirelire tiroir tissu titane titre tituber toboggan tole\u0301rant tomate tonique tonneau toponyme torche tordre tornade torpille torrent torse tortue totem toucher tournage tousser toxine traction trafic tragique trahir train trancher travail tre\u0300fle tremper tre\u0301sor treuil triage tribunal tricoter trilogie triomphe tripler triturer trivial trombone tronc tropical troupeau tuile tulipe tumulte tunnel turbine tuteur tutoyer tuyau tympan typhon typique tyran ubuesque ultime ultrason unanime unifier union unique unitaire univers uranium urbain urticant usage usine usuel usure utile utopie vacarme vaccin vagabond vague vaillant vaincre vaisseau valable valise vallon valve vampire vanille vapeur varier vaseux vassal vaste vecteur vedette ve\u0301ge\u0301tal ve\u0301hicule veinard ve\u0301loce vendredi ve\u0301ne\u0301rer venger venimeux ventouse verdure ve\u0301rin vernir verrou verser vertu veston ve\u0301te\u0301ran ve\u0301tuste vexant vexer viaduc viande victoire vidange vide\u0301o vignette vigueur vilain village vinaigre violon vipe\u0300re virement virtuose virus visage viseur vision visqueux visuel vital vitesse viticole vitrine vivace vivipare vocation voguer voile voisin voiture volaille volcan voltiger volume vorace vortex voter vouloir voyage voyelle wagon xe\u0301non yacht ze\u0300bre ze\u0301nith zeste zoologie".split(" "),
italian:"abaco abbaglio abbinato abete abisso abolire abrasivo abrogato accadere accenno accusato acetone achille acido acqua acre acrilico acrobata acuto adagio addebito addome adeguato aderire adipe adottare adulare affabile affetto affisso affranto aforisma afoso africano agave agente agevole aggancio agire agitare agonismo agricolo agrumeto aguzzo alabarda alato albatro alberato albo albume alce alcolico alettone alfa algebra aliante alibi alimento allagato allegro allievo allodola allusivo almeno alogeno alpaca alpestre altalena alterno alticcio altrove alunno alveolo alzare amalgama amanita amarena ambito ambrato ameba america ametista amico ammasso ammenda ammirare ammonito amore ampio ampliare amuleto anacardo anagrafe analista anarchia anatra anca ancella ancora andare andrea anello angelo angolare angusto anima annegare annidato anno annuncio anonimo anticipo anzi apatico apertura apode apparire appetito appoggio approdo appunto aprile arabica arachide aragosta araldica arancio aratura arazzo arbitro archivio ardito arenile argento argine arguto aria armonia arnese arredato arringa arrosto arsenico arso artefice arzillo asciutto ascolto asepsi asettico asfalto asino asola aspirato aspro assaggio asse assoluto assurdo asta astenuto astice astratto atavico ateismo atomico atono attesa attivare attorno attrito attuale ausilio austria autista autonomo autunno avanzato avere avvenire avviso avvolgere azione azoto azzimo azzurro babele baccano bacino baco badessa badilata bagnato baita balcone baldo balena ballata balzano bambino bandire baraonda barbaro barca baritono barlume barocco basilico basso batosta battuto baule bava bavosa becco beffa belgio belva benda benevole benigno benzina bere berlina beta bibita bici bidone bifido biga bilancia bimbo binocolo biologo bipede bipolare birbante birra biscotto bisesto bisnonno bisonte bisturi bizzarro blando blatta bollito bonifico bordo bosco botanico bottino bozzolo braccio bradipo brama branca bravura bretella brevetto brezza briglia brillante brindare broccolo brodo bronzina brullo bruno bubbone buca budino buffone buio bulbo buono burlone burrasca bussola busta cadetto caduco calamaro calcolo calesse calibro calmo caloria cambusa camerata camicia cammino camola campale canapa candela cane canino canotto cantina capace capello capitolo capogiro cappero capra capsula carapace carcassa cardo carisma carovana carretto cartolina casaccio cascata caserma caso cassone castello casuale catasta catena catrame cauto cavillo cedibile cedrata cefalo celebre cellulare cena cenone centesimo ceramica cercare certo cerume cervello cesoia cespo ceto chela chiaro chicca chiedere chimera china chirurgo chitarra ciao ciclismo cifrare cigno cilindro ciottolo circa cirrosi citrico cittadino ciuffo civetta civile classico clinica cloro cocco codardo codice coerente cognome collare colmato colore colposo coltivato colza coma cometa commando comodo computer comune conciso condurre conferma congelare coniuge connesso conoscere consumo continuo convegno coperto copione coppia copricapo corazza cordata coricato cornice corolla corpo corredo corsia cortese cosmico costante cottura covato cratere cravatta creato credere cremoso crescita creta criceto crinale crisi critico croce cronaca crostata cruciale crusca cucire cuculo cugino cullato cupola curatore cursore curvo cuscino custode dado daino dalmata damerino daniela dannoso danzare datato davanti davvero debutto decennio deciso declino decollo decreto dedicato definito deforme degno delegare delfino delirio delta demenza denotato dentro deposito derapata derivare deroga descritto deserto desiderio desumere detersivo devoto diametro dicembre diedro difeso diffuso digerire digitale diluvio dinamico dinnanzi dipinto diploma dipolo diradare dire dirotto dirupo disagio discreto disfare disgelo disposto distanza disumano dito divano divelto dividere divorato doblone docente doganale dogma dolce domato domenica dominare dondolo dono dormire dote dottore dovuto dozzina drago druido dubbio dubitare ducale duna duomo duplice duraturo ebano eccesso ecco eclissi economia edera edicola edile editoria educare egemonia egli egoismo egregio elaborato elargire elegante elencato eletto elevare elfico elica elmo elsa eluso emanato emblema emesso emiro emotivo emozione empirico emulo endemico enduro energia enfasi enoteca entrare enzima epatite epilogo episodio epocale eppure equatore erario erba erboso erede eremita erigere ermetico eroe erosivo errante esagono esame esanime esaudire esca esempio esercito esibito esigente esistere esito esofago esortato esoso espanso espresso essenza esso esteso estimare estonia estroso esultare etilico etnico etrusco etto euclideo europa evaso evidenza evitato evoluto evviva fabbrica faccenda fachiro falco famiglia fanale fanfara fango fantasma fare farfalla farinoso farmaco fascia fastoso fasullo faticare fato favoloso febbre fecola fede fegato felpa feltro femmina fendere fenomeno fermento ferro fertile fessura festivo fetta feudo fiaba fiducia fifa figurato filo finanza finestra finire fiore fiscale fisico fiume flacone flamenco flebo flemma florido fluente fluoro fobico focaccia focoso foderato foglio folata folclore folgore fondente fonetico fonia fontana forbito forchetta foresta formica fornaio foro fortezza forzare fosfato fosso fracasso frana frassino fratello freccetta frenata fresco frigo frollino fronde frugale frutta fucilata fucsia fuggente fulmine fulvo fumante fumetto fumoso fune funzione fuoco furbo furgone furore fuso futile gabbiano gaffe galateo gallina galoppo gambero gamma garanzia garbo garofano garzone gasdotto gasolio gastrico gatto gaudio gazebo gazzella geco gelatina gelso gemello gemmato gene genitore gennaio genotipo gergo ghepardo ghiaccio ghisa giallo gilda ginepro giocare gioiello giorno giove girato girone gittata giudizio giurato giusto globulo glutine gnomo gobba golf gomito gommone gonfio gonna governo gracile grado grafico grammo grande grattare gravoso grazia greca gregge grifone grigio grinza grotta gruppo guadagno guaio guanto guardare gufo guidare ibernato icona identico idillio idolo idra idrico idrogeno igiene ignaro ignorato ilare illeso illogico illudere imballo imbevuto imbocco imbuto immane immerso immolato impacco impeto impiego importo impronta inalare inarcare inattivo incanto incendio inchino incisivo incluso incontro incrocio incubo indagine india indole inedito infatti infilare inflitto ingaggio ingegno inglese ingordo ingrosso innesco inodore inoltrare inondato insano insetto insieme insonnia insulina intasato intero intonaco intuito inumidire invalido invece invito iperbole ipnotico ipotesi ippica iride irlanda ironico irrigato irrorare isolato isotopo isterico istituto istrice italia iterare labbro labirinto lacca lacerato lacrima lacuna laddove lago lampo lancetta lanterna lardoso larga laringe lastra latenza latino lattuga lavagna lavoro legale leggero lembo lentezza lenza leone lepre lesivo lessato lesto letterale leva levigato libero lido lievito lilla limatura limitare limpido lineare lingua liquido lira lirica lisca lite litigio livrea locanda lode logica lombare londra longevo loquace lorenzo loto lotteria luce lucidato lumaca luminoso lungo lupo luppolo lusinga lusso lutto macabro macchina macero macinato madama magico maglia magnete magro maiolica malafede malgrado malinteso malsano malto malumore mana mancia mandorla mangiare manifesto mannaro manovra mansarda mantide manubrio mappa maratona marcire maretta marmo marsupio maschera massaia mastino materasso matricola mattone maturo mazurca meandro meccanico mecenate medesimo meditare mega melassa melis melodia meninge meno mensola mercurio merenda merlo meschino mese messere mestolo metallo metodo mettere miagolare mica micelio michele microbo midollo miele migliore milano milite mimosa minerale mini minore mirino mirtillo miscela missiva misto misurare mitezza mitigare mitra mittente mnemonico modello modifica modulo mogano mogio mole molosso monastero monco mondina monetario monile monotono monsone montato monviso mora mordere morsicato mostro motivato motosega motto movenza movimento mozzo mucca mucosa muffa mughetto mugnaio mulatto mulinello multiplo mummia munto muovere murale musa muscolo musica mutevole muto nababbo nafta nanometro narciso narice narrato nascere nastrare naturale nautica naviglio nebulosa necrosi negativo negozio nemmeno neofita neretto nervo nessuno nettuno neutrale neve nevrotico nicchia ninfa nitido nobile nocivo nodo nome nomina nordico normale norvegese nostrano notare notizia notturno novella nucleo nulla numero nuovo nutrire nuvola nuziale oasi obbedire obbligo obelisco oblio obolo obsoleto occasione occhio occidente occorrere occultare ocra oculato odierno odorare offerta offrire offuscato oggetto oggi ognuno olandese olfatto oliato oliva ologramma oltre omaggio ombelico ombra omega omissione ondoso onere onice onnivoro onorevole onta operato opinione opposto oracolo orafo ordine orecchino orefice orfano organico origine orizzonte orma ormeggio ornativo orologio orrendo orribile ortensia ortica orzata orzo osare oscurare osmosi ospedale ospite ossa ossidare ostacolo oste otite otre ottagono ottimo ottobre ovale ovest ovino oviparo ovocito ovunque ovviare ozio pacchetto pace pacifico padella padrone paese paga pagina palazzina palesare pallido palo palude pandoro pannello paolo paonazzo paprica parabola parcella parere pargolo pari parlato parola partire parvenza parziale passivo pasticca patacca patologia pattume pavone peccato pedalare pedonale peggio peloso penare pendice penisola pennuto penombra pensare pentola pepe pepita perbene percorso perdonato perforare pergamena periodo permesso perno perplesso persuaso pertugio pervaso pesatore pesista peso pestifero petalo pettine petulante pezzo piacere pianta piattino piccino picozza piega pietra piffero pigiama pigolio pigro pila pilifero pillola pilota pimpante pineta pinna pinolo pioggia piombo piramide piretico pirite pirolisi pitone pizzico placebo planare plasma platano plenario pochezza poderoso podismo poesia poggiare polenta poligono pollice polmonite polpetta polso poltrona polvere pomice pomodoro ponte popoloso porfido poroso porpora porre portata posa positivo possesso postulato potassio potere pranzo prassi pratica precluso predica prefisso pregiato prelievo premere prenotare preparato presenza pretesto prevalso prima principe privato problema procura produrre profumo progetto prolunga promessa pronome proposta proroga proteso prova prudente prugna prurito psiche pubblico pudica pugilato pugno pulce pulito pulsante puntare pupazzo pupilla puro quadro qualcosa quasi querela quota raccolto raddoppio radicale radunato raffica ragazzo ragione ragno ramarro ramingo ramo randagio rantolare rapato rapina rappreso rasatura raschiato rasente rassegna rastrello rata ravveduto reale recepire recinto recluta recondito recupero reddito redimere regalato registro regola regresso relazione remare remoto renna replica reprimere reputare resa residente responso restauro rete retina retorica rettifica revocato riassunto ribadire ribelle ribrezzo ricarica ricco ricevere riciclato ricordo ricreduto ridicolo ridurre rifasare riflesso riforma rifugio rigare rigettato righello rilassato rilevato rimanere rimbalzo rimedio rimorchio rinascita rincaro rinforzo rinnovo rinomato rinsavito rintocco rinuncia rinvenire riparato ripetuto ripieno riportare ripresa ripulire risata rischio riserva risibile riso rispetto ristoro risultato risvolto ritardo ritegno ritmico ritrovo riunione riva riverso rivincita rivolto rizoma roba robotico robusto roccia roco rodaggio rodere roditore rogito rollio romantico rompere ronzio rosolare rospo rotante rotondo rotula rovescio rubizzo rubrica ruga rullino rumine rumoroso ruolo rupe russare rustico sabato sabbiare sabotato sagoma salasso saldatura salgemma salivare salmone salone saltare saluto salvo sapere sapido saporito saraceno sarcasmo sarto sassoso satellite satira satollo saturno savana savio saziato sbadiglio sbalzo sbancato sbarra sbattere sbavare sbendare sbirciare sbloccato sbocciato sbrinare sbruffone sbuffare scabroso scadenza scala scambiare scandalo scapola scarso scatenare scavato scelto scenico scettro scheda schiena sciarpa scienza scindere scippo sciroppo scivolo sclerare scodella scolpito scomparto sconforto scoprire scorta scossone scozzese scriba scrollare scrutinio scuderia scultore scuola scuro scusare sdebitare sdoganare seccatura secondo sedano seggiola segnalato segregato seguito selciato selettivo sella selvaggio semaforo sembrare seme seminato sempre senso sentire sepolto sequenza serata serbato sereno serio serpente serraglio servire sestina setola settimana sfacelo sfaldare sfamato sfarzoso sfaticato sfera sfida sfilato sfinge sfocato sfoderare sfogo sfoltire sforzato sfratto sfruttato sfuggito sfumare sfuso sgabello sgarbato sgonfiare sgorbio sgrassato sguardo sibilo siccome sierra sigla signore silenzio sillaba simbolo simpatico simulato sinfonia singolo sinistro sino sintesi sinusoide sipario sisma sistole situato slitta slogatura sloveno smarrito smemorato smentito smeraldo smilzo smontare smottato smussato snellire snervato snodo sobbalzo sobrio soccorso sociale sodale soffitto sogno soldato solenne solido sollazzo solo solubile solvente somatico somma sonda sonetto sonnifero sopire soppeso sopra sorgere sorpasso sorriso sorso sorteggio sorvolato sospiro sosta sottile spada spalla spargere spatola spavento spazzola specie spedire spegnere spelatura speranza spessore spettrale spezzato spia spigoloso spillato spinoso spirale splendido sportivo sposo spranga sprecare spronato spruzzo spuntino squillo sradicare srotolato stabile stacco staffa stagnare stampato stantio starnuto stasera statuto stelo steppa sterzo stiletto stima stirpe stivale stizzoso stonato storico strappo stregato stridulo strozzare strutto stuccare stufo stupendo subentro succoso sudore suggerito sugo sultano suonare superbo supporto surgelato surrogato sussurro sutura svagare svedese sveglio svelare svenuto svezia sviluppo svista svizzera svolta svuotare tabacco tabulato tacciare taciturno tale talismano tampone tannino tara tardivo targato tariffa tarpare tartaruga tasto tattico taverna tavolata tazza teca tecnico telefono temerario tempo temuto tendone tenero tensione tentacolo teorema terme terrazzo terzetto tesi tesserato testato tetro tettoia tifare tigella timbro tinto tipico tipografo tiraggio tiro titanio titolo titubante tizio tizzone toccare tollerare tolto tombola tomo tonfo tonsilla topazio topologia toppa torba tornare torrone tortora toscano tossire tostatura totano trabocco trachea trafila tragedia tralcio tramonto transito trapano trarre trasloco trattato trave treccia tremolio trespolo tributo tricheco trifoglio trillo trincea trio tristezza triturato trivella tromba trono troppo trottola trovare truccato tubatura tuffato tulipano tumulto tunisia turbare turchino tuta tutela ubicato uccello uccisore udire uditivo uffa ufficio uguale ulisse ultimato umano umile umorismo uncinetto ungere ungherese unicorno unificato unisono unitario unte uovo upupa uragano urgenza urlo usanza usato uscito usignolo usuraio utensile utilizzo utopia vacante vaccinato vagabondo vagliato valanga valgo valico valletta valoroso valutare valvola vampata vangare vanitoso vano vantaggio vanvera vapore varano varcato variante vasca vedetta vedova veduto vegetale veicolo velcro velina velluto veloce venato vendemmia vento verace verbale vergogna verifica vero verruca verticale vescica vessillo vestale veterano vetrina vetusto viandante vibrante vicenda vichingo vicinanza vidimare vigilia vigneto vigore vile villano vimini vincitore viola vipera virgola virologo virulento viscoso visione vispo vissuto visura vita vitello vittima vivanda vivido viziare voce voga volatile volere volpe voragine vulcano zampogna zanna zappato zattera zavorra zefiro zelante zelo zenzero zerbino zibetto zinco zircone zitto zolla zotico zucchero zufolo zulu zuppa".split(" "),
japanese:"\u3042\u3044\u3053\u304f\u3057\u3093 \u3042\u3044\u3055\u3064 \u3042\u3044\u305f\u3099 \u3042\u304a\u305d\u3099\u3089 \u3042\u304b\u3061\u3083\u3093 \u3042\u304d\u308b \u3042\u3051\u304b\u3099\u305f \u3042\u3051\u308b \u3042\u3053\u304b\u3099\u308c\u308b \u3042\u3055\u3044 \u3042\u3055\u3072 \u3042\u3057\u3042\u3068 \u3042\u3057\u3099\u308f\u3046 \u3042\u3059\u3099\u304b\u308b \u3042\u3059\u3099\u304d \u3042\u305d\u3075\u3099 \u3042\u305f\u3048\u308b \u3042\u305f\u305f\u3081\u308b \u3042\u305f\u308a\u307e\u3048 \u3042\u305f\u308b \u3042\u3064\u3044 \u3042\u3064\u304b\u3046 \u3042\u3063\u3057\u3085\u304f \u3042\u3064\u307e\u308a \u3042\u3064\u3081\u308b \u3042\u3066\u306a \u3042\u3066\u306f\u307e\u308b \u3042\u3072\u308b \u3042\u3075\u3099\u3089 \u3042\u3075\u3099\u308b \u3042\u3075\u308c\u308b \u3042\u307e\u3044 \u3042\u307e\u3068\u3099 \u3042\u307e\u3084\u304b\u3059 \u3042\u307e\u308a \u3042\u307f\u3082\u306e \u3042\u3081\u308a\u304b \u3042\u3084\u307e\u308b \u3042\u3086\u3080 \u3042\u3089\u3044\u304f\u3099\u307e \u3042\u3089\u3057 \u3042\u3089\u3059\u3057\u3099 \u3042\u3089\u305f\u3081\u308b \u3042\u3089\u3086\u308b \u3042\u3089\u308f\u3059 \u3042\u308a\u304b\u3099\u3068\u3046 \u3042\u308f\u305b\u308b \u3042\u308f\u3066\u308b \u3042\u3093\u3044 \u3042\u3093\u304b\u3099\u3044 \u3042\u3093\u3053 \u3042\u3093\u305b\u3099\u3093 \u3042\u3093\u3066\u3044 \u3042\u3093\u306a\u3044 \u3042\u3093\u307e\u308a \u3044\u3044\u305f\u3099\u3059 \u3044\u304a\u3093 \u3044\u304b\u3099\u3044 \u3044\u304b\u3099\u304f \u3044\u304d\u304a\u3044 \u3044\u304d\u306a\u308a \u3044\u304d\u3082\u306e \u3044\u304d\u308b \u3044\u304f\u3057\u3099 \u3044\u304f\u3075\u3099\u3093 \u3044\u3051\u306f\u3099\u306a \u3044\u3051\u3093 \u3044\u3053\u3046 \u3044\u3053\u304f \u3044\u3053\u3064 \u3044\u3055\u307e\u3057\u3044 \u3044\u3055\u3093 \u3044\u3057\u304d \u3044\u3057\u3099\u3085\u3046 \u3044\u3057\u3099\u3087\u3046 \u3044\u3057\u3099\u308f\u308b \u3044\u3059\u3099\u307f \u3044\u3059\u3099\u308c \u3044\u305b\u3044 \u3044\u305b\u3048\u3072\u3099 \u3044\u305b\u304b\u3044 \u3044\u305b\u304d \u3044\u305b\u3099\u3093 \u3044\u305d\u3046\u308d\u3046 \u3044\u305d\u304b\u3099\u3057\u3044 \u3044\u305f\u3099\u3044 \u3044\u305f\u3099\u304f \u3044\u305f\u3059\u3099\u3089 \u3044\u305f\u307f \u3044\u305f\u308a\u3042 \u3044\u3061\u304a\u3046 \u3044\u3061\u3057\u3099 \u3044\u3061\u3068\u3099 \u3044\u3061\u306f\u3099 \u3044\u3061\u3075\u3099 \u3044\u3061\u308a\u3085\u3046 \u3044\u3064\u304b \u3044\u3063\u3057\u3085\u3093 \u3044\u3063\u305b\u3044 \u3044\u3063\u305d\u3046 \u3044\u3063\u305f\u3093 \u3044\u3063\u3061 \u3044\u3063\u3066\u3044 \u3044\u3063\u307b\u309a\u3046 \u3044\u3066\u3055\u3099 \u3044\u3066\u3093 \u3044\u3068\u3099\u3046 \u3044\u3068\u3053 \u3044\u306a\u3044 \u3044\u306a\u304b \u3044\u306d\u3080\u308a \u3044\u306e\u3061 \u3044\u306e\u308b \u3044\u306f\u3064 \u3044\u306f\u3099\u308b \u3044\u306f\u3093 \u3044\u3072\u3099\u304d \u3044\u3072\u3093 \u3044\u3075\u304f \u3044\u3078\u3093 \u3044\u307b\u3046 \u3044\u307f\u3093 \u3044\u3082\u3046\u3068 \u3044\u3082\u305f\u308c \u3044\u3082\u308a \u3044\u3084\u304b\u3099\u308b \u3044\u3084\u3059 \u3044\u3088\u304b\u3093 \u3044\u3088\u304f \u3044\u3089\u3044 \u3044\u3089\u3059\u3068 \u3044\u308a\u304f\u3099\u3061 \u3044\u308a\u3087\u3046 \u3044\u308c\u3044 \u3044\u308c\u3082\u306e \u3044\u308c\u308b \u3044\u308d\u3048\u3093\u3072\u309a\u3064 \u3044\u308f\u3044 \u3044\u308f\u3046 \u3044\u308f\u304b\u3093 \u3044\u308f\u306f\u3099 \u3044\u308f\u3086\u308b \u3044\u3093\u3051\u3099\u3093\u307e\u3081 \u3044\u3093\u3055\u3064 \u3044\u3093\u3057\u3087\u3046 \u3044\u3093\u3088\u3046 \u3046\u3048\u304d \u3046\u3048\u308b \u3046\u304a\u3055\u3099 \u3046\u304b\u3099\u3044 \u3046\u304b\u3075\u3099 \u3046\u304b\u3078\u3099\u308b \u3046\u304d\u308f \u3046\u304f\u3089\u3044\u306a \u3046\u304f\u308c\u308c \u3046\u3051\u305f\u307e\u308f\u308b \u3046\u3051\u3064\u3051 \u3046\u3051\u3068\u308b \u3046\u3051\u3082\u3064 \u3046\u3051\u308b \u3046\u3053\u3099\u304b\u3059 \u3046\u3053\u3099\u304f \u3046\u3053\u3093 \u3046\u3055\u304d\u3099 \u3046\u3057\u306a\u3046 \u3046\u3057\u308d\u304b\u3099\u307f \u3046\u3059\u3044 \u3046\u3059\u304d\u3099 \u3046\u3059\u304f\u3099\u3089\u3044 \u3046\u3059\u3081\u308b \u3046\u305b\u3064 \u3046\u3061\u3042\u308f\u305b \u3046\u3061\u304b\u3099\u308f \u3046\u3061\u304d \u3046\u3061\u3085\u3046 \u3046\u3063\u304b\u308a \u3046\u3064\u304f\u3057\u3044 \u3046\u3063\u305f\u3048\u308b \u3046\u3064\u308b \u3046\u3068\u3099\u3093 \u3046\u306a\u304d\u3099 \u3046\u306a\u3057\u3099 \u3046\u306a\u3059\u3099\u304f \u3046\u306a\u308b \u3046\u306d\u308b \u3046\u306e\u3046 \u3046\u3075\u3099\u3051\u3099 \u3046\u3075\u3099\u3053\u3099\u3048 \u3046\u307e\u308c\u308b \u3046\u3081\u308b \u3046\u3082\u3046 \u3046\u3084\u307e\u3046 \u3046\u3088\u304f \u3046\u3089\u304b\u3099\u3048\u3059 \u3046\u3089\u304f\u3099\u3061 \u3046\u3089\u306a\u3044 \u3046\u308a\u3042\u3051\u3099 \u3046\u308a\u304d\u308c \u3046\u308b\u3055\u3044 \u3046\u308c\u3057\u3044 \u3046\u308c\u3086\u304d \u3046\u308c\u308b \u3046\u308d\u3053 \u3046\u308f\u304d \u3046\u308f\u3055 \u3046\u3093\u3053\u3046 \u3046\u3093\u3061\u3093 \u3046\u3093\u3066\u3093 \u3046\u3093\u3068\u3099\u3046 \u3048\u3044\u3048\u3093 \u3048\u3044\u304b\u3099 \u3048\u3044\u304d\u3087\u3046 \u3048\u3044\u3053\u3099 \u3048\u3044\u305b\u3044 \u3048\u3044\u3075\u3099\u3093 \u3048\u3044\u3088\u3046 \u3048\u3044\u308f \u3048\u304a\u308a \u3048\u304b\u3099\u304a \u3048\u304b\u3099\u304f \u3048\u304d\u305f\u3044 \u3048\u304f\u305b\u308b \u3048\u3057\u3083\u304f \u3048\u3059\u3066 \u3048\u3064\u3089\u3093 \u3048\u306e\u304f\u3099 \u3048\u307b\u3046\u307e\u304d \u3048\u307b\u3093 \u3048\u307e\u304d \u3048\u3082\u3057\u3099 \u3048\u3082\u306e \u3048\u3089\u3044 \u3048\u3089\u3075\u3099 \u3048\u308a\u3042 \u3048\u3093\u3048\u3093 \u3048\u3093\u304b\u3044 \u3048\u3093\u304d\u3099 \u3048\u3093\u3051\u3099\u304d \u3048\u3093\u3057\u3085\u3046 \u3048\u3093\u305b\u3099\u3064 \u3048\u3093\u305d\u304f \u3048\u3093\u3061\u3087\u3046 \u3048\u3093\u3068\u3064 \u304a\u3044\u304b\u3051\u308b \u304a\u3044\u3053\u3059 \u304a\u3044\u3057\u3044 \u304a\u3044\u3064\u304f \u304a\u3046\u3048\u3093 \u304a\u3046\u3055\u307e \u304a\u3046\u3057\u3099 \u304a\u3046\u305b\u3064 \u304a\u3046\u305f\u3044 \u304a\u3046\u3075\u304f \u304a\u3046\u3078\u3099\u3044 \u304a\u3046\u3088\u3046 \u304a\u3048\u308b \u304a\u304a\u3044 \u304a\u304a\u3046 \u304a\u304a\u3068\u3099\u304a\u308a \u304a\u304a\u3084 \u304a\u304a\u3088\u305d \u304a\u304b\u3048\u308a \u304a\u304b\u3059\u3099 \u304a\u304b\u3099\u3080 \u304a\u304b\u308f\u308a \u304a\u304d\u3099\u306a\u3046 \u304a\u304d\u308b \u304a\u304f\u3055\u307e \u304a\u304f\u3057\u3099\u3087\u3046 \u304a\u304f\u308a\u304b\u3099\u306a \u304a\u304f\u308b \u304a\u304f\u308c\u308b \u304a\u3053\u3059 \u304a\u3053\u306a\u3046 \u304a\u3053\u308b \u304a\u3055\u3048\u308b \u304a\u3055\u306a\u3044 \u304a\u3055\u3081\u308b \u304a\u3057\u3044\u308c \u304a\u3057\u3048\u308b \u304a\u3057\u3099\u304d\u3099 \u304a\u3057\u3099\u3055\u3093 \u304a\u3057\u3083\u308c \u304a\u305d\u3089\u304f \u304a\u305d\u308f\u308b \u304a\u305f\u304b\u3099\u3044 \u304a\u305f\u304f \u304a\u305f\u3099\u3084\u304b \u304a\u3061\u3064\u304f \u304a\u3063\u3068 \u304a\u3064\u308a \u304a\u3066\u3099\u304b\u3051 \u304a\u3068\u3057\u3082\u306e \u304a\u3068\u306a\u3057\u3044 \u304a\u3068\u3099\u308a \u304a\u3068\u3099\u308d\u304b\u3059 \u304a\u306f\u3099\u3055\u3093 \u304a\u307e\u3044\u308a \u304a\u3081\u3066\u3099\u3068\u3046 \u304a\u3082\u3044\u3066\u3099 \u304a\u3082\u3046 \u304a\u3082\u305f\u3044 \u304a\u3082\u3061\u3083 \u304a\u3084\u3064 \u304a\u3084\u3086\u3072\u3099 \u304a\u3088\u307b\u3099\u3059 \u304a\u3089\u3093\u305f\u3099 \u304a\u308d\u3059 \u304a\u3093\u304b\u3099\u304f \u304a\u3093\u3051\u3044 \u304a\u3093\u3057\u3083 \u304a\u3093\u305b\u3093 \u304a\u3093\u305f\u3099\u3093 \u304a\u3093\u3061\u3085\u3046 \u304a\u3093\u3068\u3099\u3051\u3044 \u304b\u3042\u3064 \u304b\u3044\u304b\u3099 \u304b\u3099\u3044\u304d \u304b\u3099\u3044\u3051\u3093 \u304b\u3099\u3044\u3053\u3046 \u304b\u3044\u3055\u3064 \u304b\u3044\u3057\u3083 \u304b\u3044\u3059\u3044\u3088\u304f \u304b\u3044\u305b\u3099\u3093 \u304b\u3044\u305d\u3099\u3046\u3068\u3099 \u304b\u3044\u3064\u3046 \u304b\u3044\u3066\u3093 \u304b\u3044\u3068\u3046 \u304b\u3044\u3075\u304f \u304b\u3099\u3044\u3078\u304d \u304b\u3044\u307b\u3046 \u304b\u3044\u3088\u3046 \u304b\u3099\u3044\u3089\u3044 \u304b\u3044\u308f \u304b\u3048\u308b \u304b\u304a\u308a \u304b\u304b\u3048\u308b \u304b\u304b\u3099\u304f \u304b\u304b\u3099\u3057 \u304b\u304b\u3099\u307f \u304b\u304f\u3053\u3099 \u304b\u304f\u3068\u304f \u304b\u3055\u3099\u308b \u304b\u3099\u305d\u3099\u3046 \u304b\u305f\u3044 \u304b\u305f\u3061 \u304b\u3099\u3061\u3087\u3046 \u304b\u3099\u3063\u304d\u3085\u3046 \u304b\u3099\u3063\u3053\u3046 \u304b\u3099\u3063\u3055\u3093 \u304b\u3099\u3063\u3057\u3087\u3046 \u304b\u306a\u3055\u3099\u308f\u3057 \u304b\u306e\u3046 \u304b\u3099\u306f\u304f \u304b\u3075\u3099\u304b \u304b\u307b\u3046 \u304b\u307b\u3053\u3099 \u304b\u307e\u3046 \u304b\u307e\u307b\u3099\u3053 \u304b\u3081\u308c\u304a\u3093 \u304b\u3086\u3044 \u304b\u3088\u3046\u3072\u3099 \u304b\u3089\u3044 \u304b\u308b\u3044 \u304b\u308d\u3046 \u304b\u308f\u304f \u304b\u308f\u3089 \u304b\u3099\u3093\u304b \u304b\u3093\u3051\u3044 \u304b\u3093\u3053\u3046 \u304b\u3093\u3057\u3083 \u304b\u3093\u305d\u3046 \u304b\u3093\u305f\u3093 \u304b\u3093\u3061 \u304b\u3099\u3093\u306f\u3099\u308b \u304d\u3042\u3044 \u304d\u3042\u3064 \u304d\u3044\u308d \u304d\u3099\u3044\u3093 \u304d\u3046\u3044 \u304d\u3046\u3093 \u304d\u3048\u308b \u304d\u304a\u3046 \u304d\u304a\u304f \u304d\u304a\u3061 \u304d\u304a\u3093 \u304d\u304b\u3044 \u304d\u304b\u304f \u304d\u304b\u3093\u3057\u3083 \u304d\u304d\u3066 \u304d\u304f\u306f\u3099\u308a \u304d\u304f\u3089\u3051\u3099 \u304d\u3051\u3093\u305b\u3044 \u304d\u3053\u3046 \u304d\u3053\u3048\u308b \u304d\u3053\u304f \u304d\u3055\u3044 \u304d\u3055\u304f \u304d\u3055\u307e \u304d\u3055\u3089\u304d\u3099 \u304d\u3099\u3057\u3099\u304b\u304b\u3099\u304f \u304d\u3099\u3057\u304d \u304d\u3099\u3057\u3099\u305f\u3044\u3051\u3093 \u304d\u3099\u3057\u3099\u306b\u3063\u3066\u3044 \u304d\u3099\u3057\u3099\u3085\u3064\u3057\u3083 \u304d\u3059\u3046 \u304d\u305b\u3044 \u304d\u305b\u304d \u304d\u305b\u3064 \u304d\u305d\u3046 \u304d\u305d\u3099\u304f \u304d\u305d\u3099\u3093 \u304d\u305f\u3048\u308b \u304d\u3061\u3087\u3046 \u304d\u3064\u3048\u3093 \u304d\u3099\u3063\u3061\u308a \u304d\u3064\u3064\u304d \u304d\u3064\u306d \u304d\u3066\u3044 \u304d\u3068\u3099\u3046 \u304d\u3068\u3099\u304f \u304d\u306a\u3044 \u304d\u306a\u304b\u3099 \u304d\u306a\u3053 \u304d\u306c\u3053\u3099\u3057 \u304d\u306d\u3093 \u304d\u306e\u3046 \u304d\u306e\u3057\u305f \u304d\u306f\u304f \u304d\u3072\u3099\u3057\u3044 \u304d\u3072\u3093 \u304d\u3075\u304f \u304d\u3075\u3099\u3093 \u304d\u307b\u3099\u3046 \u304d\u307b\u3093 \u304d\u307e\u308b \u304d\u307f\u3064 \u304d\u3080\u3059\u3099\u304b\u3057\u3044 \u304d\u3081\u308b \u304d\u3082\u305f\u3099\u3081\u3057 \u304d\u3082\u3061 \u304d\u3082\u306e \u304d\u3083\u304f \u304d\u3084\u304f \u304d\u3099\u3085\u3046\u306b\u304f \u304d\u3088\u3046 \u304d\u3087\u3046\u308a\u3085\u3046 \u304d\u3089\u3044 \u304d\u3089\u304f \u304d\u308a\u3093 \u304d\u308c\u3044 \u304d\u308c\u3064 \u304d\u308d\u304f \u304d\u3099\u308d\u3093 \u304d\u308f\u3081\u308b \u304d\u3099\u3093\u3044\u308d \u304d\u3093\u304b\u304f\u3057\u3099 \u304d\u3093\u3057\u3099\u3087 \u304d\u3093\u3088\u3046\u3072\u3099 \u304f\u3099\u3042\u3044 \u304f\u3044\u3059\u3099 \u304f\u3046\u304b\u3093 \u304f\u3046\u304d \u304f\u3046\u304f\u3099\u3093 \u304f\u3046\u3053\u3046 \u304f\u3099\u3046\u305b\u3044 \u304f\u3046\u305d\u3046 \u304f\u3099\u3046\u305f\u3089 \u304f\u3046\u3075\u304f \u304f\u3046\u307b\u3099 \u304f\u304b\u3093 \u304f\u304d\u3087\u3046 \u304f\u3051\u3099\u3093 \u304f\u3099\u3053\u3046 \u304f\u3055\u3044 \u304f\u3055\u304d \u304f\u3055\u306f\u3099\u306a \u304f\u3055\u308b \u304f\u3057\u3083\u307f \u304f\u3057\u3087\u3046 \u304f\u3059\u306e\u304d \u304f\u3059\u308a\u3086\u3072\u3099 \u304f\u305b\u3051\u3099 \u304f\u305b\u3093 \u304f\u3099\u305f\u3044\u3066\u304d \u304f\u305f\u3099\u3055\u308b \u304f\u305f\u3072\u3099\u308c\u308b \u304f\u3061\u3053\u307f \u304f\u3061\u3055\u304d \u304f\u3064\u3057\u305f \u304f\u3099\u3063\u3059\u308a \u304f\u3064\u308d\u304f\u3099 \u304f\u3068\u3046\u3066\u3093 \u304f\u3068\u3099\u304f \u304f\u306a\u3093 \u304f\u306d\u304f\u306d \u304f\u306e\u3046 \u304f\u3075\u3046 \u304f\u307f\u3042\u308f\u305b \u304f\u307f\u305f\u3066\u308b \u304f\u3081\u308b \u304f\u3084\u304f\u3057\u3087 \u304f\u3089\u3059 \u304f\u3089\u3078\u3099\u308b \u304f\u308b\u307e \u304f\u308c\u308b \u304f\u308d\u3046 \u304f\u308f\u3057\u3044 \u304f\u3099\u3093\u304b\u3093 \u304f\u3099\u3093\u3057\u3087\u304f \u304f\u3099\u3093\u305f\u3044 \u304f\u3099\u3093\u3066 \u3051\u3042\u306a \u3051\u3044\u304b\u304f \u3051\u3044\u3051\u3093 \u3051\u3044\u3053 \u3051\u3044\u3055\u3064 \u3051\u3099\u3044\u3057\u3099\u3085\u3064 \u3051\u3044\u305f\u3044 \u3051\u3099\u3044\u306e\u3046\u3057\u3099\u3093 \u3051\u3044\u308c\u304d \u3051\u3044\u308d \u3051\u304a\u3068\u3059 \u3051\u304a\u308a\u3082\u306e \u3051\u3099\u304d\u304b \u3051\u3099\u304d\u3051\u3099\u3093 \u3051\u3099\u304d\u305f\u3099\u3093 \u3051\u3099\u304d\u3061\u3093 \u3051\u3099\u304d\u3068\u3064 \u3051\u3099\u304d\u306f \u3051\u3099\u304d\u3084\u304f \u3051\u3099\u3053\u3046 \u3051\u3099\u3053\u304f\u3057\u3099\u3087\u3046 \u3051\u3099\u3055\u3099\u3044 \u3051\u3055\u304d \u3051\u3099\u3055\u3099\u3093 \u3051\u3057\u304d \u3051\u3057\u3053\u3099\u3080 \u3051\u3057\u3087\u3046 \u3051\u3099\u3059\u3068 \u3051\u305f\u306f\u3099 \u3051\u3061\u3083\u3063\u3075\u309a \u3051\u3061\u3089\u3059 \u3051\u3064\u3042\u3064 \u3051\u3064\u3044 \u3051\u3064\u3048\u304d \u3051\u3063\u3053\u3093 \u3051\u3064\u3057\u3099\u3087 \u3051\u3063\u305b\u304d \u3051\u3063\u3066\u3044 \u3051\u3064\u307e\u3064 \u3051\u3099\u3064\u3088\u3046\u3072\u3099 \u3051\u3099\u3064\u308c\u3044 \u3051\u3064\u308d\u3093 \u3051\u3099\u3068\u3099\u304f \u3051\u3068\u306f\u3099\u3059 \u3051\u3068\u308b \u3051\u306a\u3051\u3099 \u3051\u306a\u3059 \u3051\u306a\u307f \u3051\u306c\u304d \u3051\u3099\u306d\u3064 \u3051\u306d\u3093 \u3051\u306f\u3044 \u3051\u3099\u3072\u3093 \u3051\u3075\u3099\u304b\u3044 \u3051\u3099\u307b\u3099\u304f \u3051\u307e\u308a \u3051\u307f\u304b\u308b \u3051\u3080\u3057 \u3051\u3080\u308a \u3051\u3082\u306e \u3051\u3089\u3044 \u3051\u308d\u3051\u308d \u3051\u308f\u3057\u3044 \u3051\u3093\u3044 \u3051\u3093\u3048\u3064 \u3051\u3093\u304a \u3051\u3093\u304b \u3051\u3099\u3093\u304d \u3051\u3093\u3051\u3099\u3093 \u3051\u3093\u3053\u3046 \u3051\u3093\u3055\u304f \u3051\u3093\u3057\u3085\u3046 \u3051\u3093\u3059\u3046 \u3051\u3099\u3093\u305d\u3046 \u3051\u3093\u3061\u304f \u3051\u3093\u3066\u3044 \u3051\u3093\u3068\u3046 \u3051\u3093\u306a\u3044 \u3051\u3093\u306b\u3093 \u3051\u3099\u3093\u3075\u3099\u3064 \u3051\u3093\u307e \u3051\u3093\u307f\u3093 \u3051\u3093\u3081\u3044 \u3051\u3093\u3089\u3093 \u3051\u3093\u308a \u3053\u3042\u304f\u307e \u3053\u3044\u306c \u3053\u3044\u3072\u3099\u3068 \u3053\u3099\u3046\u3044 \u3053\u3046\u3048\u3093 \u3053\u3046\u304a\u3093 \u3053\u3046\u304b\u3093 \u3053\u3099\u3046\u304d\u3085\u3046 \u3053\u3099\u3046\u3051\u3044 \u3053\u3046\u3053\u3046 \u3053\u3046\u3055\u3044 \u3053\u3046\u3057\u3099 \u3053\u3046\u3059\u3044 \u3053\u3099\u3046\u305b\u3044 \u3053\u3046\u305d\u304f \u3053\u3046\u305f\u3044 \u3053\u3046\u3061\u3083 \u3053\u3046\u3064\u3046 \u3053\u3046\u3066\u3044 \u3053\u3046\u3068\u3099\u3046 \u3053\u3046\u306a\u3044 \u3053\u3046\u306f\u3044 \u3053\u3099\u3046\u307b\u3046 \u3053\u3099\u3046\u307e\u3093 \u3053\u3046\u3082\u304f \u3053\u3046\u308a\u3064 \u3053\u3048\u308b \u3053\u304a\u308a \u3053\u3099\u304b\u3044 \u3053\u3099\u304b\u3099\u3064 \u3053\u3099\u304b\u3093 \u3053\u304f\u3053\u3099 \u3053\u304f\u3055\u3044 \u3053\u304f\u3068\u3046 \u3053\u304f\u306a\u3044 \u3053\u304f\u306f\u304f \u3053\u304f\u3099\u307e \u3053\u3051\u3044 \u3053\u3051\u308b \u3053\u3053\u306e\u304b \u3053\u3053\u308d \u3053\u3055\u3081 \u3053\u3057\u3064 \u3053\u3059\u3046 \u3053\u305b\u3044 \u3053\u305b\u304d \u3053\u305b\u3099\u3093 \u3053\u305d\u305f\u3099\u3066 \u3053\u305f\u3044 \u3053\u305f\u3048\u308b \u3053\u305f\u3064 \u3053\u3061\u3087\u3046 \u3053\u3063\u304b \u3053\u3064\u3053\u3064 \u3053\u3064\u306f\u3099\u3093 \u3053\u3064\u3075\u3099 \u3053\u3066\u3044 \u3053\u3066\u3093 \u3053\u3068\u304b\u3099\u3089 \u3053\u3068\u3057 \u3053\u3068\u306f\u3099 \u3053\u3068\u308a \u3053\u306a\u3053\u3099\u306a \u3053\u306d\u3053\u306d \u3053\u306e\u307e\u307e \u3053\u306e\u307f \u3053\u306e\u3088 \u3053\u3099\u306f\u3093 \u3053\u3072\u3064\u3057\u3099 \u3053\u3075\u3046 \u3053\u3075\u3093 \u3053\u307b\u3099\u308c\u308b \u3053\u3099\u307e\u3042\u3075\u3099\u3089 \u3053\u307e\u304b\u3044 \u3053\u3099\u307e\u3059\u308a \u3053\u307e\u3064\u306a \u3053\u307e\u308b \u3053\u3080\u304d\u3099\u3053 \u3053\u3082\u3057\u3099 \u3053\u3082\u3061 \u3053\u3082\u306e \u3053\u3082\u3093 \u3053\u3084\u304f \u3053\u3084\u307e \u3053\u3086\u3046 \u3053\u3086\u3072\u3099 \u3053\u3088\u3044 \u3053\u3088\u3046 \u3053\u308a\u308b \u3053\u308c\u304f\u3057\u3087\u3093 \u3053\u308d\u3063\u3051 \u3053\u308f\u3082\u3066 \u3053\u308f\u308c\u308b \u3053\u3093\u3044\u3093 \u3053\u3093\u304b\u3044 \u3053\u3093\u304d \u3053\u3093\u3057\u3085\u3046 \u3053\u3093\u3059\u3044 \u3053\u3093\u305f\u3099\u3066 \u3053\u3093\u3068\u3093 \u3053\u3093\u306a\u3093 \u3053\u3093\u3072\u3099\u306b \u3053\u3093\u307b\u309a\u3093 \u3053\u3093\u307e\u3051 \u3053\u3093\u3084 \u3053\u3093\u308c\u3044 \u3053\u3093\u308f\u304f \u3055\u3099\u3044\u3048\u304d \u3055\u3044\u304b\u3044 \u3055\u3044\u304d\u3093 \u3055\u3099\u3044\u3051\u3099\u3093 \u3055\u3099\u3044\u3053 \u3055\u3044\u3057\u3087 \u3055\u3044\u305b\u3044 \u3055\u3099\u3044\u305f\u304f \u3055\u3099\u3044\u3061\u3085\u3046 \u3055\u3044\u3066\u304d \u3055\u3099\u3044\u308a\u3087\u3046 \u3055\u3046\u306a \u3055\u304b\u3044\u3057 \u3055\u304b\u3099\u3059 \u3055\u304b\u306a \u3055\u304b\u307f\u3061 \u3055\u304b\u3099\u308b \u3055\u304d\u3099\u3087\u3046 \u3055\u304f\u3057 \u3055\u304f\u3072\u3093 \u3055\u304f\u3089 \u3055\u3053\u304f \u3055\u3053\u3064 \u3055\u3059\u3099\u304b\u308b \u3055\u3099\u305b\u304d \u3055\u305f\u3093 \u3055\u3064\u3048\u3044 \u3055\u3099\u3064\u304a\u3093 \u3055\u3099\u3063\u304b \u3055\u3099\u3064\u304b\u3099\u304f \u3055\u3063\u304d\u3087\u304f \u3055\u3099\u3063\u3057 \u3055\u3064\u3057\u3099\u3093 \u3055\u3099\u3063\u305d\u3046 \u3055\u3064\u305f\u306f\u3099 \u3055\u3064\u307e\u3044\u3082 \u3055\u3066\u3044 \u3055\u3068\u3044\u3082 \u3055\u3068\u3046 \u3055\u3068\u304a\u3084 \u3055\u3068\u3057 \u3055\u3068\u308b \u3055\u306e\u3046 \u3055\u306f\u3099\u304f \u3055\u3072\u3099\u3057\u3044 \u3055\u3078\u3099\u3064 \u3055\u307b\u3046 \u3055\u307b\u3068\u3099 \u3055\u307e\u3059 \u3055\u307f\u3057\u3044 \u3055\u307f\u305f\u3099\u308c \u3055\u3080\u3051 \u3055\u3081\u308b \u3055\u3084\u3048\u3093\u3068\u3099\u3046 \u3055\u3086\u3046 \u3055\u3088\u3046 \u3055\u3088\u304f \u3055\u3089\u305f\u3099 \u3055\u3099\u308b\u305d\u306f\u3099 \u3055\u308f\u3084\u304b \u3055\u308f\u308b \u3055\u3093\u3044\u3093 \u3055\u3093\u304b \u3055\u3093\u304d\u3083\u304f \u3055\u3093\u3053\u3046 \u3055\u3093\u3055\u3044 \u3055\u3099\u3093\u3057\u3087 \u3055\u3093\u3059\u3046 \u3055\u3093\u305b\u3044 \u3055\u3093\u305d \u3055\u3093\u3061 \u3055\u3093\u307e \u3055\u3093\u307f \u3055\u3093\u3089\u3093 \u3057\u3042\u3044 \u3057\u3042\u3051\u3099 \u3057\u3042\u3055\u3063\u3066 \u3057\u3042\u308f\u305b \u3057\u3044\u304f \u3057\u3044\u3093 \u3057\u3046\u3061 \u3057\u3048\u3044 \u3057\u304a\u3051 \u3057\u304b\u3044 \u3057\u304b\u304f \u3057\u3099\u304b\u3093 \u3057\u3053\u3099\u3068 \u3057\u3059\u3046 \u3057\u3099\u305f\u3099\u3044 \u3057\u305f\u3046\u3051 \u3057\u305f\u304d\u3099 \u3057\u305f\u3066 \u3057\u305f\u307f \u3057\u3061\u3087\u3046 \u3057\u3061\u308a\u3093 \u3057\u3063\u304b\u308a \u3057\u3064\u3057\u3099 \u3057\u3064\u3082\u3093 \u3057\u3066\u3044 \u3057\u3066\u304d \u3057\u3066\u3064 \u3057\u3099\u3066\u3093 \u3057\u3099\u3068\u3099\u3046 \u3057\u306a\u304d\u3099\u308c \u3057\u306a\u3082\u306e \u3057\u306a\u3093 \u3057\u306d\u307e \u3057\u306d\u3093 \u3057\u306e\u304f\u3099 \u3057\u306e\u3075\u3099 \u3057\u306f\u3044 \u3057\u306f\u3099\u304b\u308a \u3057\u306f\u3064 \u3057\u306f\u3089\u3044 \u3057\u306f\u3093 \u3057\u3072\u3087\u3046 \u3057\u3075\u304f \u3057\u3099\u3075\u3099\u3093 \u3057\u3078\u3044 \u3057\u307b\u3046 \u3057\u307b\u3093 \u3057\u307e\u3046 \u3057\u307e\u308b \u3057\u307f\u3093 \u3057\u3080\u3051\u308b \u3057\u3099\u3080\u3057\u3087 \u3057\u3081\u3044 \u3057\u3081\u308b \u3057\u3082\u3093 \u3057\u3083\u3044\u3093 \u3057\u3083\u3046\u3093 \u3057\u3083\u304a\u3093 \u3057\u3099\u3083\u304b\u3099\u3044\u3082 \u3057\u3084\u304f\u3057\u3087 \u3057\u3083\u304f\u307b\u3046 \u3057\u3083\u3051\u3093 \u3057\u3083\u3053 \u3057\u3083\u3055\u3099\u3044 \u3057\u3083\u3057\u3093 \u3057\u3083\u305b\u3093 \u3057\u3083\u305d\u3046 \u3057\u3083\u305f\u3044 \u3057\u3083\u3061\u3087\u3046 \u3057\u3083\u3063\u304d\u3093 \u3057\u3099\u3083\u307e \u3057\u3083\u308a\u3093 \u3057\u3083\u308c\u3044 \u3057\u3099\u3086\u3046 \u3057\u3099\u3085\u3046\u3057\u3087 \u3057\u3085\u304f\u306f\u304f \u3057\u3099\u3085\u3057\u3093 \u3057\u3085\u3063\u305b\u304d \u3057\u3085\u307f \u3057\u3085\u3089\u306f\u3099 \u3057\u3099\u3085\u3093\u306f\u3099\u3093 \u3057\u3087\u3046\u304b\u3044 \u3057\u3087\u304f\u305f\u304f \u3057\u3087\u3063\u3051\u3093 \u3057\u3087\u3068\u3099\u3046 \u3057\u3087\u3082\u3064 \u3057\u3089\u305b\u308b \u3057\u3089\u3078\u3099\u308b \u3057\u3093\u304b \u3057\u3093\u3053\u3046 \u3057\u3099\u3093\u3057\u3099\u3083 \u3057\u3093\u305b\u3044\u3057\u3099 \u3057\u3093\u3061\u304f \u3057\u3093\u308a\u3093 \u3059\u3042\u3051\u3099 \u3059\u3042\u3057 \u3059\u3042\u306a \u3059\u3099\u3042\u3093 \u3059\u3044\u3048\u3044 \u3059\u3044\u304b \u3059\u3044\u3068\u3046 \u3059\u3099\u3044\u3075\u3099\u3093 \u3059\u3044\u3088\u3046\u3072\u3099 \u3059\u3046\u304b\u3099\u304f \u3059\u3046\u3057\u3099\u3064 \u3059\u3046\u305b\u3093 \u3059\u304a\u3068\u3099\u308a \u3059\u304d\u307e \u3059\u304f\u3046 \u3059\u304f\u306a\u3044 \u3059\u3051\u308b \u3059\u3053\u3099\u3044 \u3059\u3053\u3057 \u3059\u3099\u3055\u3093 \u3059\u3059\u3099\u3057\u3044 \u3059\u3059\u3080 \u3059\u3059\u3081\u308b \u3059\u3063\u304b\u308a \u3059\u3099\u3063\u3057\u308a \u3059\u3099\u3063\u3068 \u3059\u3066\u304d \u3059\u3066\u308b \u3059\u306d\u308b \u3059\u306e\u3053 \u3059\u306f\u305f\u3099 \u3059\u306f\u3099\u3089\u3057\u3044 \u3059\u3099\u3072\u3087\u3046 \u3059\u3099\u3075\u3099\u306c\u308c \u3059\u3075\u3099\u308a \u3059\u3075\u308c \u3059\u3078\u3099\u3066 \u3059\u3078\u3099\u308b \u3059\u3099\u307b\u3046 \u3059\u307b\u3099\u3093 \u3059\u307e\u3044 \u3059\u3081\u3057 \u3059\u3082\u3046 \u3059\u3084\u304d \u3059\u3089\u3059\u3089 \u3059\u308b\u3081 \u3059\u308c\u3061\u304b\u3099\u3046 \u3059\u308d\u3063\u3068 \u3059\u308f\u308b \u3059\u3093\u305b\u3099\u3093 \u3059\u3093\u307b\u309a\u3046 \u305b\u3042\u3075\u3099\u3089 \u305b\u3044\u304b\u3064 \u305b\u3044\u3051\u3099\u3093 \u305b\u3044\u3057\u3099 \u305b\u3044\u3088\u3046 \u305b\u304a\u3046 \u305b\u304b\u3044\u304b\u3093 \u305b\u304d\u306b\u3093 \u305b\u304d\u3080 \u305b\u304d\u3086 \u305b\u304d\u3089\u3093\u3046\u3093 \u305b\u3051\u3093 \u305b\u3053\u3046 \u305b\u3059\u3057\u3099 \u305b\u305f\u3044 \u305b\u305f\u3051 \u305b\u3063\u304b\u304f \u305b\u3063\u304d\u3083\u304f \u305b\u3099\u3063\u304f \u305b\u3063\u3051\u3093 \u305b\u3063\u3053\u3064 \u305b\u3063\u3055\u305f\u304f\u307e \u305b\u3064\u305d\u3099\u304f \u305b\u3064\u305f\u3099\u3093 \u305b\u3064\u3066\u3099\u3093 \u305b\u3063\u306f\u309a\u3093 \u305b\u3064\u3072\u3099 \u305b\u3064\u3075\u3099\u3093 \u305b\u3064\u3081\u3044 \u305b\u3064\u308a\u3064 \u305b\u306a\u304b \u305b\u306e\u3072\u3099 \u305b\u306f\u306f\u3099 \u305b\u3072\u3099\u308d \u305b\u307b\u3099\u306d \u305b\u307e\u3044 \u305b\u307e\u308b \u305b\u3081\u308b \u305b\u3082\u305f\u308c \u305b\u308a\u3075 \u305b\u3099\u3093\u3042\u304f \u305b\u3093\u3044 \u305b\u3093\u3048\u3044 \u305b\u3093\u304b \u305b\u3093\u304d\u3087 \u305b\u3093\u304f \u305b\u3093\u3051\u3099\u3093 \u305b\u3099\u3093\u3053\u3099 \u305b\u3093\u3055\u3044 \u305b\u3093\u3057\u3085 \u305b\u3093\u3059\u3044 \u305b\u3093\u305b\u3044 \u305b\u3093\u305d\u3099 \u305b\u3093\u305f\u304f \u305b\u3093\u3061\u3087\u3046 \u305b\u3093\u3066\u3044 \u305b\u3093\u3068\u3046 \u305b\u3093\u306c\u304d \u305b\u3093\u306d\u3093 \u305b\u3093\u306f\u309a\u3044 \u305b\u3099\u3093\u3075\u3099 \u305b\u3099\u3093\u307b\u309a\u3046 \u305b\u3093\u3080 \u305b\u3093\u3081\u3093\u3057\u3099\u3087 \u305b\u3093\u3082\u3093 \u305b\u3093\u3084\u304f \u305b\u3093\u3086\u3046 \u305b\u3093\u3088\u3046 \u305b\u3099\u3093\u3089 \u305b\u3099\u3093\u308a\u3083\u304f \u305b\u3093\u308c\u3044 \u305b\u3093\u308d \u305d\u3042\u304f \u305d\u3044\u3068\u3051\u3099\u308b \u305d\u3044\u306d \u305d\u3046\u304b\u3099\u3093\u304d\u3087\u3046 \u305d\u3046\u304d \u305d\u3046\u3053\u3099 \u305d\u3046\u3057\u3093 \u305d\u3046\u305f\u3099\u3093 \u305d\u3046\u306a\u3093 \u305d\u3046\u3072\u3099 \u305d\u3046\u3081\u3093 \u305d\u3046\u308a \u305d\u3048\u3082\u306e \u305d\u3048\u3093 \u305d\u304b\u3099\u3044 \u305d\u3051\u3099\u304d \u305d\u3053\u3046 \u305d\u3053\u305d\u3053 \u305d\u3055\u3099\u3044 \u305d\u3057\u306a \u305d\u305b\u3044 \u305d\u305b\u3093 \u305d\u305d\u304f\u3099 \u305d\u305f\u3099\u3066\u308b \u305d\u3064\u3046 \u305d\u3064\u3048\u3093 \u305d\u3063\u304b\u3093 \u305d\u3064\u304d\u3099\u3087\u3046 \u305d\u3063\u3051\u3064 \u305d\u3063\u3053\u3046 \u305d\u3063\u305b\u3093 \u305d\u3063\u3068 \u305d\u3068\u304b\u3099\u308f \u305d\u3068\u3064\u3099\u3089 \u305d\u306a\u3048\u308b \u305d\u306a\u305f \u305d\u3075\u307b\u3099 \u305d\u307b\u3099\u304f \u305d\u307b\u3099\u308d \u305d\u307e\u3064 \u305d\u307e\u308b \u305d\u3080\u304f \u305d\u3080\u308a\u3048 \u305d\u3081\u308b \u305d\u3082\u305d\u3082 \u305d\u3088\u304b\u305b\u3099 \u305d\u3089\u307e\u3081 \u305d\u308d\u3046 \u305d\u3093\u304b\u3044 \u305d\u3093\u3051\u3044 \u305d\u3093\u3055\u3099\u3044 \u305d\u3093\u3057\u3064 \u305d\u3093\u305d\u3099\u304f \u305d\u3093\u3061\u3087\u3046 \u305d\u3099\u3093\u3072\u3099 \u305d\u3099\u3093\u3075\u3099\u3093 \u305d\u3093\u307f\u3093 \u305f\u3042\u3044 \u305f\u3044\u3044\u3093 \u305f\u3044\u3046\u3093 \u305f\u3044\u3048\u304d \u305f\u3044\u304a\u3046 \u305f\u3099\u3044\u304b\u3099\u304f \u305f\u3044\u304d \u305f\u3044\u304f\u3099\u3046 \u305f\u3044\u3051\u3093 \u305f\u3044\u3053 \u305f\u3044\u3055\u3099\u3044 \u305f\u3099\u3044\u3057\u3099\u3087\u3046\u3075\u3099 \u305f\u3099\u3044\u3059\u304d \u305f\u3044\u305b\u3064 \u305f\u3044\u305d\u3046 \u305f\u3099\u3044\u305f\u3044 \u305f\u3044\u3061\u3087\u3046 \u305f\u3044\u3066\u3044 \u305f\u3099\u3044\u3068\u3099\u3053\u308d \u305f\u3044\u306a\u3044 \u305f\u3044\u306d\u3064 \u305f\u3044\u306e\u3046 \u305f\u3044\u306f\u3093 \u305f\u3099\u3044\u3072\u3087\u3046 \u305f\u3044\u3075\u3046 \u305f\u3044\u3078\u3093 \u305f\u3044\u307b \u305f\u3044\u307e\u3064\u306f\u3099\u306a \u305f\u3044\u307f\u3093\u304f\u3099 \u305f\u3044\u3080 \u305f\u3044\u3081\u3093 \u305f\u3044\u3084\u304d \u305f\u3044\u3088\u3046 \u305f\u3044\u3089 \u305f\u3044\u308a\u3087\u304f \u305f\u3044\u308b \u305f\u3044\u308f\u3093 \u305f\u3046\u3048 \u305f\u3048\u308b \u305f\u304a\u3059 \u305f\u304a\u308b \u305f\u304a\u308c\u308b \u305f\u304b\u3044 \u305f\u304b\u306d \u305f\u304d\u3072\u3099 \u305f\u304f\u3055\u3093 \u305f\u3053\u304f \u305f\u3053\u3084\u304d \u305f\u3055\u3044 \u305f\u3057\u3055\u3099\u3093 \u305f\u3099\u3057\u3099\u3083\u308c \u305f\u3059\u3051\u308b \u305f\u3059\u3099\u3055\u308f\u308b \u305f\u305d\u304b\u3099\u308c \u305f\u305f\u304b\u3046 \u305f\u305f\u304f \u305f\u305f\u3099\u3057\u3044 \u305f\u305f\u307f \u305f\u3061\u306f\u3099\u306a \u305f\u3099\u3063\u304b\u3044 \u305f\u3099\u3063\u304d\u3083\u304f \u305f\u3099\u3063\u3053 \u305f\u3099\u3063\u3057\u3085\u3064 \u305f\u3099\u3063\u305f\u3044 \u305f\u3066\u308b \u305f\u3068\u3048\u308b \u305f\u306a\u306f\u3099\u305f \u305f\u306b\u3093 \u305f\u306c\u304d \u305f\u306e\u3057\u307f \u305f\u306f\u3064 \u305f\u3075\u3099\u3093 \u305f\u3078\u3099\u308b \u305f\u307b\u3099\u3046 \u305f\u307e\u3053\u3099 \u305f\u307e\u308b \u305f\u3099\u3080\u308b \u305f\u3081\u3044\u304d \u305f\u3081\u3059 \u305f\u3081\u308b \u305f\u3082\u3064 \u305f\u3084\u3059\u3044 \u305f\u3088\u308b \u305f\u3089\u3059 \u305f\u308a\u304d\u307b\u3093\u304b\u3099\u3093 \u305f\u308a\u3087\u3046 \u305f\u308a\u308b \u305f\u308b\u3068 \u305f\u308c\u308b \u305f\u308c\u3093\u3068 \u305f\u308d\u3063\u3068 \u305f\u308f\u3080\u308c\u308b \u305f\u3099\u3093\u3042\u3064 \u305f\u3093\u3044 \u305f\u3093\u304a\u3093 \u305f\u3093\u304b \u305f\u3093\u304d \u305f\u3093\u3051\u3093 \u305f\u3093\u3053\u3099 \u305f\u3093\u3055\u3093 \u305f\u3093\u3057\u3099\u3087\u3046\u3072\u3099 \u305f\u3099\u3093\u305b\u3044 \u305f\u3093\u305d\u304f \u305f\u3093\u305f\u3044 \u305f\u3099\u3093\u3061 \u305f\u3093\u3066\u3044 \u305f\u3093\u3068\u3046 \u305f\u3099\u3093\u306a \u305f\u3093\u306b\u3093 \u305f\u3099\u3093\u306d\u3064 \u305f\u3093\u306e\u3046 \u305f\u3093\u3072\u309a\u3093 \u305f\u3099\u3093\u307b\u3099\u3046 \u305f\u3093\u307e\u3064 \u305f\u3093\u3081\u3044 \u305f\u3099\u3093\u308c\u3064 \u305f\u3099\u3093\u308d \u305f\u3099\u3093\u308f \u3061\u3042\u3044 \u3061\u3042\u3093 \u3061\u3044\u304d \u3061\u3044\u3055\u3044 \u3061\u3048\u3093 \u3061\u304b\u3044 \u3061\u304b\u3089 \u3061\u304d\u3085\u3046 \u3061\u304d\u3093 \u3061\u3051\u3044\u3059\u3099 \u3061\u3051\u3093 \u3061\u3053\u304f \u3061\u3055\u3044 \u3061\u3057\u304d \u3061\u3057\u308a\u3087\u3046 \u3061\u305b\u3044 \u3061\u305d\u3046 \u3061\u305f\u3044 \u3061\u305f\u3093 \u3061\u3061\u304a\u3084 \u3061\u3064\u3057\u3099\u3087 \u3061\u3066\u304d \u3061\u3066\u3093 \u3061\u306c\u304d \u3061\u306c\u308a \u3061\u306e\u3046 \u3061\u3072\u3087\u3046 \u3061\u3078\u3044\u305b\u3093 \u3061\u307b\u3046 \u3061\u307e\u305f \u3061\u307f\u3064 \u3061\u307f\u3068\u3099\u308d \u3061\u3081\u3044\u3068\u3099 \u3061\u3083\u3093\u3053\u306a\u3078\u3099 \u3061\u3085\u3046\u3044 \u3061\u3086\u308a\u3087\u304f \u3061\u3087\u3046\u3057 \u3061\u3087\u3055\u304f\u3051\u3093 \u3061\u3089\u3057 \u3061\u3089\u307f \u3061\u308a\u304b\u3099\u307f \u3061\u308a\u3087\u3046 \u3061\u308b\u3068\u3099 \u3061\u308f\u308f \u3061\u3093\u305f\u3044 \u3061\u3093\u3082\u304f \u3064\u3044\u304b \u3064\u3044\u305f\u3061 \u3064\u3046\u304b \u3064\u3046\u3057\u3099\u3087\u3046 \u3064\u3046\u306f\u3093 \u3064\u3046\u308f \u3064\u304b\u3046 \u3064\u304b\u308c\u308b \u3064\u304f\u306d \u3064\u304f\u308b \u3064\u3051\u306d \u3064\u3051\u308b \u3064\u3053\u3099\u3046 \u3064\u305f\u3048\u308b \u3064\u3064\u3099\u304f \u3064\u3064\u3057\u3099 \u3064\u3064\u3080 \u3064\u3068\u3081\u308b \u3064\u306a\u304b\u3099\u308b \u3064\u306a\u307f \u3064\u306d\u3064\u3099\u306d \u3064\u306e\u308b \u3064\u3075\u3099\u3059 \u3064\u307e\u3089\u306a\u3044 \u3064\u307e\u308b \u3064\u307f\u304d \u3064\u3081\u305f\u3044 \u3064\u3082\u308a \u3064\u3082\u308b \u3064\u3088\u3044 \u3064\u308b\u307b\u3099 \u3064\u308b\u307f\u304f \u3064\u308f\u3082\u306e \u3064\u308f\u308a \u3066\u3042\u3057 \u3066\u3042\u3066 \u3066\u3042\u307f \u3066\u3044\u304a\u3093 \u3066\u3044\u304b \u3066\u3044\u304d \u3066\u3044\u3051\u3044 \u3066\u3044\u3053\u304f \u3066\u3044\u3055\u3064 \u3066\u3044\u3057 \u3066\u3044\u305b\u3044 \u3066\u3044\u305f\u3044 \u3066\u3044\u3068\u3099 \u3066\u3044\u306d\u3044 \u3066\u3044\u3072\u3087\u3046 \u3066\u3044\u3078\u3093 \u3066\u3044\u307b\u3099\u3046 \u3066\u3046\u3061 \u3066\u304a\u304f\u308c \u3066\u304d\u3068\u3046 \u3066\u304f\u3072\u3099 \u3066\u3099\u3053\u307b\u3099\u3053 \u3066\u3055\u304d\u3099\u3087\u3046 \u3066\u3055\u3051\u3099 \u3066\u3059\u308a \u3066\u305d\u3046 \u3066\u3061\u304b\u3099\u3044 \u3066\u3061\u3087\u3046 \u3066\u3064\u304b\u3099\u304f \u3066\u3064\u3064\u3099\u304d \u3066\u3099\u3063\u306f\u309a \u3066\u3064\u307b\u3099\u3046 \u3066\u3064\u3084 \u3066\u3099\u306c\u304b\u3048 \u3066\u306c\u304d \u3066\u306c\u304f\u3099\u3044 \u3066\u306e\u3072\u3089 \u3066\u306f\u3044 \u3066\u3075\u3099\u304f\u308d \u3066\u3075\u305f\u3099 \u3066\u307b\u3068\u3099\u304d \u3066\u307b\u3093 \u3066\u307e\u3048 \u3066\u307e\u304d\u3059\u3099\u3057 \u3066\u307f\u3057\u3099\u304b \u3066\u307f\u3084\u3051\u3099 \u3066\u3089\u3059 \u3066\u308c\u3072\u3099 \u3066\u308f\u3051 \u3066\u308f\u305f\u3057 \u3066\u3099\u3093\u3042\u3064 \u3066\u3093\u3044\u3093 \u3066\u3093\u304b\u3044 \u3066\u3093\u304d \u3066\u3093\u304f\u3099 \u3066\u3093\u3051\u3093 \u3066\u3093\u3053\u3099\u304f \u3066\u3093\u3055\u3044 \u3066\u3093\u3057 \u3066\u3093\u3059\u3046 \u3066\u3099\u3093\u3061 \u3066\u3093\u3066\u304d \u3066\u3093\u3068\u3046 \u3066\u3093\u306a\u3044 \u3066\u3093\u3075\u309a\u3089 \u3066\u3093\u307b\u3099\u3046\u305f\u3099\u3044 \u3066\u3093\u3081\u3064 \u3066\u3093\u3089\u3093\u304b\u3044 \u3066\u3099\u3093\u308a\u3087\u304f \u3066\u3099\u3093\u308f \u3068\u3099\u3042\u3044 \u3068\u3044\u308c \u3068\u3099\u3046\u304b\u3093 \u3068\u3046\u304d\u3085\u3046 \u3068\u3099\u3046\u304f\u3099 \u3068\u3046\u3057 \u3068\u3046\u3080\u304d\u3099 \u3068\u304a\u3044 \u3068\u304a\u304b \u3068\u304a\u304f \u3068\u304a\u3059 \u3068\u304a\u308b \u3068\u304b\u3044 \u3068\u304b\u3059 \u3068\u304d\u304a\u308a \u3068\u304d\u3068\u3099\u304d \u3068\u304f\u3044 \u3068\u304f\u3057\u3085\u3046 \u3068\u304f\u3066\u3093 \u3068\u304f\u306b \u3068\u304f\u3078\u3099\u3064 \u3068\u3051\u3044 \u3068\u3051\u308b \u3068\u3053\u3084 \u3068\u3055\u304b \u3068\u3057\u3087\u304b\u3093 \u3068\u305d\u3046 \u3068\u305f\u3093 \u3068\u3061\u3085\u3046 \u3068\u3063\u304d\u3085\u3046 \u3068\u3063\u304f\u3093 \u3068\u3064\u305b\u3099\u3093 \u3068\u3064\u306b\u3085\u3046 \u3068\u3068\u3099\u3051\u308b \u3068\u3068\u306e\u3048\u308b \u3068\u306a\u3044 \u3068\u306a\u3048\u308b \u3068\u306a\u308a \u3068\u306e\u3055\u307e \u3068\u306f\u3099\u3059 \u3068\u3099\u3075\u3099\u304b\u3099\u308f \u3068\u307b\u3046 \u3068\u307e\u308b \u3068\u3081\u308b \u3068\u3082\u305f\u3099\u3061 \u3068\u3082\u308b \u3068\u3099\u3088\u3046\u3072\u3099 \u3068\u3089\u3048\u308b \u3068\u3093\u304b\u3064 \u3068\u3099\u3093\u3075\u3099\u308a \u306a\u3044\u304b\u304f \u306a\u3044\u3053\u3046 \u306a\u3044\u3057\u3087 \u306a\u3044\u3059 \u306a\u3044\u305b\u3093 \u306a\u3044\u305d\u3046 \u306a\u304a\u3059 \u306a\u304b\u3099\u3044 \u306a\u304f\u3059 \u306a\u3051\u3099\u308b \u306a\u3053\u3046\u3068\u3099 \u306a\u3055\u3051 \u306a\u305f\u3066\u3099\u3053\u3053 \u306a\u3063\u3068\u3046 \u306a\u3064\u3084\u3059\u307f \u306a\u306a\u304a\u3057 \u306a\u306b\u3053\u3099\u3068 \u306a\u306b\u3082\u306e \u306a\u306b\u308f \u306a\u306e\u304b \u306a\u3075\u305f\u3099 \u306a\u307e\u3044\u304d \u306a\u307e\u3048 \u306a\u307e\u307f \u306a\u307f\u305f\u3099 \u306a\u3081\u3089\u304b \u306a\u3081\u308b \u306a\u3084\u3080 \u306a\u3089\u3046 \u306a\u3089\u3072\u3099 \u306a\u3089\u3075\u3099 \u306a\u308c\u308b \u306a\u308f\u3068\u3072\u3099 \u306a\u308f\u306f\u3099\u308a \u306b\u3042\u3046 \u306b\u3044\u304b\u3099\u305f \u306b\u3046\u3051 \u306b\u304a\u3044 \u306b\u304b\u3044 \u306b\u304b\u3099\u3066 \u306b\u304d\u3072\u3099 \u306b\u304f\u3057\u307f \u306b\u304f\u307e\u3093 \u306b\u3051\u3099\u308b \u306b\u3055\u3093\u304b\u305f\u3093\u305d \u306b\u3057\u304d \u306b\u305b\u3082\u306e \u306b\u3061\u3057\u3099\u3087\u3046 \u306b\u3061\u3088\u3046\u3072\u3099 \u306b\u3063\u304b \u306b\u3063\u304d \u306b\u3063\u3051\u3044 \u306b\u3063\u3053\u3046 \u306b\u3063\u3055\u3093 \u306b\u3063\u3057\u3087\u304f \u306b\u3063\u3059\u3046 \u306b\u3063\u305b\u304d \u306b\u3063\u3066\u3044 \u306b\u306a\u3046 \u306b\u307b\u3093 \u306b\u307e\u3081 \u306b\u3082\u3064 \u306b\u3084\u308a \u306b\u3085\u3046\u3044\u3093 \u306b\u308a\u3093\u3057\u3083 \u306b\u308f\u3068\u308a \u306b\u3093\u3044 \u306b\u3093\u304b \u306b\u3093\u304d \u306b\u3093\u3051\u3099\u3093 \u306b\u3093\u3057\u304d \u306b\u3093\u3059\u3099\u3046 \u306b\u3093\u305d\u3046 \u306b\u3093\u305f\u3044 \u306b\u3093\u3061 \u306b\u3093\u3066\u3044 \u306b\u3093\u306b\u304f \u306b\u3093\u3075\u309a \u306b\u3093\u307e\u308a \u306b\u3093\u3080 \u306b\u3093\u3081\u3044 \u306b\u3093\u3088\u3046 \u306c\u3044\u304f\u304d\u3099 \u306c\u304b\u3059 \u306c\u304f\u3099\u3044\u3068\u308b \u306c\u304f\u3099\u3046 \u306c\u304f\u3082\u308a \u306c\u3059\u3080 \u306c\u307e\u3048\u3072\u3099 \u306c\u3081\u308a \u306c\u3089\u3059 \u306c\u3093\u3061\u3083\u304f \u306d\u3042\u3051\u3099 \u306d\u3044\u304d \u306d\u3044\u308b \u306d\u3044\u308d \u306d\u304f\u3099\u305b \u306d\u304f\u305f\u3044 \u306d\u304f\u3089 \u306d\u3053\u305b\u3099 \u306d\u3053\u3080 \u306d\u3055\u3051\u3099 \u306d\u3059\u3053\u3099\u3059 \u306d\u305d\u3078\u3099\u308b \u306d\u305f\u3099\u3093 \u306d\u3064\u3044 \u306d\u3063\u3057\u3093 \u306d\u3064\u305d\u3099\u3046 \u306d\u3063\u305f\u3044\u304d\u3099\u3087 \u306d\u3075\u3099\u305d\u304f \u306d\u3075\u305f\u3099 \u306d\u307b\u3099\u3046 \u306d\u307b\u308a\u306f\u307b\u308a \u306d\u307e\u304d \u306d\u307e\u308f\u3057 \u306d\u307f\u307f \u306d\u3080\u3044 \u306d\u3080\u305f\u3044 \u306d\u3082\u3068 \u306d\u3089\u3046 \u306d\u308f\u3055\u3099 \u306d\u3093\u3044\u308a \u306d\u3093\u304a\u3057 \u306d\u3093\u304b\u3093 \u306d\u3093\u304d\u3093 \u306d\u3093\u304f\u3099 \u306d\u3093\u3055\u3099 \u306d\u3093\u3057 \u306d\u3093\u3061\u3083\u304f \u306d\u3093\u3068\u3099 \u306d\u3093\u3072\u309a \u306d\u3093\u3075\u3099\u3064 \u306d\u3093\u307e\u3064 \u306d\u3093\u308a\u3087\u3046 \u306d\u3093\u308c\u3044 \u306e\u3044\u3059\u3099 \u306e\u304a\u3064\u3099\u307e \u306e\u304b\u3099\u3059 \u306e\u304d\u306a\u307f \u306e\u3053\u304d\u3099\u308a \u306e\u3053\u3059 \u306e\u3053\u308b \u306e\u305b\u308b \u306e\u305d\u3099\u304f \u306e\u305d\u3099\u3080 \u306e\u305f\u307e\u3046 \u306e\u3061\u307b\u3068\u3099 \u306e\u3063\u304f \u306e\u306f\u3099\u3059 \u306e\u306f\u3089 \u306e\u3078\u3099\u308b \u306e\u307b\u3099\u308b \u306e\u307f\u3082\u306e \u306e\u3084\u307e \u306e\u3089\u3044\u306c \u306e\u3089\u306d\u3053 \u306e\u308a\u3082\u306e \u306e\u308a\u3086\u304d \u306e\u308c\u3093 \u306e\u3093\u304d \u306f\u3099\u3042\u3044 \u306f\u3042\u304f \u306f\u3099\u3042\u3055\u3093 \u306f\u3099\u3044\u304b \u306f\u3099\u3044\u304f \u306f\u3044\u3051\u3093 \u306f\u3044\u3053\u3099 \u306f\u3044\u3057\u3093 \u306f\u3044\u3059\u3044 \u306f\u3044\u305b\u3093 \u306f\u3044\u305d\u3046 \u306f\u3044\u3061 \u306f\u3099\u3044\u306f\u3099\u3044 \u306f\u3044\u308c\u3064 \u306f\u3048\u308b \u306f\u304a\u308b \u306f\u304b\u3044 \u306f\u3099\u304b\u308a \u306f\u304b\u308b \u306f\u304f\u3057\u3085 \u306f\u3051\u3093 \u306f\u3053\u3075\u3099 \u306f\u3055\u307f \u306f\u3055\u3093 \u306f\u3057\u3053\u3099 \u306f\u3099\u3057\u3087 \u306f\u3057\u308b \u306f\u305b\u308b \u306f\u309a\u305d\u3053\u3093 \u306f\u305d\u3093 \u306f\u305f\u3093 \u306f\u3061\u307f\u3064 \u306f\u3064\u304a\u3093 \u306f\u3063\u304b\u304f \u306f\u3064\u3099\u304d \u306f\u3063\u304d\u308a \u306f\u3063\u304f\u3064 \u306f\u3063\u3051\u3093 \u306f\u3063\u3053\u3046 \u306f\u3063\u3055\u3093 \u306f\u3063\u3057\u3093 \u306f\u3063\u305f\u3064 \u306f\u3063\u3061\u3085\u3046 \u306f\u3063\u3066\u3093 \u306f\u3063\u3072\u309a\u3087\u3046 \u306f\u3063\u307b\u309a\u3046 \u306f\u306a\u3059 \u306f\u306a\u3072\u3099 \u306f\u306b\u304b\u3080 \u306f\u3075\u3099\u3089\u3057 \u306f\u307f\u304b\u3099\u304d \u306f\u3080\u304b\u3046 \u306f\u3081\u3064 \u306f\u3084\u3044 \u306f\u3084\u3057 \u306f\u3089\u3046 \u306f\u308d\u3046\u3043\u3093 \u306f\u308f\u3044 \u306f\u3093\u3044 \u306f\u3093\u3048\u3044 \u306f\u3093\u304a\u3093 \u306f\u3093\u304b\u304f \u306f\u3093\u304d\u3087\u3046 \u306f\u3099\u3093\u304f\u3099\u307f \u306f\u3093\u3053 \u306f\u3093\u3057\u3083 \u306f\u3093\u3059\u3046 \u306f\u3093\u305f\u3099\u3093 \u306f\u309a\u3093\u3061 \u306f\u309a\u3093\u3064 \u306f\u3093\u3066\u3044 \u306f\u3093\u3068\u3057 \u306f\u3093\u306e\u3046 \u306f\u3093\u306f\u309a \u306f\u3093\u3075\u3099\u3093 \u306f\u3093\u3078\u309a\u3093 \u306f\u3093\u307b\u3099\u3046\u304d \u306f\u3093\u3081\u3044 \u306f\u3093\u3089\u3093 \u306f\u3093\u308d\u3093 \u3072\u3044\u304d \u3072\u3046\u3093 \u3072\u3048\u308b \u3072\u304b\u304f \u3072\u304b\u308a \u3072\u304b\u308b \u3072\u304b\u3093 \u3072\u304f\u3044 \u3072\u3051\u3064 \u3072\u3053\u3046\u304d \u3072\u3053\u304f \u3072\u3055\u3044 \u3072\u3055\u3057\u3075\u3099\u308a \u3072\u3055\u3093 \u3072\u3099\u3057\u3099\u3085\u3064\u304b\u3093 \u3072\u3057\u3087 \u3072\u305d\u304b \u3072\u305d\u3080 \u3072\u305f\u3080\u304d \u3072\u305f\u3099\u308a \u3072\u305f\u308b \u3072\u3064\u304d\u3099 \u3072\u3063\u3053\u3057 \u3072\u3063\u3057 \u3072\u3064\u3057\u3099\u3085\u3072\u3093 \u3072\u3063\u3059 \u3072\u3064\u305b\u3099\u3093 \u3072\u309a\u3063\u305f\u308a \u3072\u309a\u3063\u3061\u308a \u3072\u3064\u3088\u3046 \u3072\u3066\u3044 \u3072\u3068\u3053\u3099\u307f \u3072\u306a\u307e\u3064\u308a \u3072\u306a\u3093 \u3072\u306d\u308b \u3072\u306f\u3093 \u3072\u3072\u3099\u304f \u3072\u3072\u3087\u3046 \u3072\u307b\u3046 \u3072\u307e\u308f\u308a \u3072\u307e\u3093 \u3072\u307f\u3064 \u3072\u3081\u3044 \u3072\u3081\u3057\u3099\u3057 \u3072\u3084\u3051 \u3072\u3084\u3059 \u3072\u3088\u3046 \u3072\u3099\u3087\u3046\u304d \u3072\u3089\u304b\u3099\u306a \u3072\u3089\u304f \u3072\u308a\u3064 \u3072\u308a\u3087\u3046 \u3072\u308b\u307e \u3072\u308b\u3084\u3059\u307f \u3072\u308c\u3044 \u3072\u308d\u3044 \u3072\u308d\u3046 \u3072\u308d\u304d \u3072\u308d\u3086\u304d \u3072\u3093\u304b\u304f \u3072\u3093\u3051\u3064 \u3072\u3093\u3053\u3093 \u3072\u3093\u3057\u3085 \u3072\u3093\u305d\u3046 \u3072\u309a\u3093\u3061 \u3072\u3093\u306f\u309a\u3093 \u3072\u3099\u3093\u307b\u3099\u3046 \u3075\u3042\u3093 \u3075\u3044\u3046\u3061 \u3075\u3046\u3051\u3044 \u3075\u3046\u305b\u3093 \u3075\u309a\u3046\u305f\u308d\u3046 \u3075\u3046\u3068\u3046 \u3075\u3046\u3075 \u3075\u3048\u308b \u3075\u304a\u3093 \u3075\u304b\u3044 \u3075\u304d\u3093 \u3075\u304f\u3055\u3099\u3064 \u3075\u304f\u3075\u3099\u304f\u308d \u3075\u3053\u3046 \u3075\u3055\u3044 \u3075\u3057\u304d\u3099 \u3075\u3057\u3099\u307f \u3075\u3059\u307e \u3075\u305b\u3044 \u3075\u305b\u304f\u3099 \u3075\u305d\u304f \u3075\u3099\u305f\u306b\u304f \u3075\u305f\u3093 \u3075\u3061\u3087\u3046 \u3075\u3064\u3046 \u3075\u3064\u304b \u3075\u3063\u304b\u3064 \u3075\u3063\u304d \u3075\u3063\u3053\u304f \u3075\u3099\u3068\u3099\u3046 \u3075\u3068\u308b \u3075\u3068\u3093 \u3075\u306e\u3046 \u3075\u306f\u3044 \u3075\u3072\u3087\u3046 \u3075\u3078\u3093 \u3075\u307e\u3093 \u3075\u307f\u3093 \u3075\u3081\u3064 \u3075\u3081\u3093 \u3075\u3088\u3046 \u3075\u308a\u3053 \u3075\u308a\u308b \u3075\u308b\u3044 \u3075\u3093\u3044\u304d \u3075\u3099\u3093\u304b\u3099\u304f \u3075\u3099\u3093\u304f\u3099 \u3075\u3093\u3057\u3064 \u3075\u3099\u3093\u305b\u304d \u3075\u3093\u305d\u3046 \u3075\u3099\u3093\u307b\u309a\u3046 \u3078\u3044\u3042\u3093 \u3078\u3044\u304a\u3093 \u3078\u3044\u304b\u3099\u3044 \u3078\u3044\u304d \u3078\u3044\u3051\u3099\u3093 \u3078\u3044\u3053\u3046 \u3078\u3044\u3055 \u3078\u3044\u3057\u3083 \u3078\u3044\u305b\u3064 \u3078\u3044\u305d \u3078\u3044\u305f\u304f \u3078\u3044\u3066\u3093 \u3078\u3044\u306d\u3064 \u3078\u3044\u308f \u3078\u304d\u304b\u3099 \u3078\u3053\u3080 \u3078\u3099\u306b\u3044\u308d \u3078\u3099\u306b\u3057\u3087\u3046\u304b\u3099 \u3078\u3089\u3059 \u3078\u3093\u304b\u3093 \u3078\u3099\u3093\u304d\u3087\u3046 \u3078\u3099\u3093\u3053\u3099\u3057 \u3078\u3093\u3055\u3044 \u3078\u3093\u305f\u3044 \u3078\u3099\u3093\u308a \u307b\u3042\u3093 \u307b\u3044\u304f \u307b\u3099\u3046\u304d\u3099\u3087 \u307b\u3046\u3053\u304f \u307b\u3046\u305d\u3046 \u307b\u3046\u307b\u3046 \u307b\u3046\u3082\u3093 \u307b\u3046\u308a\u3064 \u307b\u3048\u308b \u307b\u304a\u3093 \u307b\u304b\u3093 \u307b\u304d\u3087\u3046 \u307b\u3099\u304d\u3093 \u307b\u304f\u308d \u307b\u3051\u3064 \u307b\u3051\u3093 \u307b\u3053\u3046 \u307b\u3053\u308b \u307b\u3057\u3044 \u307b\u3057\u3064 \u307b\u3057\u3085 \u307b\u3057\u3087\u3046 \u307b\u305b\u3044 \u307b\u305d\u3044 \u307b\u305d\u304f \u307b\u305f\u3066 \u307b\u305f\u308b \u307b\u309a\u3061\u3075\u3099\u304f\u308d \u307b\u3063\u304d\u3087\u304f \u307b\u3063\u3055 \u307b\u3063\u305f\u3093 \u307b\u3068\u3093\u3068\u3099 \u307b\u3081\u308b \u307b\u3093\u3044 \u307b\u3093\u304d \u307b\u3093\u3051 \u307b\u3093\u3057\u3064 \u307b\u3093\u3084\u304f \u307e\u3044\u306b\u3061 \u307e\u304b\u3044 \u307e\u304b\u305b\u308b \u307e\u304b\u3099\u308b \u307e\u3051\u308b \u307e\u3053\u3068 \u307e\u3055\u3064 \u307e\u3057\u3099\u3081 \u307e\u3059\u304f \u307e\u305b\u3099\u308b \u307e\u3064\u308a \u307e\u3068\u3081 \u307e\u306a\u3075\u3099 \u307e\u306c\u3051 \u307e\u306d\u304f \u307e\u307b\u3046 \u307e\u3082\u308b \u307e\u3086\u3051\u3099 \u307e\u3088\u3046 \u307e\u308d\u3084\u304b \u307e\u308f\u3059 \u307e\u308f\u308a \u307e\u308f\u308b \u307e\u3093\u304b\u3099 \u307e\u3093\u304d\u3064 \u307e\u3093\u305d\u3099\u304f \u307e\u3093\u306a\u304b \u307f\u3044\u3089 \u307f\u3046\u3061 \u307f\u3048\u308b \u307f\u304b\u3099\u304f \u307f\u304b\u305f \u307f\u304b\u3093 \u307f\u3051\u3093 \u307f\u3053\u3093 \u307f\u3057\u3099\u304b\u3044 \u307f\u3059\u3044 \u307f\u3059\u3048\u308b \u307f\u305b\u308b \u307f\u3063\u304b \u307f\u3064\u304b\u308b \u307f\u3064\u3051\u308b \u307f\u3066\u3044 \u307f\u3068\u3081\u308b \u307f\u306a\u3068 \u307f\u306a\u307f\u304b\u3055\u3044 \u307f\u306d\u3089\u308b \u307f\u306e\u3046 \u307f\u306e\u304b\u3099\u3059 \u307f\u307b\u3093 \u307f\u3082\u3068 \u307f\u3084\u3051\u3099 \u307f\u3089\u3044 \u307f\u308a\u3087\u304f \u307f\u308f\u304f \u307f\u3093\u304b \u307f\u3093\u305d\u3099\u304f \u3080\u3044\u304b \u3080\u3048\u304d \u3080\u3048\u3093 \u3080\u304b\u3044 \u3080\u304b\u3046 \u3080\u304b\u3048 \u3080\u304b\u3057 \u3080\u304d\u3099\u3061\u3083 \u3080\u3051\u308b \u3080\u3051\u3099\u3093 \u3080\u3055\u307b\u3099\u308b \u3080\u3057\u3042\u3064\u3044 \u3080\u3057\u306f\u3099 \u3080\u3057\u3099\u3085\u3093 \u3080\u3057\u308d \u3080\u3059\u3046 \u3080\u3059\u3053 \u3080\u3059\u3075\u3099 \u3080\u3059\u3081 \u3080\u305b\u308b \u3080\u305b\u3093 \u3080\u3061\u3085\u3046 \u3080\u306a\u3057\u3044 \u3080\u306e\u3046 \u3080\u3084\u307f \u3080\u3088\u3046 \u3080\u3089\u3055\u304d \u3080\u308a\u3087\u3046 \u3080\u308d\u3093 \u3081\u3044\u3042\u3093 \u3081\u3044\u3046\u3093 \u3081\u3044\u3048\u3093 \u3081\u3044\u304b\u304f \u3081\u3044\u304d\u3087\u304f \u3081\u3044\u3055\u3044 \u3081\u3044\u3057 \u3081\u3044\u305d\u3046 \u3081\u3044\u3075\u3099\u3064 \u3081\u3044\u308c\u3044 \u3081\u3044\u308f\u304f \u3081\u304f\u3099\u307e\u308c\u308b \u3081\u3055\u3099\u3059 \u3081\u3057\u305f \u3081\u3059\u3099\u3089\u3057\u3044 \u3081\u305f\u3099\u3064 \u3081\u307e\u3044 \u3081\u3084\u3059 \u3081\u3093\u304d\u3087 \u3081\u3093\u305b\u304d \u3081\u3093\u3068\u3099\u3046 \u3082\u3046\u3057\u3042\u3051\u3099\u308b \u3082\u3046\u3068\u3099\u3046\u3051\u3093 \u3082\u3048\u308b \u3082\u304f\u3057 \u3082\u304f\u3066\u304d \u3082\u304f\u3088\u3046\u3072\u3099 \u3082\u3061\u308d\u3093 \u3082\u3068\u3099\u308b \u3082\u3089\u3046 \u3082\u3093\u304f \u3082\u3093\u305f\u3099\u3044 \u3084\u304a\u3084 \u3084\u3051\u308b \u3084\u3055\u3044 \u3084\u3055\u3057\u3044 \u3084\u3059\u3044 \u3084\u3059\u305f\u308d\u3046 \u3084\u3059\u307f \u3084\u305b\u308b \u3084\u305d\u3046 \u3084\u305f\u3044 \u3084\u3061\u3093 \u3084\u3063\u3068 \u3084\u3063\u306f\u309a\u308a \u3084\u3075\u3099\u308b \u3084\u3081\u308b \u3084\u3084\u3053\u3057\u3044 \u3084\u3088\u3044 \u3084\u308f\u3089\u304b\u3044 \u3086\u3046\u304d \u3086\u3046\u3072\u3099\u3093\u304d\u3087\u304f \u3086\u3046\u3078\u3099 \u3086\u3046\u3081\u3044 \u3086\u3051\u3064 \u3086\u3057\u3085\u3064 \u3086\u305b\u3093 \u3086\u305d\u3046 \u3086\u305f\u304b \u3086\u3061\u3083\u304f \u3086\u3066\u3099\u308b \u3086\u306b\u3085\u3046 \u3086\u3072\u3099\u308f \u3086\u3089\u3044 \u3086\u308c\u308b \u3088\u3046\u3044 \u3088\u3046\u304b \u3088\u3046\u304d\u3085\u3046 \u3088\u3046\u3057\u3099 \u3088\u3046\u3059 \u3088\u3046\u3061\u3048\u3093 \u3088\u304b\u305b\u3099 \u3088\u304b\u3093 \u3088\u304d\u3093 \u3088\u304f\u305b\u3044 \u3088\u304f\u307b\u3099\u3046 \u3088\u3051\u3044 \u3088\u3053\u3099\u308c\u308b \u3088\u3055\u3093 \u3088\u3057\u3085\u3046 \u3088\u305d\u3046 \u3088\u305d\u304f \u3088\u3063\u304b \u3088\u3066\u3044 \u3088\u3068\u3099\u304b\u3099\u308f\u304f \u3088\u306d\u3064 \u3088\u3084\u304f \u3088\u3086\u3046 \u3088\u308d\u3053\u3075\u3099 \u3088\u308d\u3057\u3044 \u3089\u3044\u3046 \u3089\u304f\u304b\u3099\u304d \u3089\u304f\u3053\u3099 \u3089\u304f\u3055\u3064 \u3089\u304f\u305f\u3099 \u3089\u3057\u3093\u306f\u3099\u3093 \u3089\u305b\u3093 \u3089\u305d\u3099\u304f \u3089\u305f\u3044 \u3089\u3063\u304b \u3089\u308c\u3064 \u308a\u3048\u304d \u308a\u304b\u3044 \u308a\u304d\u3055\u304f \u308a\u304d\u305b\u3064 \u308a\u304f\u304f\u3099\u3093 \u308a\u304f\u3064 \u308a\u3051\u3093 \u308a\u3053\u3046 \u308a\u305b\u3044 \u308a\u305d\u3046 \u308a\u305d\u304f \u308a\u3066\u3093 \u308a\u306d\u3093 \u308a\u3086\u3046 \u308a\u3085\u3046\u304b\u3099\u304f \u308a\u3088\u3046 \u308a\u3087\u3046\u308a \u308a\u3087\u304b\u3093 \u308a\u3087\u304f\u3061\u3083 \u308a\u3087\u3053\u3046 \u308a\u308a\u304f \u308a\u308c\u304d \u308a\u308d\u3093 \u308a\u3093\u3053\u3099 \u308b\u3044\u3051\u3044 \u308b\u3044\u3055\u3044 \u308b\u3044\u3057\u3099 \u308b\u3044\u305b\u304d \u308b\u3059\u306f\u3099\u3093 \u308b\u308a\u304b\u3099\u308f\u3089 \u308c\u3044\u304b\u3093 \u308c\u3044\u304d\u3099 \u308c\u3044\u305b\u3044 \u308c\u3044\u305d\u3099\u3046\u3053 \u308c\u3044\u3068\u3046 \u308c\u3044\u307b\u3099\u3046 \u308c\u304d\u3057 \u308c\u304d\u305f\u3099\u3044 \u308c\u3093\u3042\u3044 \u308c\u3093\u3051\u3044 \u308c\u3093\u3053\u3093 \u308c\u3093\u3055\u3044 \u308c\u3093\u3057\u3085\u3046 \u308c\u3093\u305d\u3099\u304f \u308c\u3093\u3089\u304f \u308d\u3046\u304b \u308d\u3046\u3053\u3099 \u308d\u3046\u3057\u3099\u3093 \u308d\u3046\u305d\u304f \u308d\u304f\u304b\u3099 \u308d\u3053\u3064 \u308d\u3057\u3099\u3046\u3089 \u308d\u3057\u3085\u3064 \u308d\u305b\u3093 \u308d\u3066\u3093 \u308d\u3081\u3093 \u308d\u308c\u3064 \u308d\u3093\u304d\u3099 \u308d\u3093\u306f\u309a \u308d\u3093\u3075\u3099\u3093 \u308d\u3093\u308a \u308f\u304b\u3059 \u308f\u304b\u3081 \u308f\u304b\u3084\u307e \u308f\u304b\u308c\u308b \u308f\u3057\u3064 \u308f\u3057\u3099\u307e\u3057 \u308f\u3059\u308c\u3082\u306e \u308f\u3089\u3046 \u308f\u308c\u308b".split(" "),
korean:"\u1100\u1161\u1100\u1167\u11a8 \u1100\u1161\u1101\u1173\u11b7 \u1100\u1161\u1102\u1161\u11ab \u1100\u1161\u1102\u1173\u11bc \u1100\u1161\u1103\u1173\u11a8 \u1100\u1161\u1105\u1173\u110e\u1175\u11b7 \u1100\u1161\u1106\u116e\u11b7 \u1100\u1161\u1107\u1161\u11bc \u1100\u1161\u1109\u1161\u11bc \u1100\u1161\u1109\u1173\u11b7 \u1100\u1161\u110b\u116e\u11ab\u1103\u1166 \u1100\u1161\u110b\u1173\u11af \u1100\u1161\u110b\u1175\u1103\u1173 \u1100\u1161\u110b\u1175\u11b8 \u1100\u1161\u110c\u1161\u11bc \u1100\u1161\u110c\u1165\u11bc \u1100\u1161\u110c\u1169\u11a8 \u1100\u1161\u110c\u116e\u11a8 \u1100\u1161\u11a8\u110b\u1169 \u1100\u1161\u11a8\u110c\u1161 \u1100\u1161\u11ab\u1100\u1167\u11a8 \u1100\u1161\u11ab\u1107\u116e \u1100\u1161\u11ab\u1109\u1165\u11b8 \u1100\u1161\u11ab\u110c\u1161\u11bc \u1100\u1161\u11ab\u110c\u1165\u11b8 \u1100\u1161\u11ab\u1111\u1161\u11ab \u1100\u1161\u11af\u1103\u1173\u11bc \u1100\u1161\u11af\u1107\u1175 \u1100\u1161\u11af\u1109\u1162\u11a8 \u1100\u1161\u11af\u110c\u1173\u11bc \u1100\u1161\u11b7\u1100\u1161\u11a8 \u1100\u1161\u11b7\u1100\u1175 \u1100\u1161\u11b7\u1109\u1169 \u1100\u1161\u11b7\u1109\u116e\u1109\u1165\u11bc \u1100\u1161\u11b7\u110c\u1161 \u1100\u1161\u11b7\u110c\u1165\u11bc \u1100\u1161\u11b8\u110c\u1161\u1100\u1175 \u1100\u1161\u11bc\u1102\u1161\u11b7 \u1100\u1161\u11bc\u1103\u1161\u11bc \u1100\u1161\u11bc\u1103\u1169 \u1100\u1161\u11bc\u1105\u1167\u11a8\u1112\u1175 \u1100\u1161\u11bc\u1107\u1167\u11ab \u1100\u1161\u11bc\u1107\u116e\u11a8 \u1100\u1161\u11bc\u1109\u1161 \u1100\u1161\u11bc\u1109\u116e\u1105\u1163\u11bc \u1100\u1161\u11bc\u110b\u1161\u110c\u1175 \u1100\u1161\u11bc\u110b\u116f\u11ab\u1103\u1169 \u1100\u1161\u11bc\u110b\u1174 \u1100\u1161\u11bc\u110c\u1166 \u1100\u1161\u11bc\u110c\u1169 \u1100\u1161\u11c0\u110b\u1175 \u1100\u1162\u1100\u116e\u1105\u1175 \u1100\u1162\u1102\u1161\u1105\u1175 \u1100\u1162\u1107\u1161\u11bc \u1100\u1162\u1107\u1167\u11af \u1100\u1162\u1109\u1165\u11ab \u1100\u1162\u1109\u1165\u11bc \u1100\u1162\u110b\u1175\u11ab \u1100\u1162\u11a8\u1100\u116a\u11ab\u110c\u1165\u11a8 \u1100\u1165\u1109\u1175\u11af \u1100\u1165\u110b\u1162\u11a8 \u1100\u1165\u110b\u116e\u11af \u1100\u1165\u110c\u1175\u11ba \u1100\u1165\u1111\u116e\u11b7 \u1100\u1165\u11a8\u110c\u1165\u11bc \u1100\u1165\u11ab\u1100\u1161\u11bc \u1100\u1165\u11ab\u1106\u116e\u11af \u1100\u1165\u11ab\u1109\u1165\u11af \u1100\u1165\u11ab\u110c\u1169 \u1100\u1165\u11ab\u110e\u116e\u11a8 \u1100\u1165\u11af\u110b\u1173\u11b7 \u1100\u1165\u11b7\u1109\u1161 \u1100\u1165\u11b7\u1110\u1169 \u1100\u1166\u1109\u1175\u1111\u1161\u11ab \u1100\u1166\u110b\u1175\u11b7 \u1100\u1167\u110b\u116e\u11af \u1100\u1167\u11ab\u1112\u1162 \u1100\u1167\u11af\u1100\u116a \u1100\u1167\u11af\u1100\u116e\u11a8 \u1100\u1167\u11af\u1105\u1169\u11ab \u1100\u1167\u11af\u1109\u1165\u11a8 \u1100\u1167\u11af\u1109\u1173\u11bc \u1100\u1167\u11af\u1109\u1175\u11b7 \u1100\u1167\u11af\u110c\u1165\u11bc \u1100\u1167\u11af\u1112\u1169\u11ab \u1100\u1167\u11bc\u1100\u1168 \u1100\u1167\u11bc\u1100\u1169 \u1100\u1167\u11bc\u1100\u1175 \u1100\u1167\u11bc\u1105\u1167\u11a8 \u1100\u1167\u11bc\u1107\u1169\u11a8\u1100\u116e\u11bc \u1100\u1167\u11bc\u1107\u1175 \u1100\u1167\u11bc\u1109\u1161\u11bc\u1103\u1169 \u1100\u1167\u11bc\u110b\u1167\u11bc \u1100\u1167\u11bc\u110b\u116e \u1100\u1167\u11bc\u110c\u1162\u11bc \u1100\u1167\u11bc\u110c\u1166 \u1100\u1167\u11bc\u110c\u116e \u1100\u1167\u11bc\u110e\u1161\u11af \u1100\u1167\u11bc\u110e\u1175 \u1100\u1167\u11bc\u1112\u1163\u11bc \u1100\u1167\u11bc\u1112\u1165\u11b7 \u1100\u1168\u1100\u1169\u11a8 \u1100\u1168\u1103\u1161\u11ab \u1100\u1168\u1105\u1161\u11ab \u1100\u1168\u1109\u1161\u11ab \u1100\u1168\u1109\u1169\u11a8 \u1100\u1168\u110b\u1163\u11a8 \u1100\u1168\u110c\u1165\u11af \u1100\u1168\u110e\u1173\u11bc \u1100\u1168\u1112\u116c\u11a8 \u1100\u1169\u1100\u1162\u11a8 \u1100\u1169\u1100\u116e\u1105\u1167 \u1100\u1169\u1100\u116e\u11bc \u1100\u1169\u1100\u1173\u11b8 \u1100\u1169\u1103\u1173\u11bc\u1112\u1161\u11a8\u1109\u1162\u11bc \u1100\u1169\u1106\u116e\u1109\u1175\u11ab \u1100\u1169\u1106\u1175\u11ab \u1100\u1169\u110b\u1163\u11bc\u110b\u1175 \u1100\u1169\u110c\u1161\u11bc \u1100\u1169\u110c\u1165\u11ab \u1100\u1169\u110c\u1175\u11b8 \u1100\u1169\u110e\u116e\u11ba\u1100\u1161\u1105\u116e \u1100\u1169\u1110\u1169\u11bc \u1100\u1169\u1112\u1163\u11bc \u1100\u1169\u11a8\u1109\u1175\u11a8 \u1100\u1169\u11af\u1106\u1169\u11a8 \u1100\u1169\u11af\u110d\u1161\u1100\u1175 \u1100\u1169\u11af\u1111\u1173 \u1100\u1169\u11bc\u1100\u1161\u11ab \u1100\u1169\u11bc\u1100\u1162 \u1100\u1169\u11bc\u1100\u1167\u11a8 \u1100\u1169\u11bc\u1100\u116e\u11ab \u1100\u1169\u11bc\u1100\u1173\u11b8 \u1100\u1169\u11bc\u1100\u1175 \u1100\u1169\u11bc\u1103\u1169\u11bc \u1100\u1169\u11bc\u1106\u116e\u110b\u116f\u11ab \u1100\u1169\u11bc\u1107\u116e \u1100\u1169\u11bc\u1109\u1161 \u1100\u1169\u11bc\u1109\u1175\u11a8 \u1100\u1169\u11bc\u110b\u1165\u11b8 \u1100\u1169\u11bc\u110b\u1167\u11ab \u1100\u1169\u11bc\u110b\u116f\u11ab \u1100\u1169\u11bc\u110c\u1161\u11bc \u1100\u1169\u11bc\u110d\u1161 \u1100\u1169\u11bc\u110e\u1162\u11a8 \u1100\u1169\u11bc\u1110\u1169\u11bc \u1100\u1169\u11bc\u1111\u1169 \u1100\u1169\u11bc\u1112\u1161\u11bc \u1100\u1169\u11bc\u1112\u1172\u110b\u1175\u11af \u1100\u116a\u1106\u1169\u11a8 \u1100\u116a\u110b\u1175\u11af \u1100\u116a\u110c\u1161\u11bc \u1100\u116a\u110c\u1165\u11bc \u1100\u116a\u1112\u1161\u11a8 \u1100\u116a\u11ab\u1100\u1162\u11a8 \u1100\u116a\u11ab\u1100\u1168 \u1100\u116a\u11ab\u1100\u116a\u11bc \u1100\u116a\u11ab\u1102\u1167\u11b7 \u1100\u116a\u11ab\u1105\u1161\u11b7 \u1100\u116a\u11ab\u1105\u1167\u11ab \u1100\u116a\u11ab\u1105\u1175 \u1100\u116a\u11ab\u1109\u1173\u11b8 \u1100\u116a\u11ab\u1109\u1175\u11b7 \u1100\u116a\u11ab\u110c\u1165\u11b7 \u1100\u116a\u11ab\u110e\u1161\u11af \u1100\u116a\u11bc\u1100\u1167\u11bc \u1100\u116a\u11bc\u1100\u1169 \u1100\u116a\u11bc\u110c\u1161\u11bc \u1100\u116a\u11bc\u110c\u116e \u1100\u116c\u1105\u1169\u110b\u116e\u11b7 \u1100\u116c\u11bc\u110c\u1161\u11bc\u1112\u1175 \u1100\u116d\u1100\u116a\u1109\u1165 \u1100\u116d\u1106\u116e\u11ab \u1100\u116d\u1107\u1169\u11a8 \u1100\u116d\u1109\u1175\u11af \u1100\u116d\u110b\u1163\u11bc \u1100\u116d\u110b\u1172\u11a8 \u1100\u116d\u110c\u1161\u11bc \u1100\u116d\u110c\u1175\u11a8 \u1100\u116d\u1110\u1169\u11bc \u1100\u116d\u1112\u116a\u11ab \u1100\u116d\u1112\u116e\u11ab \u1100\u116e\u1100\u1167\u11bc \u1100\u116e\u1105\u1173\u11b7 \u1100\u116e\u1106\u1165\u11bc \u1100\u116e\u1107\u1167\u11af \u1100\u116e\u1107\u116e\u11ab \u1100\u116e\u1109\u1165\u11a8 \u1100\u116e\u1109\u1165\u11bc \u1100\u116e\u1109\u1169\u11a8 \u1100\u116e\u110b\u1167\u11a8 \u1100\u116e\u110b\u1175\u11b8 \u1100\u116e\u110e\u1165\u11bc \u1100\u116e\u110e\u1166\u110c\u1165\u11a8 \u1100\u116e\u11a8\u1100\u1161 \u1100\u116e\u11a8\u1100\u1175 \u1100\u116e\u11a8\u1102\u1162 \u1100\u116e\u11a8\u1105\u1175\u11b8 \u1100\u116e\u11a8\u1106\u116e\u11af \u1100\u116e\u11a8\u1106\u1175\u11ab \u1100\u116e\u11a8\u1109\u116e \u1100\u116e\u11a8\u110b\u1165 \u1100\u116e\u11a8\u110b\u116a\u11bc \u1100\u116e\u11a8\u110c\u1165\u11a8 \u1100\u116e\u11a8\u110c\u1166 \u1100\u116e\u11a8\u1112\u116c \u1100\u116e\u11ab\u1103\u1162 \u1100\u116e\u11ab\u1109\u1161 \u1100\u116e\u11ab\u110b\u1175\u11ab \u1100\u116e\u11bc\u1100\u1173\u11a8\u110c\u1165\u11a8 \u1100\u116f\u11ab\u1105\u1175 \u1100\u116f\u11ab\u110b\u1171 \u1100\u116f\u11ab\u1110\u116e \u1100\u1171\u1100\u116e\u11a8 \u1100\u1171\u1109\u1175\u11ab \u1100\u1172\u110c\u1165\u11bc \u1100\u1172\u110e\u1175\u11a8 \u1100\u1172\u11ab\u1112\u1167\u11bc \u1100\u1173\u1102\u1161\u11af \u1100\u1173\u1102\u1163\u11bc \u1100\u1173\u1102\u1173\u11af \u1100\u1173\u1105\u1165\u1102\u1161 \u1100\u1173\u1105\u116e\u11b8 \u1100\u1173\u1105\u1173\u11ba \u1100\u1173\u1105\u1175\u11b7 \u1100\u1173\u110c\u1166\u1109\u1165\u110b\u1163 \u1100\u1173\u1110\u1169\u1105\u1169\u11a8 \u1100\u1173\u11a8\u1107\u1169\u11a8 \u1100\u1173\u11a8\u1112\u1175 \u1100\u1173\u11ab\u1100\u1165 \u1100\u1173\u11ab\u1100\u116d \u1100\u1173\u11ab\u1105\u1162 \u1100\u1173\u11ab\u1105\u1169 \u1100\u1173\u11ab\u1106\u116e \u1100\u1173\u11ab\u1107\u1169\u11ab \u1100\u1173\u11ab\u110b\u116f\u11ab \u1100\u1173\u11ab\u110b\u1172\u11a8 \u1100\u1173\u11ab\u110e\u1165 \u1100\u1173\u11af\u110a\u1175 \u1100\u1173\u11af\u110c\u1161 \u1100\u1173\u11b7\u1100\u1161\u11bc\u1109\u1161\u11ab \u1100\u1173\u11b7\u1100\u1169 \u1100\u1173\u11b7\u1102\u1167\u11ab \u1100\u1173\u11b7\u1106\u1166\u1103\u1161\u11af \u1100\u1173\u11b7\u110b\u1162\u11a8 \u1100\u1173\u11b7\u110b\u1167\u11ab \u1100\u1173\u11b7\u110b\u116d\u110b\u1175\u11af \u1100\u1173\u11b7\u110c\u1175 \u1100\u1173\u11bc\u110c\u1165\u11bc\u110c\u1165\u11a8 \u1100\u1175\u1100\u1161\u11ab \u1100\u1175\u1100\u116a\u11ab \u1100\u1175\u1102\u1167\u11b7 \u1100\u1175\u1102\u1173\u11bc \u1100\u1175\u1103\u1169\u11a8\u1100\u116d \u1100\u1175\u1103\u116e\u11bc \u1100\u1175\u1105\u1169\u11a8 \u1100\u1175\u1105\u1173\u11b7 \u1100\u1175\u1107\u1165\u11b8 \u1100\u1175\u1107\u1169\u11ab \u1100\u1175\u1107\u116e\u11ab \u1100\u1175\u1108\u1173\u11b7 \u1100\u1175\u1109\u116e\u11a8\u1109\u1161 \u1100\u1175\u1109\u116e\u11af \u1100\u1175\u110b\u1165\u11a8 \u1100\u1175\u110b\u1165\u11b8 \u1100\u1175\u110b\u1169\u11ab \u1100\u1175\u110b\u116e\u11ab \u1100\u1175\u110b\u116f\u11ab \u1100\u1175\u110c\u1165\u11a8 \u1100\u1175\u110c\u116e\u11ab \u1100\u1175\u110e\u1175\u11b7 \u1100\u1175\u1112\u1169\u11ab \u1100\u1175\u1112\u116c\u11a8 \u1100\u1175\u11ab\u1100\u1173\u11b8 \u1100\u1175\u11ab\u110c\u1161\u11bc \u1100\u1175\u11af\u110b\u1175 \u1100\u1175\u11b7\u1107\u1161\u11b8 \u1100\u1175\u11b7\u110e\u1175 \u1100\u1175\u11b7\u1111\u1169\u1100\u1169\u11bc\u1112\u1161\u11bc \u1101\u1161\u11a8\u1103\u116e\u1100\u1175 \u1101\u1161\u11b7\u1108\u1161\u11a8 \u1101\u1162\u1103\u1161\u11af\u110b\u1173\u11b7 \u1101\u1162\u1109\u1169\u1100\u1173\u11b7 \u1101\u1165\u11b8\u110c\u1175\u11af \u1101\u1169\u11a8\u1103\u1162\u1100\u1175 \u1101\u1169\u11be\u110b\u1175\u11c1 \u1102\u1161\u1103\u1173\u11af\u110b\u1175 \u1102\u1161\u1105\u1161\u11ab\u1112\u1175 \u1102\u1161\u1106\u1165\u110c\u1175 \u1102\u1161\u1106\u116e\u11af \u1102\u1161\u110e\u1175\u11b7\u1107\u1161\u11ab \u1102\u1161\u1112\u1173\u11af \u1102\u1161\u11a8\u110b\u1167\u11b8 \u1102\u1161\u11ab\u1107\u1161\u11bc \u1102\u1161\u11af\u1100\u1162 \u1102\u1161\u11af\u110a\u1175 \u1102\u1161\u11af\u110d\u1161 \u1102\u1161\u11b7\u1102\u1167 \u1102\u1161\u11b7\u1103\u1162\u1106\u116e\u11ab \u1102\u1161\u11b7\u1106\u1162 \u1102\u1161\u11b7\u1109\u1161\u11ab \u1102\u1161\u11b7\u110c\u1161 \u1102\u1161\u11b7\u1111\u1167\u11ab \u1102\u1161\u11b7\u1112\u1161\u11a8\u1109\u1162\u11bc \u1102\u1161\u11bc\u1107\u1175 \u1102\u1161\u11c0\u1106\u1161\u11af \u1102\u1162\u1102\u1167\u11ab \u1102\u1162\u110b\u116d\u11bc \u1102\u1162\u110b\u1175\u11af \u1102\u1162\u11b7\u1107\u1175 \u1102\u1162\u11b7\u1109\u1162 \u1102\u1162\u11ba\u1106\u116e\u11af \u1102\u1162\u11bc\u1103\u1169\u11bc \u1102\u1162\u11bc\u1106\u1167\u11ab \u1102\u1162\u11bc\u1107\u1161\u11bc \u1102\u1162\u11bc\u110c\u1161\u11bc\u1100\u1169 \u1102\u1166\u11a8\u1110\u1161\u110b\u1175 \u1102\u1166\u11ba\u110d\u1162 \u1102\u1169\u1103\u1169\u11bc \u1102\u1169\u1105\u1161\u11ab\u1109\u1162\u11a8 \u1102\u1169\u1105\u1167\u11a8 \u1102\u1169\u110b\u1175\u11ab \u1102\u1169\u11a8\u110b\u1173\u11b7 \u1102\u1169\u11a8\u110e\u1161 \u1102\u1169\u11a8\u1112\u116a \u1102\u1169\u11ab\u1105\u1175 \u1102\u1169\u11ab\u1106\u116e\u11ab \u1102\u1169\u11ab\u110c\u1162\u11bc \u1102\u1169\u11af\u110b\u1175 \u1102\u1169\u11bc\u1100\u116e \u1102\u1169\u11bc\u1103\u1161\u11b7 \u1102\u1169\u11bc\u1106\u1175\u11ab \u1102\u1169\u11bc\u1107\u116e \u1102\u1169\u11bc\u110b\u1165\u11b8 \u1102\u1169\u11bc\u110c\u1161\u11bc \u1102\u1169\u11bc\u110e\u1169\u11ab \u1102\u1169\u11c1\u110b\u1175 \u1102\u116e\u11ab\u1103\u1169\u11bc\u110c\u1161 \u1102\u116e\u11ab\u1106\u116e\u11af \u1102\u116e\u11ab\u110a\u1165\u11b8 \u1102\u1172\u110b\u116d\u11a8 \u1102\u1173\u1101\u1175\u11b7 \u1102\u1173\u11a8\u1103\u1162 \u1102\u1173\u11bc\u1103\u1169\u11bc\u110c\u1165\u11a8 \u1102\u1173\u11bc\u1105\u1167\u11a8 \u1103\u1161\u1107\u1161\u11bc \u1103\u1161\u110b\u1163\u11bc\u1109\u1165\u11bc \u1103\u1161\u110b\u1173\u11b7 \u1103\u1161\u110b\u1175\u110b\u1165\u1110\u1173 \u1103\u1161\u1112\u1162\u11bc \u1103\u1161\u11ab\u1100\u1168 \u1103\u1161\u11ab\u1100\u1169\u11af \u1103\u1161\u11ab\u1103\u1169\u11a8 \u1103\u1161\u11ab\u1106\u1161\u11ba \u1103\u1161\u11ab\u1109\u116e\u11ab \u1103\u1161\u11ab\u110b\u1165 \u1103\u1161\u11ab\u110b\u1171 \u1103\u1161\u11ab\u110c\u1165\u11b7 \u1103\u1161\u11ab\u110e\u1166 \u1103\u1161\u11ab\u110e\u116e \u1103\u1161\u11ab\u1111\u1167\u11ab \u1103\u1161\u11ab\u1111\u116e\u11bc \u1103\u1161\u11af\u1100\u1163\u11af \u1103\u1161\u11af\u1105\u1165 \u1103\u1161\u11af\u1105\u1167\u11a8 \u1103\u1161\u11af\u1105\u1175 \u1103\u1161\u11b0\u1100\u1169\u1100\u1175 \u1103\u1161\u11b7\u1103\u1161\u11bc \u1103\u1161\u11b7\u1107\u1162 \u1103\u1161\u11b7\u110b\u116d \u1103\u1161\u11b7\u110b\u1175\u11b7 \u1103\u1161\u11b8\u1107\u1167\u11ab \u1103\u1161\u11b8\u110c\u1161\u11bc \u1103\u1161\u11bc\u1100\u1173\u11ab \u1103\u1161\u11bc\u1107\u116e\u11ab\u1100\u1161\u11ab \u1103\u1161\u11bc\u110b\u1167\u11ab\u1112\u1175 \u1103\u1161\u11bc\u110c\u1161\u11bc \u1103\u1162\u1100\u1172\u1106\u1169 \u1103\u1162\u1102\u1161\u11bd \u1103\u1162\u1103\u1161\u11ab\u1112\u1175 \u1103\u1162\u1103\u1161\u11b8 \u1103\u1162\u1103\u1169\u1109\u1175 \u1103\u1162\u1105\u1163\u11a8 \u1103\u1162\u1105\u1163\u11bc \u1103\u1162\u1105\u1172\u11a8 \u1103\u1162\u1106\u116e\u11ab \u1103\u1162\u1107\u116e\u1107\u116e\u11ab \u1103\u1162\u1109\u1175\u11ab \u1103\u1162\u110b\u1173\u11bc \u1103\u1162\u110c\u1161\u11bc \u1103\u1162\u110c\u1165\u11ab \u1103\u1162\u110c\u1165\u11b8 \u1103\u1162\u110c\u116e\u11bc \u1103\u1162\u110e\u1162\u11a8 \u1103\u1162\u110e\u116e\u11af \u1103\u1162\u110e\u116e\u11bc \u1103\u1162\u1110\u1169\u11bc\u1105\u1167\u11bc \u1103\u1162\u1112\u1161\u11a8 \u1103\u1162\u1112\u1161\u11ab\u1106\u1175\u11ab\u1100\u116e\u11a8 \u1103\u1162\u1112\u1161\u11b8\u1109\u1175\u11af \u1103\u1162\u1112\u1167\u11bc \u1103\u1165\u11bc\u110b\u1165\u1105\u1175 \u1103\u1166\u110b\u1175\u1110\u1173 \u1103\u1169\u1103\u1162\u110e\u1166 \u1103\u1169\u1103\u1165\u11a8 \u1103\u1169\u1103\u116e\u11a8 \u1103\u1169\u1106\u1161\u11bc \u1103\u1169\u1109\u1165\u1100\u116a\u11ab \u1103\u1169\u1109\u1175\u11b7 \u1103\u1169\u110b\u116e\u11b7 \u1103\u1169\u110b\u1175\u11b8 \u1103\u1169\u110c\u1161\u1100\u1175 \u1103\u1169\u110c\u1165\u1112\u1175 \u1103\u1169\u110c\u1165\u11ab \u1103\u1169\u110c\u116e\u11bc \u1103\u1169\u110e\u1161\u11a8 \u1103\u1169\u11a8\u1100\u1161\u11b7 \u1103\u1169\u11a8\u1105\u1175\u11b8 \u1103\u1169\u11a8\u1109\u1165 \u1103\u1169\u11a8\u110b\u1175\u11af \u1103\u1169\u11a8\u110e\u1161\u11bc\u110c\u1165\u11a8 \u1103\u1169\u11bc\u1112\u116a\u110e\u1162\u11a8 \u1103\u1171\u11ba\u1106\u1169\u1109\u1173\u11b8 \u1103\u1171\u11ba\u1109\u1161\u11ab \u1104\u1161\u11af\u110b\u1161\u110b\u1175 \u1106\u1161\u1102\u116e\u1105\u1161 \u1106\u1161\u1102\u1173\u11af \u1106\u1161\u1103\u1161\u11bc \u1106\u1161\u1105\u1161\u1110\u1169\u11ab \u1106\u1161\u1105\u1167\u11ab \u1106\u1161\u1106\u116e\u1105\u1175 \u1106\u1161\u1109\u1161\u110c\u1175 \u1106\u1161\u110b\u1163\u11a8 \u1106\u1161\u110b\u116d\u1102\u1166\u110c\u1173 \u1106\u1161\u110b\u1173\u11af \u1106\u1161\u110b\u1173\u11b7 \u1106\u1161\u110b\u1175\u110f\u1173 \u1106\u1161\u110c\u116e\u11bc \u1106\u1161\u110c\u1175\u1106\u1161\u11a8 \u1106\u1161\u110e\u1161\u11ab\u1100\u1161\u110c\u1175 \u1106\u1161\u110e\u1161\u11af \u1106\u1161\u1112\u1173\u11ab \u1106\u1161\u11a8\u1100\u1165\u11af\u1105\u1175 \u1106\u1161\u11a8\u1102\u1162 \u1106\u1161\u11a8\u1109\u1161\u11bc \u1106\u1161\u11ab\u1102\u1161\u11b7 \u1106\u1161\u11ab\u1103\u116e \u1106\u1161\u11ab\u1109\u1166 \u1106\u1161\u11ab\u110b\u1163\u11a8 \u1106\u1161\u11ab\u110b\u1175\u11af \u1106\u1161\u11ab\u110c\u1165\u11b7 \u1106\u1161\u11ab\u110c\u1169\u11a8 \u1106\u1161\u11ab\u1112\u116a \u1106\u1161\u11ad\u110b\u1175 \u1106\u1161\u11af\u1100\u1175 \u1106\u1161\u11af\u110a\u1173\u11b7 \u1106\u1161\u11af\u1110\u116e \u1106\u1161\u11b7\u1103\u1162\u1105\u1169 \u1106\u1161\u11bc\u110b\u116f\u11ab\u1100\u1167\u11bc \u1106\u1162\u1102\u1167\u11ab \u1106\u1162\u1103\u1161\u11af \u1106\u1162\u1105\u1167\u11a8 \u1106\u1162\u1107\u1165\u11ab \u1106\u1162\u1109\u1173\u110f\u1165\u11b7 \u1106\u1162\u110b\u1175\u11af \u1106\u1162\u110c\u1161\u11bc \u1106\u1162\u11a8\u110c\u116e \u1106\u1165\u11a8\u110b\u1175 \u1106\u1165\u11ab\u110c\u1165 \u1106\u1165\u11ab\u110c\u1175 \u1106\u1165\u11af\u1105\u1175 \u1106\u1166\u110b\u1175\u11af \u1106\u1167\u1102\u1173\u1105\u1175 \u1106\u1167\u110e\u1175\u11af \u1106\u1167\u11ab\u1103\u1161\u11b7 \u1106\u1167\u11af\u110e\u1175 \u1106\u1167\u11bc\u1103\u1161\u11ab \u1106\u1167\u11bc\u1105\u1167\u11bc \u1106\u1167\u11bc\u110b\u1168 \u1106\u1167\u11bc\u110b\u1174 \u1106\u1167\u11bc\u110c\u1165\u11af \u1106\u1167\u11bc\u110e\u1175\u11bc \u1106\u1167\u11bc\u1112\u1161\u11b7 \u1106\u1169\u1100\u1173\u11b7 \u1106\u1169\u1102\u1175\u1110\u1165 \u1106\u1169\u1103\u1166\u11af \u1106\u1169\u1103\u1173\u11ab \u1106\u1169\u1107\u1165\u11b7 \u1106\u1169\u1109\u1173\u11b8 \u1106\u1169\u110b\u1163\u11bc \u1106\u1169\u110b\u1175\u11b7 \u1106\u1169\u110c\u1169\u1105\u1175 \u1106\u1169\u110c\u1175\u11b8 \u1106\u1169\u1110\u116e\u11bc\u110b\u1175 \u1106\u1169\u11a8\u1100\u1165\u11af\u110b\u1175 \u1106\u1169\u11a8\u1105\u1169\u11a8 \u1106\u1169\u11a8\u1109\u1161 \u1106\u1169\u11a8\u1109\u1169\u1105\u1175 \u1106\u1169\u11a8\u1109\u116e\u11b7 \u1106\u1169\u11a8\u110c\u1165\u11a8 \u1106\u1169\u11a8\u1111\u116d \u1106\u1169\u11af\u1105\u1162 \u1106\u1169\u11b7\u1106\u1162 \u1106\u1169\u11b7\u1106\u116e\u1100\u1166 \u1106\u1169\u11b7\u1109\u1161\u11af \u1106\u1169\u11b7\u1109\u1169\u11a8 \u1106\u1169\u11b7\u110c\u1175\u11ba \u1106\u1169\u11b7\u1110\u1169\u11bc \u1106\u1169\u11b8\u1109\u1175 \u1106\u116e\u1100\u116a\u11ab\u1109\u1175\u11b7 \u1106\u116e\u1100\u116e\u11bc\u1112\u116a \u1106\u116e\u1103\u1165\u110b\u1171 \u1106\u116e\u1103\u1165\u11b7 \u1106\u116e\u1105\u1173\u11c1 \u1106\u116e\u1109\u1173\u11ab \u1106\u116e\u110b\u1165\u11ba \u1106\u116e\u110b\u1167\u11a8 \u1106\u116e\u110b\u116d\u11bc \u1106\u116e\u110c\u1169\u1100\u1165\u11ab \u1106\u116e\u110c\u1175\u1100\u1162 \u1106\u116e\u110e\u1165\u11a8 \u1106\u116e\u11ab\u1100\u116e \u1106\u116e\u11ab\u1103\u1173\u11a8 \u1106\u116e\u11ab\u1107\u1165\u11b8 \u1106\u116e\u11ab\u1109\u1165 \u1106\u116e\u11ab\u110c\u1166 \u1106\u116e\u11ab\u1112\u1161\u11a8 \u1106\u116e\u11ab\u1112\u116a \u1106\u116e\u11af\u1100\u1161 \u1106\u116e\u11af\u1100\u1165\u11ab \u1106\u116e\u11af\u1100\u1167\u11af \u1106\u116e\u11af\u1100\u1169\u1100\u1175 \u1106\u116e\u11af\u1105\u1169\u11ab \u1106\u116e\u11af\u1105\u1175\u1112\u1161\u11a8 \u1106\u116e\u11af\u110b\u1173\u11b7 \u1106\u116e\u11af\u110c\u1175\u11af \u1106\u116e\u11af\u110e\u1166 \u1106\u1175\u1100\u116e\u11a8 \u1106\u1175\u1103\u1175\u110b\u1165 \u1106\u1175\u1109\u1161\u110b\u1175\u11af \u1106\u1175\u1109\u116e\u11af \u1106\u1175\u110b\u1167\u11a8 \u1106\u1175\u110b\u116d\u11bc\u1109\u1175\u11af \u1106\u1175\u110b\u116e\u11b7 \u1106\u1175\u110b\u1175\u11ab \u1106\u1175\u1110\u1175\u11bc \u1106\u1175\u1112\u1169\u11ab \u1106\u1175\u11ab\u1100\u1161\u11ab \u1106\u1175\u11ab\u110c\u1169\u11a8 \u1106\u1175\u11ab\u110c\u116e \u1106\u1175\u11ae\u110b\u1173\u11b7 \u1106\u1175\u11af\u1100\u1161\u1105\u116e \u1106\u1175\u11af\u1105\u1175\u1106\u1175\u1110\u1165 \u1106\u1175\u11c0\u1107\u1161\u1103\u1161\u11a8 \u1107\u1161\u1100\u1161\u110c\u1175 \u1107\u1161\u1100\u116e\u1102\u1175 \u1107\u1161\u1102\u1161\u1102\u1161 \u1107\u1161\u1102\u1173\u11af \u1107\u1161\u1103\u1161\u11a8 \u1107\u1161\u1103\u1161\u11ba\u1100\u1161 \u1107\u1161\u1105\u1161\u11b7 \u1107\u1161\u110b\u1175\u1105\u1165\u1109\u1173 \u1107\u1161\u1110\u1161\u11bc \u1107\u1161\u11a8\u1106\u116e\u11af\u1100\u116a\u11ab \u1107\u1161\u11a8\u1109\u1161 \u1107\u1161\u11a8\u1109\u116e \u1107\u1161\u11ab\u1103\u1162 \u1107\u1161\u11ab\u1103\u1173\u1109\u1175 \u1107\u1161\u11ab\u1106\u1161\u11af \u1107\u1161\u11ab\u1107\u1161\u11af \u1107\u1161\u11ab\u1109\u1165\u11bc \u1107\u1161\u11ab\u110b\u1173\u11bc \u1107\u1161\u11ab\u110c\u1161\u11bc \u1107\u1161\u11ab\u110c\u116e\u11a8 \u1107\u1161\u11ab\u110c\u1175 \u1107\u1161\u11ab\u110e\u1161\u11ab \u1107\u1161\u11ae\u110e\u1175\u11b7 \u1107\u1161\u11af\u1100\u1161\u1105\u1161\u11a8 \u1107\u1161\u11af\u1100\u1165\u11af\u110b\u1173\u11b7 \u1107\u1161\u11af\u1100\u1167\u11ab \u1107\u1161\u11af\u1103\u1161\u11af \u1107\u1161\u11af\u1105\u1166 \u1107\u1161\u11af\u1106\u1169\u11a8 \u1107\u1161\u11af\u1107\u1161\u1103\u1161\u11a8 \u1107\u1161\u11af\u1109\u1162\u11bc \u1107\u1161\u11af\u110b\u1173\u11b7 \u1107\u1161\u11af\u110c\u1161\u1100\u116e\u11a8 \u1107\u1161\u11af\u110c\u1165\u11ab \u1107\u1161\u11af\u1110\u1169\u11b8 \u1107\u1161\u11af\u1111\u116d \u1107\u1161\u11b7\u1112\u1161\u1102\u1173\u11af \u1107\u1161\u11b8\u1100\u1173\u1105\u1173\u11ba \u1107\u1161\u11b8\u1106\u1161\u11ba \u1107\u1161\u11b8\u1109\u1161\u11bc \u1107\u1161\u11b8\u1109\u1169\u11c0 \u1107\u1161\u11bc\u1100\u1173\u11b7 \u1107\u1161\u11bc\u1106\u1167\u11ab \u1107\u1161\u11bc\u1106\u116e\u11ab \u1107\u1161\u11bc\u1107\u1161\u1103\u1161\u11a8 \u1107\u1161\u11bc\u1107\u1165\u11b8 \u1107\u1161\u11bc\u1109\u1169\u11bc \u1107\u1161\u11bc\u1109\u1175\u11a8 \u1107\u1161\u11bc\u110b\u1161\u11ab \u1107\u1161\u11bc\u110b\u116e\u11af \u1107\u1161\u11bc\u110c\u1175 \u1107\u1161\u11bc\u1112\u1161\u11a8 \u1107\u1161\u11bc\u1112\u1162 \u1107\u1161\u11bc\u1112\u1163\u11bc \u1107\u1162\u1100\u1167\u11bc \u1107\u1162\u1101\u1169\u11b8 \u1107\u1162\u1103\u1161\u11af \u1107\u1162\u1103\u1173\u1106\u1175\u11ab\u1110\u1165\u11ab \u1107\u1162\u11a8\u1103\u116e\u1109\u1161\u11ab \u1107\u1162\u11a8\u1109\u1162\u11a8 \u1107\u1162\u11a8\u1109\u1165\u11bc \u1107\u1162\u11a8\u110b\u1175\u11ab \u1107\u1162\u11a8\u110c\u1166 \u1107\u1162\u11a8\u1112\u116a\u110c\u1165\u11b7 \u1107\u1165\u1105\u1173\u11ba \u1107\u1165\u1109\u1165\u11ba \u1107\u1165\u1110\u1173\u11ab \u1107\u1165\u11ab\u1100\u1162 \u1107\u1165\u11ab\u110b\u1167\u11a8 \u1107\u1165\u11ab\u110c\u1175 \u1107\u1165\u11ab\u1112\u1169 \u1107\u1165\u11af\u1100\u1173\u11b7 \u1107\u1165\u11af\u1105\u1166 \u1107\u1165\u11af\u110a\u1165 \u1107\u1165\u11b7\u110b\u1171 \u1107\u1165\u11b7\u110b\u1175\u11ab \u1107\u1165\u11b7\u110c\u116c \u1107\u1165\u11b8\u1105\u1172\u11af \u1107\u1165\u11b8\u110b\u116f\u11ab \u1107\u1165\u11b8\u110c\u1165\u11a8 \u1107\u1165\u11b8\u110e\u1175\u11a8 \u1107\u1166\u110b\u1175\u110c\u1175\u11bc \u1107\u1166\u11af\u1110\u1173 \u1107\u1167\u11ab\u1100\u1167\u11bc \u1107\u1167\u11ab\u1103\u1169\u11bc \u1107\u1167\u11ab\u1106\u1167\u11bc \u1107\u1167\u11ab\u1109\u1175\u11ab \u1107\u1167\u11ab\u1112\u1169\u1109\u1161 \u1107\u1167\u11ab\u1112\u116a \u1107\u1167\u11af\u1103\u1169 \u1107\u1167\u11af\u1106\u1167\u11bc \u1107\u1167\u11af\u110b\u1175\u11af \u1107\u1167\u11bc\u1109\u1175\u11af \u1107\u1167\u11bc\u110b\u1161\u1105\u1175 \u1107\u1167\u11bc\u110b\u116f\u11ab \u1107\u1169\u1100\u116a\u11ab \u1107\u1169\u1102\u1165\u1109\u1173 \u1107\u1169\u1105\u1161\u1109\u1162\u11a8 \u1107\u1169\u1105\u1161\u11b7 \u1107\u1169\u1105\u1173\u11b7 \u1107\u1169\u1109\u1161\u11bc \u1107\u1169\u110b\u1161\u11ab \u1107\u1169\u110c\u1161\u1100\u1175 \u1107\u1169\u110c\u1161\u11bc \u1107\u1169\u110c\u1165\u11ab \u1107\u1169\u110c\u1169\u11ab \u1107\u1169\u1110\u1169\u11bc \u1107\u1169\u1111\u1167\u11ab\u110c\u1165\u11a8 \u1107\u1169\u1112\u1165\u11b7 \u1107\u1169\u11a8\u1103\u1169 \u1107\u1169\u11a8\u1109\u1161 \u1107\u1169\u11a8\u1109\u116e\u11bc\u110b\u1161 \u1107\u1169\u11a8\u1109\u1173\u11b8 \u1107\u1169\u11a9\u110b\u1173\u11b7 \u1107\u1169\u11ab\u1100\u1167\u11a8\u110c\u1165\u11a8 \u1107\u1169\u11ab\u1105\u1162 \u1107\u1169\u11ab\u1107\u116e \u1107\u1169\u11ab\u1109\u1161 \u1107\u1169\u11ab\u1109\u1165\u11bc \u1107\u1169\u11ab\u110b\u1175\u11ab \u1107\u1169\u11ab\u110c\u1175\u11af \u1107\u1169\u11af\u1111\u1166\u11ab \u1107\u1169\u11bc\u1109\u1161 \u1107\u1169\u11bc\u110c\u1175 \u1107\u1169\u11bc\u1110\u116e \u1107\u116e\u1100\u1173\u11ab \u1107\u116e\u1101\u1173\u1105\u1165\u110b\u116e\u11b7 \u1107\u116e\u1103\u1161\u11b7 \u1107\u116e\u1103\u1169\u11bc\u1109\u1161\u11ab \u1107\u116e\u1106\u116e\u11ab \u1107\u116e\u1107\u116e\u11ab \u1107\u116e\u1109\u1161\u11ab \u1107\u116e\u1109\u1161\u11bc \u1107\u116e\u110b\u1165\u11bf \u1107\u116e\u110b\u1175\u11ab \u1107\u116e\u110c\u1161\u11a8\u110b\u116d\u11bc \u1107\u116e\u110c\u1161\u11bc \u1107\u116e\u110c\u1165\u11bc \u1107\u116e\u110c\u1169\u11a8 \u1107\u116e\u110c\u1175\u1105\u1165\u11ab\u1112\u1175 \u1107\u116e\u110e\u1175\u11ab \u1107\u116e\u1110\u1161\u11a8 \u1107\u116e\u1111\u116e\u11b7 \u1107\u116e\u1112\u116c\u110c\u1161\u11bc \u1107\u116e\u11a8\u1107\u116e \u1107\u116e\u11a8\u1112\u1161\u11ab \u1107\u116e\u11ab\u1102\u1169 \u1107\u116e\u11ab\u1105\u1163\u11bc \u1107\u116e\u11ab\u1105\u1175 \u1107\u116e\u11ab\u1106\u1167\u11bc \u1107\u116e\u11ab\u1109\u1165\u11a8 \u1107\u116e\u11ab\u110b\u1163 \u1107\u116e\u11ab\u110b\u1171\u1100\u1175 \u1107\u116e\u11ab\u1111\u1175\u11af \u1107\u116e\u11ab\u1112\u1169\u11bc\u1109\u1162\u11a8 \u1107\u116e\u11af\u1100\u1169\u1100\u1175 \u1107\u116e\u11af\u1100\u116a \u1107\u116e\u11af\u1100\u116d \u1107\u116e\u11af\u1101\u1169\u11be \u1107\u116e\u11af\u1106\u1161\u11ab \u1107\u116e\u11af\u1107\u1165\u11b8 \u1107\u116e\u11af\u1107\u1175\u11be \u1107\u116e\u11af\u110b\u1161\u11ab \u1107\u116e\u11af\u110b\u1175\u110b\u1175\u11a8 \u1107\u116e\u11af\u1112\u1162\u11bc \u1107\u1173\u1105\u1162\u11ab\u1103\u1173 \u1107\u1175\u1100\u1173\u11a8 \u1107\u1175\u1102\u1161\u11ab \u1107\u1175\u1102\u1175\u11af \u1107\u1175\u1103\u116e\u11af\u1100\u1175 \u1107\u1175\u1103\u1175\u110b\u1169 \u1107\u1175\u1105\u1169\u1109\u1169 \u1107\u1175\u1106\u1161\u11ab \u1107\u1175\u1106\u1167\u11bc \u1107\u1175\u1106\u1175\u11af \u1107\u1175\u1107\u1161\u1105\u1161\u11b7 \u1107\u1175\u1107\u1175\u11b7\u1107\u1161\u11b8 \u1107\u1175\u1109\u1161\u11bc \u1107\u1175\u110b\u116d\u11bc \u1107\u1175\u110b\u1172\u11af \u1107\u1175\u110c\u116e\u11bc \u1107\u1175\u1110\u1161\u1106\u1175\u11ab \u1107\u1175\u1111\u1161\u11ab \u1107\u1175\u11af\u1103\u1175\u11bc \u1107\u1175\u11ba\u1106\u116e\u11af \u1107\u1175\u11ba\u1107\u1161\u11bc\u110b\u116e\u11af \u1107\u1175\u11ba\u110c\u116e\u11af\u1100\u1175 \u1107\u1175\u11be\u1101\u1161\u11af \u1108\u1161\u11af\u1100\u1161\u11ab\u1109\u1162\u11a8 \u1108\u1161\u11af\u1105\u1162 \u1108\u1161\u11af\u1105\u1175 \u1109\u1161\u1100\u1165\u11ab \u1109\u1161\u1100\u1168\u110c\u1165\u11af \u1109\u1161\u1102\u1161\u110b\u1175 \u1109\u1161\u1102\u1163\u11bc \u1109\u1161\u1105\u1161\u11b7 \u1109\u1161\u1105\u1161\u11bc \u1109\u1161\u1105\u1175\u11b8 \u1109\u1161\u1106\u1169\u1102\u1175\u11b7 \u1109\u1161\u1106\u116e\u11af \u1109\u1161\u1107\u1161\u11bc \u1109\u1161\u1109\u1161\u11bc \u1109\u1161\u1109\u1162\u11bc\u1112\u116a\u11af \u1109\u1161\u1109\u1165\u11af \u1109\u1161\u1109\u1173\u11b7 \u1109\u1161\u1109\u1175\u11af \u1109\u1161\u110b\u1165\u11b8 \u1109\u1161\u110b\u116d\u11bc \u1109\u1161\u110b\u116f\u11af \u1109\u1161\u110c\u1161\u11bc \u1109\u1161\u110c\u1165\u11ab \u1109\u1161\u110c\u1175\u11ab \u1109\u1161\u110e\u1169\u11ab \u1109\u1161\u110e\u116e\u11ab\u1100\u1175 \u1109\u1161\u1110\u1161\u11bc \u1109\u1161\u1110\u116e\u1105\u1175 \u1109\u1161\u1112\u1173\u11af \u1109\u1161\u11ab\u1100\u1175\u11af \u1109\u1161\u11ab\u1107\u116e\u110b\u1175\u11ab\u1100\u116a \u1109\u1161\u11ab\u110b\u1165\u11b8 \u1109\u1161\u11ab\u110e\u1162\u11a8 \u1109\u1161\u11af\u1105\u1175\u11b7 \u1109\u1161\u11af\u110b\u1175\u11ab \u1109\u1161\u11af\u110d\u1161\u11a8 \u1109\u1161\u11b7\u1100\u1168\u1110\u1161\u11bc \u1109\u1161\u11b7\u1100\u116e\u11a8 \u1109\u1161\u11b7\u1109\u1175\u11b8 \u1109\u1161\u11b7\u110b\u116f\u11af \u1109\u1161\u11b7\u110e\u1169\u11ab \u1109\u1161\u11bc\u1100\u116a\u11ab \u1109\u1161\u11bc\u1100\u1173\u11b7 \u1109\u1161\u11bc\u1103\u1162 \u1109\u1161\u11bc\u1105\u1172 \u1109\u1161\u11bc\u1107\u1161\u11ab\u1100\u1175 \u1109\u1161\u11bc\u1109\u1161\u11bc \u1109\u1161\u11bc\u1109\u1175\u11a8 \u1109\u1161\u11bc\u110b\u1165\u11b8 \u1109\u1161\u11bc\u110b\u1175\u11ab \u1109\u1161\u11bc\u110c\u1161 \u1109\u1161\u11bc\u110c\u1165\u11b7 \u1109\u1161\u11bc\u110e\u1165 \u1109\u1161\u11bc\u110e\u116e \u1109\u1161\u11bc\u1110\u1162 \u1109\u1161\u11bc\u1111\u116d \u1109\u1161\u11bc\u1111\u116e\u11b7 \u1109\u1161\u11bc\u1112\u116a\u11bc \u1109\u1162\u1107\u1167\u11a8 \u1109\u1162\u11a8\u1101\u1161\u11af \u1109\u1162\u11a8\u110b\u1167\u11ab\u1111\u1175\u11af \u1109\u1162\u11bc\u1100\u1161\u11a8 \u1109\u1162\u11bc\u1106\u1167\u11bc \u1109\u1162\u11bc\u1106\u116e\u11af \u1109\u1162\u11bc\u1107\u1161\u11bc\u1109\u1169\u11bc \u1109\u1162\u11bc\u1109\u1161\u11ab \u1109\u1162\u11bc\u1109\u1165\u11ab \u1109\u1162\u11bc\u1109\u1175\u11ab \u1109\u1162\u11bc\u110b\u1175\u11af \u1109\u1162\u11bc\u1112\u116a\u11af \u1109\u1165\u1105\u1161\u11b8 \u1109\u1165\u1105\u1173\u11ab \u1109\u1165\u1106\u1167\u11bc \u1109\u1165\u1106\u1175\u11ab \u1109\u1165\u1107\u1175\u1109\u1173 \u1109\u1165\u110b\u1163\u11bc \u1109\u1165\u110b\u116e\u11af \u1109\u1165\u110c\u1165\u11a8 \u1109\u1165\u110c\u1165\u11b7 \u1109\u1165\u110d\u1169\u11a8 \u1109\u1165\u110f\u1173\u11af \u1109\u1165\u11a8\u1109\u1161 \u1109\u1165\u11a8\u110b\u1172 \u1109\u1165\u11ab\u1100\u1165 \u1109\u1165\u11ab\u1106\u116e\u11af \u1109\u1165\u11ab\u1107\u1162 \u1109\u1165\u11ab\u1109\u1162\u11bc \u1109\u1165\u11ab\u1109\u116e \u1109\u1165\u11ab\u110b\u116f\u11ab \u1109\u1165\u11ab\u110c\u1161\u11bc \u1109\u1165\u11ab\u110c\u1165\u11ab \u1109\u1165\u11ab\u1110\u1162\u11a8 \u1109\u1165\u11ab\u1111\u116e\u11bc\u1100\u1175 \u1109\u1165\u11af\u1100\u1165\u110c\u1175 \u1109\u1165\u11af\u1102\u1161\u11af \u1109\u1165\u11af\u1105\u1165\u11bc\u1110\u1161\u11bc \u1109\u1165\u11af\u1106\u1167\u11bc \u1109\u1165\u11af\u1106\u116e\u11ab \u1109\u1165\u11af\u1109\u1161 \u1109\u1165\u11af\u110b\u1161\u11a8\u1109\u1161\u11ab \u1109\u1165\u11af\u110e\u1175 \u1109\u1165\u11af\u1110\u1161\u11bc \u1109\u1165\u11b8\u110a\u1175 \u1109\u1165\u11bc\u1100\u1169\u11bc \u1109\u1165\u11bc\u1103\u1161\u11bc \u1109\u1165\u11bc\u1106\u1167\u11bc \u1109\u1165\u11bc\u1107\u1167\u11af \u1109\u1165\u11bc\u110b\u1175\u11ab \u1109\u1165\u11bc\u110c\u1161\u11bc \u1109\u1165\u11bc\u110c\u1165\u11a8 \u1109\u1165\u11bc\u110c\u1175\u11af \u1109\u1165\u11bc\u1112\u1161\u11b7 \u1109\u1166\u1100\u1173\u11b7 \u1109\u1166\u1106\u1175\u1102\u1161 \u1109\u1166\u1109\u1161\u11bc \u1109\u1166\u110b\u116f\u11af \u1109\u1166\u110c\u1169\u11bc\u1103\u1162\u110b\u116a\u11bc \u1109\u1166\u1110\u1161\u11a8 \u1109\u1166\u11ab\u1110\u1165 \u1109\u1166\u11ab\u1110\u1175\u1106\u1175\u1110\u1165 \u1109\u1166\u11ba\u110d\u1162 \u1109\u1169\u1100\u1172\u1106\u1169 \u1109\u1169\u1100\u1173\u11a8\u110c\u1165\u11a8 \u1109\u1169\u1100\u1173\u11b7 \u1109\u1169\u1102\u1161\u1100\u1175 \u1109\u1169\u1102\u1167\u11ab \u1109\u1169\u1103\u1173\u11a8 \u1109\u1169\u1106\u1161\u11bc \u1109\u1169\u1106\u116e\u11ab \u1109\u1169\u1109\u1165\u11af \u1109\u1169\u1109\u1169\u11a8 \u1109\u1169\u110b\u1161\u1100\u116a \u1109\u1169\u110b\u116d\u11bc \u1109\u1169\u110b\u116f\u11ab \u1109\u1169\u110b\u1173\u11b7 \u1109\u1169\u110c\u116e\u11bc\u1112\u1175 \u1109\u1169\u110c\u1175\u1111\u116e\u11b7 \u1109\u1169\u110c\u1175\u11af \u1109\u1169\u1111\u116e\u11bc \u1109\u1169\u1112\u1167\u11bc \u1109\u1169\u11a8\u1103\u1161\u11b7 \u1109\u1169\u11a8\u1103\u1169 \u1109\u1169\u11a8\u110b\u1169\u11ba \u1109\u1169\u11ab\u1100\u1161\u1105\u1161\u11a8 \u1109\u1169\u11ab\u1100\u1175\u11af \u1109\u1169\u11ab\u1102\u1167 \u1109\u1169\u11ab\u1102\u1175\u11b7 \u1109\u1169\u11ab\u1103\u1173\u11bc \u1109\u1169\u11ab\u1106\u1169\u11a8 \u1109\u1169\u11ab\u1108\u1167\u11a8 \u1109\u1169\u11ab\u1109\u1175\u11af \u1109\u1169\u11ab\u110c\u1175\u11af \u1109\u1169\u11ab\u1110\u1169\u11b8 \u1109\u1169\u11ab\u1112\u1162 \u1109\u1169\u11af\u110c\u1175\u11a8\u1112\u1175 \u1109\u1169\u11b7\u110a\u1175 \u1109\u1169\u11bc\u110b\u1161\u110c\u1175 \u1109\u1169\u11bc\u110b\u1175 \u1109\u1169\u11bc\u1111\u1167\u11ab \u1109\u116c\u1100\u1169\u1100\u1175 \u1109\u116d\u1111\u1175\u11bc \u1109\u116e\u1100\u1165\u11ab \u1109\u116e\u1102\u1167\u11ab \u1109\u116e\u1103\u1161\u11ab \u1109\u116e\u1103\u1169\u11ba\u1106\u116e\u11af \u1109\u116e\u1103\u1169\u11bc\u110c\u1165\u11a8 \u1109\u116e\u1106\u1167\u11ab \u1109\u116e\u1106\u1167\u11bc \u1109\u116e\u1107\u1161\u11a8 \u1109\u116e\u1109\u1161\u11bc \u1109\u116e\u1109\u1165\u11a8 \u1109\u116e\u1109\u116e\u11af \u1109\u116e\u1109\u1175\u1105\u1169 \u1109\u116e\u110b\u1165\u11b8 \u1109\u116e\u110b\u1167\u11b7 \u1109\u116e\u110b\u1167\u11bc \u1109\u116e\u110b\u1175\u11b8 \u1109\u116e\u110c\u116e\u11ab \u1109\u116e\u110c\u1175\u11b8 \u1109\u116e\u110e\u116e\u11af \u1109\u116e\u110f\u1165\u11ba \u1109\u116e\u1111\u1175\u11af \u1109\u116e\u1112\u1161\u11a8 \u1109\u116e\u1112\u1165\u11b7\u1109\u1162\u11bc \u1109\u116e\u1112\u116a\u1100\u1175 \u1109\u116e\u11a8\u1102\u1167 \u1109\u116e\u11a8\u1109\u1169 \u1109\u116e\u11a8\u110c\u1166 \u1109\u116e\u11ab\u1100\u1161\u11ab \u1109\u116e\u11ab\u1109\u1165 \u1109\u116e\u11ab\u1109\u116e \u1109\u116e\u11ab\u1109\u1175\u11a8\u1100\u1161\u11ab \u1109\u116e\u11ab\u110b\u1171 \u1109\u116e\u11ae\u1100\u1161\u1105\u1161\u11a8 \u1109\u116e\u11af\u1107\u1167\u11bc \u1109\u116e\u11af\u110c\u1175\u11b8 \u1109\u116e\u11ba\u110c\u1161 \u1109\u1173\u1102\u1175\u11b7 \u1109\u1173\u1106\u116e\u11af \u1109\u1173\u1109\u1173\u1105\u1169 \u1109\u1173\u1109\u1173\u11bc \u1109\u1173\u110b\u1170\u1110\u1165 \u1109\u1173\u110b\u1171\u110e\u1175 \u1109\u1173\u110f\u1166\u110b\u1175\u1110\u1173 \u1109\u1173\u1110\u1172\u1103\u1175\u110b\u1169 \u1109\u1173\u1110\u1173\u1105\u1166\u1109\u1173 \u1109\u1173\u1111\u1169\u110e\u1173 \u1109\u1173\u11af\u110d\u1165\u11a8 \u1109\u1173\u11af\u1111\u1173\u11b7 \u1109\u1173\u11b8\u1100\u116a\u11ab \u1109\u1173\u11b8\u1100\u1175 \u1109\u1173\u11bc\u1100\u1162\u11a8 \u1109\u1173\u11bc\u1105\u1175 \u1109\u1173\u11bc\u1107\u116e \u1109\u1173\u11bc\u110b\u116d\u11bc\u110e\u1161 \u1109\u1173\u11bc\u110c\u1175\u11ab \u1109\u1175\u1100\u1161\u11a8 \u1109\u1175\u1100\u1161\u11ab \u1109\u1175\u1100\u1169\u11af \u1109\u1175\u1100\u1173\u11b7\u110e\u1175 \u1109\u1175\u1102\u1161\u1105\u1175\u110b\u1169 \u1109\u1175\u1103\u1162\u11a8 \u1109\u1175\u1105\u1175\u110c\u1173 \u1109\u1175\u1106\u1166\u11ab\u1110\u1173 \u1109\u1175\u1106\u1175\u11ab \u1109\u1175\u1107\u116e\u1106\u1169 \u1109\u1175\u1109\u1165\u11ab \u1109\u1175\u1109\u1165\u11af \u1109\u1175\u1109\u1173\u1110\u1166\u11b7 \u1109\u1175\u110b\u1161\u1107\u1165\u110c\u1175 \u1109\u1175\u110b\u1165\u1106\u1165\u1102\u1175 \u1109\u1175\u110b\u116f\u11af \u1109\u1175\u110b\u1175\u11ab \u1109\u1175\u110b\u1175\u11af \u1109\u1175\u110c\u1161\u11a8 \u1109\u1175\u110c\u1161\u11bc \u1109\u1175\u110c\u1165\u11af \u1109\u1175\u110c\u1165\u11b7 \u1109\u1175\u110c\u116e\u11bc \u1109\u1175\u110c\u1173\u11ab \u1109\u1175\u110c\u1175\u11b8 \u1109\u1175\u110e\u1165\u11bc \u1109\u1175\u1112\u1161\u11b8 \u1109\u1175\u1112\u1165\u11b7 \u1109\u1175\u11a8\u1100\u116e \u1109\u1175\u11a8\u1100\u1175 \u1109\u1175\u11a8\u1103\u1161\u11bc \u1109\u1175\u11a8\u1105\u1163\u11bc \u1109\u1175\u11a8\u1105\u116d\u1111\u116e\u11b7 \u1109\u1175\u11a8\u1106\u116e\u11af \u1109\u1175\u11a8\u1108\u1161\u11bc \u1109\u1175\u11a8\u1109\u1161 \u1109\u1175\u11a8\u1109\u1162\u11bc\u1112\u116a\u11af \u1109\u1175\u11a8\u110e\u1169 \u1109\u1175\u11a8\u1110\u1161\u11a8 \u1109\u1175\u11a8\u1111\u116e\u11b7 \u1109\u1175\u11ab\u1100\u1169 \u1109\u1175\u11ab\u1100\u1172 \u1109\u1175\u11ab\u1102\u1167\u11b7 \u1109\u1175\u11ab\u1106\u116e\u11ab \u1109\u1175\u11ab\u1107\u1161\u11af \u1109\u1175\u11ab\u1107\u1175 \u1109\u1175\u11ab\u1109\u1161 \u1109\u1175\u11ab\u1109\u1166 \u1109\u1175\u11ab\u110b\u116d\u11bc \u1109\u1175\u11ab\u110c\u1166\u1111\u116e\u11b7 \u1109\u1175\u11ab\u110e\u1165\u11bc \u1109\u1175\u11ab\u110e\u1166 \u1109\u1175\u11ab\u1112\u116a \u1109\u1175\u11af\u1100\u1161\u11b7 \u1109\u1175\u11af\u1102\u1162 \u1109\u1175\u11af\u1105\u1167\u11a8 \u1109\u1175\u11af\u1105\u1168 \u1109\u1175\u11af\u1106\u1161\u11bc \u1109\u1175\u11af\u1109\u116e \u1109\u1175\u11af\u1109\u1173\u11b8 \u1109\u1175\u11af\u1109\u1175 \u1109\u1175\u11af\u110c\u1161\u11bc \u1109\u1175\u11af\u110c\u1165\u11bc \u1109\u1175\u11af\u110c\u1175\u11af\u110c\u1165\u11a8 \u1109\u1175\u11af\u110e\u1165\u11ab \u1109\u1175\u11af\u110e\u1166 \u1109\u1175\u11af\u110f\u1165\u11ba \u1109\u1175\u11af\u1110\u1162 \u1109\u1175\u11af\u1111\u1162 \u1109\u1175\u11af\u1112\u1165\u11b7 \u1109\u1175\u11af\u1112\u1167\u11ab \u1109\u1175\u11b7\u1105\u1175 \u1109\u1175\u11b7\u1107\u116e\u1105\u1173\u11b7 \u1109\u1175\u11b7\u1109\u1161 \u1109\u1175\u11b7\u110c\u1161\u11bc \u1109\u1175\u11b7\u110c\u1165\u11bc \u1109\u1175\u11b7\u1111\u1161\u11ab \u110a\u1161\u11bc\u1103\u116e\u11bc\u110b\u1175 \u110a\u1175\u1105\u1173\u11b7 \u110a\u1175\u110b\u1161\u11ba \u110b\u1161\u1100\u1161\u110a\u1175 \u110b\u1161\u1102\u1161\u110b\u116e\u11ab\u1109\u1165 \u110b\u1161\u1103\u1173\u1102\u1175\u11b7 \u110b\u1161\u1103\u1173\u11af \u110b\u1161\u1109\u1171\u110b\u116e\u11b7 \u110b\u1161\u1109\u1173\u1111\u1161\u11af\u1110\u1173 \u110b\u1161\u1109\u1175\u110b\u1161 \u110b\u1161\u110b\u116e\u11af\u1105\u1165 \u110b\u1161\u110c\u1165\u110a\u1175 \u110b\u1161\u110c\u116e\u11b7\u1106\u1161 \u110b\u1161\u110c\u1175\u11a8 \u110b\u1161\u110e\u1175\u11b7 \u110b\u1161\u1111\u1161\u1110\u1173 \u110b\u1161\u1111\u1173\u1105\u1175\u110f\u1161 \u110b\u1161\u1111\u1173\u11b7 \u110b\u1161\u1112\u1169\u11b8 \u110b\u1161\u1112\u1173\u11ab \u110b\u1161\u11a8\u1100\u1175 \u110b\u1161\u11a8\u1106\u1169\u11bc \u110b\u1161\u11a8\u1109\u116e \u110b\u1161\u11ab\u1100\u1162 \u110b\u1161\u11ab\u1100\u1167\u11bc \u110b\u1161\u11ab\u1100\u116a \u110b\u1161\u11ab\u1102\u1162 \u110b\u1161\u11ab\u1102\u1167\u11bc \u110b\u1161\u11ab\u1103\u1169\u11bc \u110b\u1161\u11ab\u1107\u1161\u11bc \u110b\u1161\u11ab\u1107\u116e \u110b\u1161\u11ab\u110c\u116e \u110b\u1161\u11af\u1105\u116e\u1106\u1175\u1102\u1172\u11b7 \u110b\u1161\u11af\u110f\u1169\u110b\u1169\u11af \u110b\u1161\u11b7\u1109\u1175 \u110b\u1161\u11b7\u110f\u1165\u11ba \u110b\u1161\u11b8\u1105\u1167\u11a8 \u110b\u1161\u11c1\u1102\u1161\u11af \u110b\u1161\u11c1\u1106\u116e\u11ab \u110b\u1162\u110b\u1175\u11ab \u110b\u1162\u110c\u1165\u11bc \u110b\u1162\u11a8\u1109\u116e \u110b\u1162\u11af\u1107\u1165\u11b7 \u110b\u1163\u1100\u1161\u11ab \u110b\u1163\u1103\u1161\u11ab \u110b\u1163\u110b\u1169\u11bc \u110b\u1163\u11a8\u1100\u1161\u11ab \u110b\u1163\u11a8\u1100\u116e\u11a8 \u110b\u1163\u11a8\u1109\u1169\u11a8 \u110b\u1163\u11a8\u1109\u116e \u110b\u1163\u11a8\u110c\u1165\u11b7 \u110b\u1163\u11a8\u1111\u116e\u11b7 \u110b\u1163\u11a8\u1112\u1169\u11ab\u1102\u1167 \u110b\u1163\u11bc\u1102\u1167\u11b7 \u110b\u1163\u11bc\u1105\u1167\u11a8 \u110b\u1163\u11bc\u1106\u1161\u11af \u110b\u1163\u11bc\u1107\u1162\u110e\u116e \u110b\u1163\u11bc\u110c\u116e \u110b\u1163\u11bc\u1111\u1161 \u110b\u1165\u1103\u116e\u11b7 \u110b\u1165\u1105\u1167\u110b\u116e\u11b7 \u110b\u1165\u1105\u1173\u11ab \u110b\u1165\u110c\u1166\u11ba\u1107\u1161\u11b7 \u110b\u1165\u110d\u1162\u11bb\u1103\u1173\u11ab \u110b\u1165\u110d\u1165\u1103\u1161\u1100\u1161 \u110b\u1165\u110d\u1165\u11ab\u110c\u1175 \u110b\u1165\u11ab\u1102\u1175 \u110b\u1165\u11ab\u1103\u1165\u11a8 \u110b\u1165\u11ab\u1105\u1169\u11ab \u110b\u1165\u11ab\u110b\u1165 \u110b\u1165\u11af\u1100\u116e\u11af \u110b\u1165\u11af\u1105\u1173\u11ab \u110b\u1165\u11af\u110b\u1173\u11b7 \u110b\u1165\u11af\u1111\u1175\u11ba \u110b\u1165\u11b7\u1106\u1161 \u110b\u1165\u11b8\u1106\u116e \u110b\u1165\u11b8\u110c\u1169\u11bc \u110b\u1165\u11b8\u110e\u1166 \u110b\u1165\u11bc\u1103\u1165\u11bc\u110b\u1175 \u110b\u1165\u11bc\u1106\u1161\u11bc \u110b\u1165\u11bc\u1110\u1165\u1105\u1175 \u110b\u1165\u11bd\u1100\u1173\u110c\u1166 \u110b\u1166\u1102\u1165\u110c\u1175 \u110b\u1166\u110b\u1165\u110f\u1165\u11ab \u110b\u1166\u11ab\u110c\u1175\u11ab \u110b\u1167\u1100\u1165\u11ab \u110b\u1167\u1100\u1169\u1109\u1162\u11bc \u110b\u1167\u1100\u116a\u11ab \u110b\u1167\u1100\u116e\u11ab \u110b\u1167\u1100\u116f\u11ab \u110b\u1167\u1103\u1162\u1109\u1162\u11bc \u110b\u1167\u1103\u1165\u11b2 \u110b\u1167\u1103\u1169\u11bc\u1109\u1162\u11bc \u110b\u1167\u1103\u1173\u11ab \u110b\u1167\u1105\u1169\u11ab \u110b\u1167\u1105\u1173\u11b7 \u110b\u1167\u1109\u1165\u11ba \u110b\u1167\u1109\u1165\u11bc \u110b\u1167\u110b\u116a\u11bc \u110b\u1167\u110b\u1175\u11ab \u110b\u1167\u110c\u1165\u11ab\u1112\u1175 \u110b\u1167\u110c\u1175\u11a8\u110b\u116f\u11ab \u110b\u1167\u1112\u1161\u11a8\u1109\u1162\u11bc \u110b\u1167\u1112\u1162\u11bc \u110b\u1167\u11a8\u1109\u1161 \u110b\u1167\u11a8\u1109\u1175 \u110b\u1167\u11a8\u1112\u1161\u11af \u110b\u1167\u11ab\u1100\u1167\u11af \u110b\u1167\u11ab\u1100\u116e \u110b\u1167\u11ab\u1100\u1173\u11a8 \u110b\u1167\u11ab\u1100\u1175 \u110b\u1167\u11ab\u1105\u1161\u11a8 \u110b\u1167\u11ab\u1109\u1165\u11af \u110b\u1167\u11ab\u1109\u1166 \u110b\u1167\u11ab\u1109\u1169\u11a8 \u110b\u1167\u11ab\u1109\u1173\u11b8 \u110b\u1167\u11ab\u110b\u1162 \u110b\u1167\u11ab\u110b\u1168\u110b\u1175\u11ab \u110b\u1167\u11ab\u110b\u1175\u11ab \u110b\u1167\u11ab\u110c\u1161\u11bc \u110b\u1167\u11ab\u110c\u116e \u110b\u1167\u11ab\u110e\u116e\u11af \u110b\u1167\u11ab\u1111\u1175\u11af \u110b\u1167\u11ab\u1112\u1161\u11b8 \u110b\u1167\u11ab\u1112\u1172 \u110b\u1167\u11af\u1100\u1175 \u110b\u1167\u11af\u1106\u1162 \u110b\u1167\u11af\u1109\u116c \u110b\u1167\u11af\u1109\u1175\u11b7\u1112\u1175 \u110b\u1167\u11af\u110c\u1165\u11bc \u110b\u1167\u11af\u110e\u1161 \u110b\u1167\u11af\u1112\u1173\u11af \u110b\u1167\u11b7\u1105\u1167 \u110b\u1167\u11b8\u1109\u1165 \u110b\u1167\u11bc\u1100\u116e\u11a8 \u110b\u1167\u11bc\u1102\u1161\u11b7 \u110b\u1167\u11bc\u1109\u1161\u11bc \u110b\u1167\u11bc\u110b\u1163\u11bc \u110b\u1167\u11bc\u110b\u1167\u11a8 \u110b\u1167\u11bc\u110b\u116e\u11bc \u110b\u1167\u11bc\u110b\u116f\u11ab\u1112\u1175 \u110b\u1167\u11bc\u1112\u1161 \u110b\u1167\u11bc\u1112\u1163\u11bc \u110b\u1167\u11bc\u1112\u1169\u11ab \u110b\u1167\u11bc\u1112\u116a \u110b\u1167\u11c1\u1100\u116e\u1105\u1175 \u110b\u1167\u11c1\u1107\u1161\u11bc \u110b\u1167\u11c1\u110c\u1175\u11b8 \u110b\u1168\u1100\u1161\u11b7 \u110b\u1168\u1100\u1173\u11b7 \u110b\u1168\u1107\u1161\u11bc \u110b\u1168\u1109\u1161\u11ab \u110b\u1168\u1109\u1161\u11bc \u110b\u1168\u1109\u1165\u11ab \u110b\u1168\u1109\u116e\u11af \u110b\u1168\u1109\u1173\u11b8 \u110b\u1168\u1109\u1175\u11a8\u110c\u1161\u11bc \u110b\u1168\u110b\u1163\u11a8 \u110b\u1168\u110c\u1165\u11ab \u110b\u1168\u110c\u1165\u11af \u110b\u1168\u110c\u1165\u11bc \u110b\u1168\u110f\u1165\u11ab\u1103\u1162 \u110b\u1168\u11ba\u1102\u1161\u11af \u110b\u1169\u1102\u1173\u11af \u110b\u1169\u1105\u1161\u11a8 \u110b\u1169\u1105\u1162\u11ba\u1103\u1169\u11bc\u110b\u1161\u11ab \u110b\u1169\u1105\u1166\u11ab\u110c\u1175 \u110b\u1169\u1105\u1169\u110c\u1175 \u110b\u1169\u1105\u1173\u11ab\u1107\u1161\u11af \u110b\u1169\u1107\u1173\u11ab \u110b\u1169\u1109\u1175\u11b8 \u110b\u1169\u110b\u1167\u11b7 \u110b\u1169\u110b\u116f\u11af \u110b\u1169\u110c\u1165\u11ab \u110b\u1169\u110c\u1175\u11a8 \u110b\u1169\u110c\u1175\u11bc\u110b\u1165 \u110b\u1169\u1111\u1166\u1105\u1161 \u110b\u1169\u1111\u1175\u1109\u1173\u1110\u1166\u11af \u110b\u1169\u1112\u1175\u1105\u1167 \u110b\u1169\u11a8\u1109\u1161\u11bc \u110b\u1169\u11a8\u1109\u116e\u1109\u116e \u110b\u1169\u11ab\u1100\u1161\u11bd \u110b\u1169\u11ab\u1105\u1161\u110b\u1175\u11ab \u110b\u1169\u11ab\u1106\u1169\u11b7 \u110b\u1169\u11ab\u110c\u1169\u11bc\u110b\u1175\u11af \u110b\u1169\u11ab\u1110\u1169\u11bc \u110b\u1169\u11af\u1100\u1161\u110b\u1173\u11af \u110b\u1169\u11af\u1105\u1175\u11b7\u1111\u1175\u11a8 \u110b\u1169\u11af\u1112\u1162 \u110b\u1169\u11ba\u110e\u1161\u1105\u1175\u11b7 \u110b\u116a\u110b\u1175\u1109\u1167\u110e\u1173 \u110b\u116a\u110b\u1175\u11ab \u110b\u116a\u11ab\u1109\u1165\u11bc \u110b\u116a\u11ab\u110c\u1165\u11ab \u110b\u116a\u11bc\u1107\u1175 \u110b\u116a\u11bc\u110c\u1161 \u110b\u116b\u1102\u1163\u1112\u1161\u1106\u1167\u11ab \u110b\u116b\u11ab\u110c\u1175 \u110b\u116c\u1100\u1161\u11ba\u110c\u1175\u11b8 \u110b\u116c\u1100\u116e\u11a8 \u110b\u116c\u1105\u1169\u110b\u116e\u11b7 \u110b\u116c\u1109\u1161\u11b7\u110e\u1169\u11ab \u110b\u116c\u110e\u116e\u11af \u110b\u116c\u110e\u1175\u11b7 \u110b\u116c\u1112\u1161\u11af\u1106\u1165\u1102\u1175 \u110b\u116c\u11ab\u1107\u1161\u11af \u110b\u116c\u11ab\u1109\u1169\u11ab \u110b\u116c\u11ab\u110d\u1169\u11a8 \u110b\u116d\u1100\u1173\u11b7 \u110b\u116d\u110b\u1175\u11af \u110b\u116d\u110c\u1173\u11b7 \u110b\u116d\u110e\u1165\u11bc \u110b\u116d\u11bc\u1100\u1175 \u110b\u116d\u11bc\u1109\u1165 \u110b\u116d\u11bc\u110b\u1165 \u110b\u116e\u1109\u1161\u11ab \u110b\u116e\u1109\u1165\u11ab \u110b\u116e\u1109\u1173\u11bc \u110b\u116e\u110b\u1167\u11ab\u1112\u1175 \u110b\u116e\u110c\u1165\u11bc \u110b\u116e\u110e\u1166\u1100\u116e\u11a8 \u110b\u116e\u1111\u1167\u11ab \u110b\u116e\u11ab\u1103\u1169\u11bc \u110b\u116e\u11ab\u1106\u1167\u11bc \u110b\u116e\u11ab\u1107\u1161\u11ab \u110b\u116e\u11ab\u110c\u1165\u11ab \u110b\u116e\u11ab\u1112\u1162\u11bc \u110b\u116e\u11af\u1109\u1161\u11ab \u110b\u116e\u11af\u110b\u1173\u11b7 \u110b\u116e\u11b7\u110c\u1175\u11a8\u110b\u1175\u11b7 \u110b\u116e\u11ba\u110b\u1165\u1105\u1173\u11ab \u110b\u116e\u11ba\u110b\u1173\u11b7 \u110b\u116f\u1102\u1161\u11a8 \u110b\u116f\u11ab\u1100\u1169 \u110b\u116f\u11ab\u1105\u1162 \u110b\u116f\u11ab\u1109\u1165 \u110b\u116f\u11ab\u1109\u116e\u11bc\u110b\u1175 \u110b\u116f\u11ab\u110b\u1175\u11ab \u110b\u116f\u11ab\u110c\u1161\u11bc \u110b\u116f\u11ab\u1111\u1175\u1109\u1173 \u110b\u116f\u11af\u1100\u1173\u11b8 \u110b\u116f\u11af\u1103\u1173\u110f\u1165\u11b8 \u110b\u116f\u11af\u1109\u1166 \u110b\u116f\u11af\u110b\u116d\u110b\u1175\u11af \u110b\u1170\u110b\u1175\u1110\u1165 \u110b\u1171\u1107\u1161\u11ab \u110b\u1171\u1107\u1165\u11b8 \u110b\u1171\u1109\u1165\u11bc \u110b\u1171\u110b\u116f\u11ab \u110b\u1171\u1112\u1165\u11b7 \u110b\u1171\u1112\u1167\u11b8 \u110b\u1171\u11ba\u1109\u1161\u1105\u1161\u11b7 \u110b\u1172\u1102\u1161\u11ab\u1112\u1175 \u110b\u1172\u1105\u1165\u11b8 \u110b\u1172\u1106\u1167\u11bc \u110b\u1172\u1106\u116e\u11af \u110b\u1172\u1109\u1161\u11ab \u110b\u1172\u110c\u1165\u11a8 \u110b\u1172\u110e\u1175\u110b\u116f\u11ab \u110b\u1172\u1112\u1161\u11a8 \u110b\u1172\u1112\u1162\u11bc \u110b\u1172\u1112\u1167\u11bc \u110b\u1172\u11a8\u1100\u116e\u11ab \u110b\u1172\u11a8\u1109\u1161\u11bc \u110b\u1172\u11a8\u1109\u1175\u11b8 \u110b\u1172\u11a8\u110e\u1166 \u110b\u1173\u11ab\u1112\u1162\u11bc \u110b\u1173\u11b7\u1105\u1167\u11a8 \u110b\u1173\u11b7\u1105\u116d \u110b\u1173\u11b7\u1107\u1161\u11ab \u110b\u1173\u11b7\u1109\u1165\u11bc \u110b\u1173\u11b7\u1109\u1175\u11a8 \u110b\u1173\u11b7\u110b\u1161\u11a8 \u110b\u1173\u11b7\u110c\u116e \u110b\u1174\u1100\u1167\u11ab \u110b\u1174\u1102\u1169\u11ab \u110b\u1174\u1106\u116e\u11ab \u110b\u1174\u1107\u1169\u11a8 \u110b\u1174\u1109\u1175\u11a8 \u110b\u1174\u1109\u1175\u11b7 \u110b\u1174\u110b\u116c\u1105\u1169 \u110b\u1174\u110b\u116d\u11a8 \u110b\u1174\u110b\u116f\u11ab \u110b\u1174\u1112\u1161\u11a8 \u110b\u1175\u1100\u1165\u11ba \u110b\u1175\u1100\u1169\u11ba \u110b\u1175\u1102\u1167\u11b7 \u110b\u1175\u1102\u1169\u11b7 \u110b\u1175\u1103\u1161\u11af \u110b\u1175\u1103\u1162\u1105\u1169 \u110b\u1175\u1103\u1169\u11bc \u110b\u1175\u1105\u1165\u11c2\u1100\u1166 \u110b\u1175\u1105\u1167\u11a8\u1109\u1165 \u110b\u1175\u1105\u1169\u11ab\u110c\u1165\u11a8 \u110b\u1175\u1105\u1173\u11b7 \u110b\u1175\u1106\u1175\u11ab \u110b\u1175\u1107\u1161\u11af\u1109\u1169 \u110b\u1175\u1107\u1167\u11af \u110b\u1175\u1107\u116e\u11af \u110b\u1175\u1108\u1161\u11af \u110b\u1175\u1109\u1161\u11bc \u110b\u1175\u1109\u1165\u11bc \u110b\u1175\u1109\u1173\u11af \u110b\u1175\u110b\u1163\u1100\u1175 \u110b\u1175\u110b\u116d\u11bc \u110b\u1175\u110b\u116e\u11ba \u110b\u1175\u110b\u116f\u11af \u110b\u1175\u110b\u1173\u11a8\u1100\u1169 \u110b\u1175\u110b\u1175\u11a8 \u110b\u1175\u110c\u1165\u11ab \u110b\u1175\u110c\u116e\u11bc \u110b\u1175\u1110\u1173\u11ae\u1102\u1161\u11af \u110b\u1175\u1110\u1173\u11af \u110b\u1175\u1112\u1169\u11ab \u110b\u1175\u11ab\u1100\u1161\u11ab \u110b\u1175\u11ab\u1100\u1167\u11a8 \u110b\u1175\u11ab\u1100\u1169\u11bc \u110b\u1175\u11ab\u1100\u116e \u110b\u1175\u11ab\u1100\u1173\u11ab \u110b\u1175\u11ab\u1100\u1175 \u110b\u1175\u11ab\u1103\u1169 \u110b\u1175\u11ab\u1105\u1172 \u110b\u1175\u11ab\u1106\u116e\u11af \u110b\u1175\u11ab\u1109\u1162\u11bc \u110b\u1175\u11ab\u1109\u116b \u110b\u1175\u11ab\u110b\u1167\u11ab \u110b\u1175\u11ab\u110b\u116f\u11ab \u110b\u1175\u11ab\u110c\u1162 \u110b\u1175\u11ab\u110c\u1169\u11bc \u110b\u1175\u11ab\u110e\u1165\u11ab \u110b\u1175\u11ab\u110e\u1166 \u110b\u1175\u11ab\u1110\u1165\u1102\u1166\u11ba \u110b\u1175\u11ab\u1112\u1161 \u110b\u1175\u11ab\u1112\u1167\u11bc \u110b\u1175\u11af\u1100\u1169\u11b8 \u110b\u1175\u11af\u1100\u1175 \u110b\u1175\u11af\u1103\u1161\u11ab \u110b\u1175\u11af\u1103\u1162 \u110b\u1175\u11af\u1103\u1173\u11bc \u110b\u1175\u11af\u1107\u1161\u11ab \u110b\u1175\u11af\u1107\u1169\u11ab \u110b\u1175\u11af\u1107\u116e \u110b\u1175\u11af\u1109\u1161\u11bc \u110b\u1175\u11af\u1109\u1162\u11bc \u110b\u1175\u11af\u1109\u1169\u11ab \u110b\u1175\u11af\u110b\u116d\u110b\u1175\u11af \u110b\u1175\u11af\u110b\u116f\u11af \u110b\u1175\u11af\u110c\u1165\u11bc \u110b\u1175\u11af\u110c\u1169\u11bc \u110b\u1175\u11af\u110c\u116e\u110b\u1175\u11af \u110b\u1175\u11af\u110d\u1175\u11a8 \u110b\u1175\u11af\u110e\u1166 \u110b\u1175\u11af\u110e\u1175 \u110b\u1175\u11af\u1112\u1162\u11bc \u110b\u1175\u11af\u1112\u116c\u110b\u116d\u11bc \u110b\u1175\u11b7\u1100\u1173\u11b7 \u110b\u1175\u11b7\u1106\u116e \u110b\u1175\u11b8\u1103\u1162 \u110b\u1175\u11b8\u1105\u1167\u11a8 \u110b\u1175\u11b8\u1106\u1161\u11ba \u110b\u1175\u11b8\u1109\u1161 \u110b\u1175\u11b8\u1109\u116e\u11af \u110b\u1175\u11b8\u1109\u1175 \u110b\u1175\u11b8\u110b\u116f\u11ab \u110b\u1175\u11b8\u110c\u1161\u11bc \u110b\u1175\u11b8\u1112\u1161\u11a8 \u110c\u1161\u1100\u1161\u110b\u116d\u11bc \u110c\u1161\u1100\u1167\u11a8 \u110c\u1161\u1100\u1173\u11a8 \u110c\u1161\u1103\u1169\u11bc \u110c\u1161\u1105\u1161\u11bc \u110c\u1161\u1107\u116e\u1109\u1175\u11b7 \u110c\u1161\u1109\u1175\u11a8 \u110c\u1161\u1109\u1175\u11ab \u110c\u1161\u110b\u1167\u11ab \u110c\u1161\u110b\u116f\u11ab \u110c\u1161\u110b\u1172\u11af \u110c\u1161\u110c\u1165\u11ab\u1100\u1165 \u110c\u1161\u110c\u1165\u11bc \u110c\u1161\u110c\u1169\u11ab\u1109\u1175\u11b7 \u110c\u1161\u1111\u1161\u11ab \u110c\u1161\u11a8\u1100\u1161 \u110c\u1161\u11a8\u1102\u1167\u11ab \u110c\u1161\u11a8\u1109\u1165\u11bc \u110c\u1161\u11a8\u110b\u1165\u11b8 \u110c\u1161\u11a8\u110b\u116d\u11bc \u110c\u1161\u11a8\u110b\u1173\u11ab\u1104\u1161\u11af \u110c\u1161\u11a8\u1111\u116e\u11b7 \u110c\u1161\u11ab\u1103\u1175 \u110c\u1161\u11ab\u1104\u1173\u11a8 \u110c\u1161\u11ab\u110e\u1175 \u110c\u1161\u11af\u1106\u1169\u11ba \u110c\u1161\u11b7\u1101\u1161\u11ab \u110c\u1161\u11b7\u1109\u116e\u1112\u1161\u11b7 \u110c\u1161\u11b7\u1109\u1175 \u110c\u1161\u11b7\u110b\u1169\u11ba \u110c\u1161\u11b7\u110c\u1161\u1105\u1175 \u110c\u1161\u11b8\u110c\u1175 \u110c\u1161\u11bc\u1100\u116a\u11ab \u110c\u1161\u11bc\u1100\u116e\u11ab \u110c\u1161\u11bc\u1100\u1175\u1100\u1161\u11ab \u110c\u1161\u11bc\u1105\u1162 \u110c\u1161\u11bc\u1105\u1168 \u110c\u1161\u11bc\u1105\u1173 \u110c\u1161\u11bc\u1106\u1161 \u110c\u1161\u11bc\u1106\u1167\u11ab \u110c\u1161\u11bc\u1106\u1169 \u110c\u1161\u11bc\u1106\u1175 \u110c\u1161\u11bc\u1107\u1175 \u110c\u1161\u11bc\u1109\u1161 \u110c\u1161\u11bc\u1109\u1169 \u110c\u1161\u11bc\u1109\u1175\u11a8 \u110c\u1161\u11bc\u110b\u1162\u110b\u1175\u11ab \u110c\u1161\u11bc\u110b\u1175\u11ab \u110c\u1161\u11bc\u110c\u1165\u11b7 \u110c\u1161\u11bc\u110e\u1161 \u110c\u1161\u11bc\u1112\u1161\u11a8\u1100\u1173\u11b7 \u110c\u1162\u1102\u1173\u11bc \u110c\u1162\u1108\u1161\u11af\u1105\u1175 \u110c\u1162\u1109\u1161\u11ab \u110c\u1162\u1109\u1162\u11bc \u110c\u1162\u110c\u1161\u11a8\u1102\u1167\u11ab \u110c\u1162\u110c\u1165\u11bc \u110c\u1162\u110e\u1162\u1100\u1175 \u110c\u1162\u1111\u1161\u11ab \u110c\u1162\u1112\u1161\u11a8 \u110c\u1162\u1112\u116a\u11af\u110b\u116d\u11bc \u110c\u1165\u1100\u1165\u11ba \u110c\u1165\u1100\u1169\u1105\u1175 \u110c\u1165\u1100\u1169\u11ba \u110c\u1165\u1102\u1167\u11a8 \u110c\u1165\u1105\u1165\u11ab \u110c\u1165\u1105\u1165\u11c2\u1100\u1166 \u110c\u1165\u1107\u1165\u11ab \u110c\u1165\u110b\u116e\u11af \u110c\u1165\u110c\u1165\u11af\u1105\u1169 \u110c\u1165\u110e\u116e\u11a8 \u110c\u1165\u11a8\u1100\u1173\u11a8 \u110c\u1165\u11a8\u1103\u1161\u11bc\u1112\u1175 \u110c\u1165\u11a8\u1109\u1165\u11bc \u110c\u1165\u11a8\u110b\u116d\u11bc \u110c\u1165\u11a8\u110b\u1173\u11bc \u110c\u1165\u11ab\u1100\u1162 \u110c\u1165\u11ab\u1100\u1169\u11bc \u110c\u1165\u11ab\u1100\u1175 \u110c\u1165\u11ab\u1103\u1161\u11af \u110c\u1165\u11ab\u1105\u1161\u1103\u1169 \u110c\u1165\u11ab\u1106\u1161\u11bc \u110c\u1165\u11ab\u1106\u116e\u11ab \u110c\u1165\u11ab\u1107\u1161\u11ab \u110c\u1165\u11ab\u1107\u116e \u110c\u1165\u11ab\u1109\u1166 \u110c\u1165\u11ab\u1109\u1175 \u110c\u1165\u11ab\u110b\u116d\u11bc \u110c\u1165\u11ab\u110c\u1161 \u110c\u1165\u11ab\u110c\u1162\u11bc \u110c\u1165\u11ab\u110c\u116e \u110c\u1165\u11ab\u110e\u1165\u11af \u110c\u1165\u11ab\u110e\u1166 \u110c\u1165\u11ab\u1110\u1169\u11bc \u110c\u1165\u11ab\u1112\u1167 \u110c\u1165\u11ab\u1112\u116e \u110c\u1165\u11af\u1103\u1162 \u110c\u1165\u11af\u1106\u1161\u11bc \u110c\u1165\u11af\u1107\u1161\u11ab \u110c\u1165\u11af\u110b\u1163\u11a8 \u110c\u1165\u11af\u110e\u1161 \u110c\u1165\u11b7\u1100\u1165\u11b7 \u110c\u1165\u11b7\u1109\u116e \u110c\u1165\u11b7\u1109\u1175\u11b7 \u110c\u1165\u11b7\u110b\u116f\u11ab \u110c\u1165\u11b7\u110c\u1165\u11b7 \u110c\u1165\u11b7\u110e\u1161 \u110c\u1165\u11b8\u1100\u1173\u11ab \u110c\u1165\u11b8\u1109\u1175 \u110c\u1165\u11b8\u110e\u1169\u11a8 \u110c\u1165\u11ba\u1100\u1161\u1105\u1161\u11a8 \u110c\u1165\u11bc\u1100\u1165\u110c\u1161\u11bc \u110c\u1165\u11bc\u1103\u1169 \u110c\u1165\u11bc\u1105\u1172\u110c\u1161\u11bc \u110c\u1165\u11bc\u1105\u1175 \u110c\u1165\u11bc\u1106\u1161\u11af \u110c\u1165\u11bc\u1106\u1167\u11ab \u110c\u1165\u11bc\u1106\u116e\u11ab \u110c\u1165\u11bc\u1107\u1161\u11ab\u1103\u1162 \u110c\u1165\u11bc\u1107\u1169 \u110c\u1165\u11bc\u1107\u116e \u110c\u1165\u11bc\u1107\u1175 \u110c\u1165\u11bc\u1109\u1161\u11bc \u110c\u1165\u11bc\u1109\u1165\u11bc \u110c\u1165\u11bc\u110b\u1169 \u110c\u1165\u11bc\u110b\u116f\u11ab \u110c\u1165\u11bc\u110c\u1161\u11bc \u110c\u1165\u11bc\u110c\u1175 \u110c\u1165\u11bc\u110e\u1175 \u110c\u1165\u11bc\u1112\u116a\u11a8\u1112\u1175 \u110c\u1166\u1100\u1169\u11bc \u110c\u1166\u1100\u116a\u110c\u1165\u11b7 \u110c\u1166\u1103\u1162\u1105\u1169 \u110c\u1166\u1106\u1169\u11a8 \u110c\u1166\u1107\u1161\u11af \u110c\u1166\u1107\u1165\u11b8 \u110c\u1166\u1109\u1161\u11ba\u1102\u1161\u11af \u110c\u1166\u110b\u1161\u11ab \u110c\u1166\u110b\u1175\u11af \u110c\u1166\u110c\u1161\u11a8 \u110c\u1166\u110c\u116e\u1103\u1169 \u110c\u1166\u110e\u116e\u11af \u110c\u1166\u1111\u116e\u11b7 \u110c\u1166\u1112\u1161\u11ab \u110c\u1169\u1100\u1161\u11a8 \u110c\u1169\u1100\u1165\u11ab \u110c\u1169\u1100\u1173\u11b7 \u110c\u1169\u1100\u1175\u11bc \u110c\u1169\u1106\u1167\u11bc \u110c\u1169\u1106\u1175\u1105\u116d \u110c\u1169\u1109\u1161\u11bc \u110c\u1169\u1109\u1165\u11ab \u110c\u1169\u110b\u116d\u11bc\u1112\u1175 \u110c\u1169\u110c\u1165\u11af \u110c\u1169\u110c\u1165\u11bc \u110c\u1169\u110c\u1175\u11a8 \u110c\u1169\u11ab\u1103\u1162\u11ba\u1106\u1161\u11af \u110c\u1169\u11ab\u110c\u1162 \u110c\u1169\u11af\u110b\u1165\u11b8 \u110c\u1169\u11af\u110b\u1173\u11b7 \u110c\u1169\u11bc\u1100\u116d \u110c\u1169\u11bc\u1105\u1169 \u110c\u1169\u11bc\u1105\u1172 \u110c\u1169\u11bc\u1109\u1169\u1105\u1175 \u110c\u1169\u11bc\u110b\u1165\u11b8\u110b\u116f\u11ab \u110c\u1169\u11bc\u110c\u1169\u11bc \u110c\u1169\u11bc\u1112\u1161\u11b8 \u110c\u116a\u1109\u1165\u11a8 \u110c\u116c\u110b\u1175\u11ab \u110c\u116e\u1100\u116a\u11ab\u110c\u1165\u11a8 \u110c\u116e\u1105\u1173\u11b7 \u110c\u116e\u1106\u1161\u11af \u110c\u116e\u1106\u1165\u1102\u1175 \u110c\u116e\u1106\u1165\u11a8 \u110c\u116e\u1106\u116e\u11ab \u110c\u116e\u1106\u1175\u11ab \u110c\u116e\u1107\u1161\u11bc \u110c\u116e\u1107\u1167\u11ab \u110c\u116e\u1109\u1175\u11a8 \u110c\u116e\u110b\u1175\u11ab \u110c\u116e\u110b\u1175\u11af \u110c\u116e\u110c\u1161\u11bc \u110c\u116e\u110c\u1165\u11ab\u110c\u1161 \u110c\u116e\u1110\u1162\u11a8 \u110c\u116e\u11ab\u1107\u1175 \u110c\u116e\u11af\u1100\u1165\u1105\u1175 \u110c\u116e\u11af\u1100\u1175 \u110c\u116e\u11af\u1106\u116e\u1102\u1174 \u110c\u116e\u11bc\u1100\u1161\u11ab \u110c\u116e\u11bc\u1100\u1168\u1107\u1161\u11bc\u1109\u1169\u11bc \u110c\u116e\u11bc\u1100\u116e\u11a8 \u110c\u116e\u11bc\u1102\u1167\u11ab \u110c\u116e\u11bc\u1103\u1161\u11ab \u110c\u116e\u11bc\u1103\u1169\u11a8 \u110c\u116e\u11bc\u1107\u1161\u11ab \u110c\u116e\u11bc\u1107\u116e \u110c\u116e\u11bc\u1109\u1166 \u110c\u116e\u11bc\u1109\u1169\u1100\u1175\u110b\u1165\u11b8 \u110c\u116e\u11bc\u1109\u116e\u11ab \u110c\u116e\u11bc\u110b\u1161\u11bc \u110c\u116e\u11bc\u110b\u116d \u110c\u116e\u11bc\u1112\u1161\u11a8\u1100\u116d \u110c\u1173\u11a8\u1109\u1165\u11a8 \u110c\u1173\u11a8\u1109\u1175 \u110c\u1173\u11af\u1100\u1165\u110b\u116e\u11b7 \u110c\u1173\u11bc\u1100\u1161 \u110c\u1173\u11bc\u1100\u1165 \u110c\u1173\u11bc\u1100\u116f\u11ab \u110c\u1173\u11bc\u1109\u1161\u11bc \u110c\u1173\u11bc\u1109\u1166 \u110c\u1175\u1100\u1161\u11a8 \u110c\u1175\u1100\u1161\u11b8 \u110c\u1175\u1100\u1167\u11bc \u110c\u1175\u1100\u1173\u11a8\u1112\u1175 \u110c\u1175\u1100\u1173\u11b7 \u110c\u1175\u1100\u1173\u11b8 \u110c\u1175\u1102\u1173\u11bc \u110c\u1175\u1105\u1173\u11b7\u1100\u1175\u11af \u110c\u1175\u1105\u1175\u1109\u1161\u11ab \u110c\u1175\u1107\u1161\u11bc \u110c\u1175\u1107\u116e\u11bc \u110c\u1175\u1109\u1175\u11a8 \u110c\u1175\u110b\u1167\u11a8 \u110c\u1175\u110b\u116e\u1100\u1162 \u110c\u1175\u110b\u116f\u11ab \u110c\u1175\u110c\u1165\u11a8 \u110c\u1175\u110c\u1165\u11b7 \u110c\u1175\u110c\u1175\u11ab \u110c\u1175\u110e\u116e\u11af \u110c\u1175\u11a8\u1109\u1165\u11ab \u110c\u1175\u11a8\u110b\u1165\u11b8 \u110c\u1175\u11a8\u110b\u116f\u11ab \u110c\u1175\u11a8\u110c\u1161\u11bc \u110c\u1175\u11ab\u1100\u1173\u11b8 \u110c\u1175\u11ab\u1103\u1169\u11bc \u110c\u1175\u11ab\u1105\u1169 \u110c\u1175\u11ab\u1105\u116d \u110c\u1175\u11ab\u1105\u1175 \u110c\u1175\u11ab\u110d\u1161 \u110c\u1175\u11ab\u110e\u1161\u11af \u110c\u1175\u11ab\u110e\u116e\u11af \u110c\u1175\u11ab\u1110\u1169\u11bc \u110c\u1175\u11ab\u1112\u1162\u11bc \u110c\u1175\u11af\u1106\u116e\u11ab \u110c\u1175\u11af\u1107\u1167\u11bc \u110c\u1175\u11af\u1109\u1165 \u110c\u1175\u11b7\u110c\u1161\u11a8 \u110c\u1175\u11b8\u1103\u1161\u11ab \u110c\u1175\u11b8\u110b\u1161\u11ab \u110c\u1175\u11b8\u110c\u116e\u11bc \u110d\u1161\u110c\u1173\u11bc \u110d\u1175\u1101\u1165\u1100\u1175 \u110e\u1161\u1102\u1161\u11b7 \u110e\u1161\u1105\u1161\u1105\u1175 \u110e\u1161\u1105\u1163\u11bc \u110e\u1161\u1105\u1175\u11b7 \u110e\u1161\u1107\u1167\u11af \u110e\u1161\u1109\u1165\u11ab \u110e\u1161\u110e\u1173\u11b7 \u110e\u1161\u11a8\u1100\u1161\u11a8 \u110e\u1161\u11ab\u1106\u116e\u11af \u110e\u1161\u11ab\u1109\u1165\u11bc \u110e\u1161\u11b7\u1100\u1161 \u110e\u1161\u11b7\u1100\u1175\u1105\u1173\u11b7 \u110e\u1161\u11b7\u1109\u1162 \u110e\u1161\u11b7\u1109\u1165\u11a8 \u110e\u1161\u11b7\u110b\u1167 \u110e\u1161\u11b7\u110b\u116c \u110e\u1161\u11b7\u110c\u1169 \u110e\u1161\u11ba\u110c\u1161\u11ab \u110e\u1161\u11bc\u1100\u1161 \u110e\u1161\u11bc\u1100\u1169 \u110e\u1161\u11bc\u1100\u116e \u110e\u1161\u11bc\u1106\u116e\u11ab \u110e\u1161\u11bc\u1107\u1161\u11a9 \u110e\u1161\u11bc\u110c\u1161\u11a8 \u110e\u1161\u11bc\u110c\u1169 \u110e\u1162\u1102\u1165\u11af \u110e\u1162\u110c\u1165\u11b7 \u110e\u1162\u11a8\u1100\u1161\u1107\u1161\u11bc \u110e\u1162\u11a8\u1107\u1161\u11bc \u110e\u1162\u11a8\u1109\u1161\u11bc \u110e\u1162\u11a8\u110b\u1175\u11b7 \u110e\u1162\u11b7\u1111\u1175\u110b\u1165\u11ab \u110e\u1165\u1107\u1165\u11af \u110e\u1165\u110b\u1173\u11b7 \u110e\u1165\u11ab\u1100\u116e\u11a8 \u110e\u1165\u11ab\u1103\u116e\u11bc \u110e\u1165\u11ab\u110c\u1161\u11bc \u110e\u1165\u11ab\u110c\u1162 \u110e\u1165\u11ab\u110e\u1165\u11ab\u1112\u1175 \u110e\u1165\u11af\u1103\u1169 \u110e\u1165\u11af\u110c\u1165\u1112\u1175 \u110e\u1165\u11af\u1112\u1161\u11a8 \u110e\u1165\u11ba\u1102\u1161\u11af \u110e\u1165\u11ba\u110d\u1162 \u110e\u1165\u11bc\u1102\u1167\u11ab \u110e\u1165\u11bc\u1107\u1161\u110c\u1175 \u110e\u1165\u11bc\u1109\u1169 \u110e\u1165\u11bc\u110e\u116e\u11ab \u110e\u1166\u1100\u1168 \u110e\u1166\u1105\u1167\u11a8 \u110e\u1166\u110b\u1169\u11ab \u110e\u1166\u110b\u1172\u11a8 \u110e\u1166\u110c\u116e\u11bc \u110e\u1166\u1112\u1165\u11b7 \u110e\u1169\u1103\u1173\u11bc\u1112\u1161\u11a8\u1109\u1162\u11bc \u110e\u1169\u1107\u1161\u11ab \u110e\u1169\u1107\u1161\u11b8 \u110e\u1169\u1109\u1161\u11bc\u1112\u116a \u110e\u1169\u1109\u116e\u11ab \u110e\u1169\u110b\u1167\u1105\u1173\u11b7 \u110e\u1169\u110b\u116f\u11ab \u110e\u1169\u110c\u1165\u1102\u1167\u11a8 \u110e\u1169\u110c\u1165\u11b7 \u110e\u1169\u110e\u1165\u11bc \u110e\u1169\u110f\u1169\u11af\u1105\u1175\u11ba \u110e\u1169\u11ba\u1107\u116e\u11af \u110e\u1169\u11bc\u1100\u1161\u11a8 \u110e\u1169\u11bc\u1105\u1175 \u110e\u1169\u11bc\u110c\u1161\u11bc \u110e\u116a\u11af\u110b\u1167\u11bc \u110e\u116c\u1100\u1173\u11ab \u110e\u116c\u1109\u1161\u11bc \u110e\u116c\u1109\u1165\u11ab \u110e\u116c\u1109\u1175\u11ab \u110e\u116c\u110b\u1161\u11a8 \u110e\u116c\u110c\u1169\u11bc \u110e\u116e\u1109\u1165\u11a8 \u110e\u116e\u110b\u1165\u11a8 \u110e\u116e\u110c\u1175\u11ab \u110e\u116e\u110e\u1165\u11ab \u110e\u116e\u110e\u1173\u11a8 \u110e\u116e\u11a8\u1100\u116e \u110e\u116e\u11a8\u1109\u1169 \u110e\u116e\u11a8\u110c\u1166 \u110e\u116e\u11a8\u1112\u1161 \u110e\u116e\u11af\u1100\u1173\u11ab \u110e\u116e\u11af\u1107\u1161\u11af \u110e\u116e\u11af\u1109\u1161\u11ab \u110e\u116e\u11af\u1109\u1175\u11ab \u110e\u116e\u11af\u110b\u1167\u11ab \u110e\u116e\u11af\u110b\u1175\u11b8 \u110e\u116e\u11af\u110c\u1161\u11bc \u110e\u116e\u11af\u1111\u1161\u11ab \u110e\u116e\u11bc\u1100\u1167\u11a8 \u110e\u116e\u11bc\u1100\u1169 \u110e\u116e\u11bc\u1103\u1169\u11af \u110e\u116e\u11bc\u1107\u116e\u11ab\u1112\u1175 \u110e\u116e\u11bc\u110e\u1165\u11bc\u1103\u1169 \u110e\u1171\u110b\u1165\u11b8 \u110e\u1171\u110c\u1175\u11a8 \u110e\u1171\u1112\u1163\u11bc \u110e\u1175\u110b\u1163\u11a8 \u110e\u1175\u11ab\u1100\u116e \u110e\u1175\u11ab\u110e\u1165\u11a8 \u110e\u1175\u11af\u1109\u1175\u11b8 \u110e\u1175\u11af\u110b\u116f\u11af \u110e\u1175\u11af\u1111\u1161\u11ab \u110e\u1175\u11b7\u1103\u1162 \u110e\u1175\u11b7\u1106\u116e\u11a8 \u110e\u1175\u11b7\u1109\u1175\u11af \u110e\u1175\u11ba\u1109\u1169\u11af \u110e\u1175\u11bc\u110e\u1161\u11ab \u110f\u1161\u1106\u1166\u1105\u1161 \u110f\u1161\u110b\u116e\u11ab\u1110\u1165 \u110f\u1161\u11af\u1100\u116e\u11a8\u1109\u116e \u110f\u1162\u1105\u1175\u11a8\u1110\u1165 \u110f\u1162\u11b7\u1111\u1165\u1109\u1173 \u110f\u1162\u11b7\u1111\u1166\u110b\u1175\u11ab \u110f\u1165\u1110\u1173\u11ab \u110f\u1165\u11ab\u1103\u1175\u1109\u1167\u11ab \u110f\u1165\u11af\u1105\u1165 \u110f\u1165\u11b7\u1111\u1172\u1110\u1165 \u110f\u1169\u1101\u1175\u1105\u1175 \u110f\u1169\u1106\u1175\u1103\u1175 \u110f\u1169\u11ab\u1109\u1165\u1110\u1173 \u110f\u1169\u11af\u1105\u1161 \u110f\u1169\u11b7\u1111\u1173\u11af\u1105\u1166\u11a8\u1109\u1173 \u110f\u1169\u11bc\u1102\u1161\u1106\u116e\u11af \u110f\u116b\u1100\u1161\u11b7 \u110f\u116e\u1103\u1166\u1110\u1161 \u110f\u1173\u1105\u1175\u11b7 \u110f\u1173\u11ab\u1100\u1175\u11af \u110f\u1173\u11ab\u1104\u1161\u11af \u110f\u1173\u11ab\u1109\u1169\u1105\u1175 \u110f\u1173\u11ab\u110b\u1161\u1103\u1173\u11af \u110f\u1173\u11ab\u110b\u1165\u1106\u1165\u1102\u1175 \u110f\u1173\u11ab\u110b\u1175\u11af \u110f\u1173\u11ab\u110c\u1165\u11af \u110f\u1173\u11af\u1105\u1162\u1109\u1175\u11a8 \u110f\u1173\u11af\u1105\u1165\u11b8 \u110f\u1175\u11af\u1105\u1169 \u1110\u1161\u110b\u1175\u11b8 \u1110\u1161\u110c\u1161\u1100\u1175 \u1110\u1161\u11a8\u1100\u116e \u1110\u1161\u11a8\u110c\u1161 \u1110\u1161\u11ab\u1109\u1162\u11bc \u1110\u1162\u1100\u116f\u11ab\u1103\u1169 \u1110\u1162\u110b\u1163\u11bc \u1110\u1162\u1111\u116e\u11bc \u1110\u1162\u11a8\u1109\u1175 \u1110\u1162\u11af\u1105\u1165\u11ab\u1110\u1173 \u1110\u1165\u1102\u1165\u11af \u1110\u1165\u1106\u1175\u1102\u1165\u11af \u1110\u1166\u1102\u1175\u1109\u1173 \u1110\u1166\u1109\u1173\u1110\u1173 \u1110\u1166\u110b\u1175\u1107\u1173\u11af \u1110\u1166\u11af\u1105\u1166\u1107\u1175\u110c\u1165\u11ab \u1110\u1169\u1105\u1169\u11ab \u1110\u1169\u1106\u1161\u1110\u1169 \u1110\u1169\u110b\u116d\u110b\u1175\u11af \u1110\u1169\u11bc\u1100\u1168 \u1110\u1169\u11bc\u1100\u116a \u1110\u1169\u11bc\u1105\u1169 \u1110\u1169\u11bc\u1109\u1175\u11ab \u1110\u1169\u11bc\u110b\u1167\u11a8 \u1110\u1169\u11bc\u110b\u1175\u11af \u1110\u1169\u11bc\u110c\u1161\u11bc \u1110\u1169\u11bc\u110c\u1166 \u1110\u1169\u11bc\u110c\u1173\u11bc \u1110\u1169\u11bc\u1112\u1161\u11b8 \u1110\u1169\u11bc\u1112\u116a \u1110\u116c\u1100\u1173\u11ab \u1110\u116c\u110b\u116f\u11ab \u1110\u116c\u110c\u1175\u11a8\u1100\u1173\u11b7 \u1110\u1171\u1100\u1175\u11b7 \u1110\u1173\u1105\u1165\u11a8 \u1110\u1173\u11a8\u1100\u1173\u11b8 \u1110\u1173\u11a8\u1107\u1167\u11af \u1110\u1173\u11a8\u1109\u1165\u11bc \u1110\u1173\u11a8\u1109\u116e \u1110\u1173\u11a8\u110c\u1175\u11bc \u1110\u1173\u11a8\u1112\u1175 \u1110\u1173\u11ab\u1110\u1173\u11ab\u1112\u1175 \u1110\u1175\u1109\u1167\u110e\u1173 \u1111\u1161\u1105\u1161\u11ab\u1109\u1162\u11a8 \u1111\u1161\u110b\u1175\u11af \u1111\u1161\u110e\u116e\u11af\u1109\u1169 \u1111\u1161\u11ab\u1100\u1167\u11af \u1111\u1161\u11ab\u1103\u1161\u11ab \u1111\u1161\u11ab\u1106\u1162 \u1111\u1161\u11ab\u1109\u1161 \u1111\u1161\u11af\u1109\u1175\u11b8 \u1111\u1161\u11af\u110b\u116f\u11af \u1111\u1161\u11b8\u1109\u1169\u11bc \u1111\u1162\u1109\u1167\u11ab \u1111\u1162\u11a8\u1109\u1173 \u1111\u1162\u11a8\u1109\u1175\u1106\u1175\u11af\u1105\u1175 \u1111\u1162\u11ab\u1110\u1175 \u1111\u1165\u1109\u1166\u11ab\u1110\u1173 \u1111\u1166\u110b\u1175\u11ab\u1110\u1173 \u1111\u1167\u11ab\u1100\u1167\u11ab \u1111\u1167\u11ab\u110b\u1174 \u1111\u1167\u11ab\u110c\u1175 \u1111\u1167\u11ab\u1112\u1175 \u1111\u1167\u11bc\u1100\u1161 \u1111\u1167\u11bc\u1100\u1172\u11ab \u1111\u1167\u11bc\u1109\u1162\u11bc \u1111\u1167\u11bc\u1109\u1169 \u1111\u1167\u11bc\u110b\u1163\u11bc \u1111\u1167\u11bc\u110b\u1175\u11af \u1111\u1167\u11bc\u1112\u116a \u1111\u1169\u1109\u1173\u1110\u1165 \u1111\u1169\u110b\u1175\u11ab\u1110\u1173 \u1111\u1169\u110c\u1161\u11bc \u1111\u1169\u1112\u1161\u11b7 \u1111\u116d\u1106\u1167\u11ab \u1111\u116d\u110c\u1165\u11bc \u1111\u116d\u110c\u116e\u11ab \u1111\u116d\u1112\u1167\u11ab \u1111\u116e\u11b7\u1106\u1169\u11a8 \u1111\u116e\u11b7\u110c\u1175\u11af \u1111\u116e\u11bc\u1100\u1167\u11bc \u1111\u116e\u11bc\u1109\u1169\u11a8 \u1111\u116e\u11bc\u1109\u1173\u11b8 \u1111\u1173\u1105\u1161\u11bc\u1109\u1173 \u1111\u1173\u1105\u1175\u11ab\u1110\u1165 \u1111\u1173\u11af\u1105\u1161\u1109\u1173\u1110\u1175\u11a8 \u1111\u1175\u1100\u1169\u11ab \u1111\u1175\u1106\u1161\u11bc \u1111\u1175\u110b\u1161\u1102\u1169 \u1111\u1175\u11af\u1105\u1173\u11b7 \u1111\u1175\u11af\u1109\u116e \u1111\u1175\u11af\u110b\u116d \u1111\u1175\u11af\u110c\u1161 \u1111\u1175\u11af\u1110\u1169\u11bc \u1111\u1175\u11bc\u1100\u1168 \u1112\u1161\u1102\u1173\u1102\u1175\u11b7 \u1112\u1161\u1102\u1173\u11af \u1112\u1161\u1103\u1173\u110b\u1170\u110b\u1165 \u1112\u1161\u1105\u116e\u11ba\u1107\u1161\u11b7 \u1112\u1161\u1107\u1161\u11ab\u1100\u1175 \u1112\u1161\u1109\u116e\u11a8\u110c\u1175\u11b8 \u1112\u1161\u1109\u116e\u11ab \u1112\u1161\u110b\u1167\u1110\u1173\u11ab \u1112\u1161\u110c\u1175\u1106\u1161\u11ab \u1112\u1161\u110e\u1165\u11ab \u1112\u1161\u1111\u116e\u11b7 \u1112\u1161\u1111\u1175\u11af \u1112\u1161\u11a8\u1100\u116a \u1112\u1161\u11a8\u1100\u116d \u1112\u1161\u11a8\u1100\u1173\u11b8 \u1112\u1161\u11a8\u1100\u1175 \u1112\u1161\u11a8\u1102\u1167\u11ab \u1112\u1161\u11a8\u1105\u1167\u11a8 \u1112\u1161\u11a8\u1107\u1165\u11ab \u1112\u1161\u11a8\u1107\u116e\u1106\u1169 \u1112\u1161\u11a8\u1107\u1175 \u1112\u1161\u11a8\u1109\u1162\u11bc \u1112\u1161\u11a8\u1109\u116e\u11af \u1112\u1161\u11a8\u1109\u1173\u11b8 \u1112\u1161\u11a8\u110b\u116d\u11bc\u1111\u116e\u11b7 \u1112\u1161\u11a8\u110b\u116f\u11ab \u1112\u1161\u11a8\u110b\u1171 \u1112\u1161\u11a8\u110c\u1161 \u1112\u1161\u11a8\u110c\u1165\u11b7 \u1112\u1161\u11ab\u1100\u1168 \u1112\u1161\u11ab\u1100\u1173\u11af \u1112\u1161\u11ab\u1101\u1165\u1107\u1165\u11ab\u110b\u1166 \u1112\u1161\u11ab\u1102\u1161\u11bd \u1112\u1161\u11ab\u1102\u116e\u11ab \u1112\u1161\u11ab\u1103\u1169\u11bc\u110b\u1161\u11ab \u1112\u1161\u11ab\u1104\u1162 \u1112\u1161\u11ab\u1105\u1161\u1109\u1161\u11ab \u1112\u1161\u11ab\u1106\u1161\u1103\u1175 \u1112\u1161\u11ab\u1106\u116e\u11ab \u1112\u1161\u11ab\u1107\u1165\u11ab \u1112\u1161\u11ab\u1107\u1169\u11a8 \u1112\u1161\u11ab\u1109\u1175\u11a8 \u1112\u1161\u11ab\u110b\u1167\u1105\u1173\u11b7 \u1112\u1161\u11ab\u110d\u1169\u11a8 \u1112\u1161\u11af\u1106\u1165\u1102\u1175 \u1112\u1161\u11af\u110b\u1161\u1107\u1165\u110c\u1175 \u1112\u1161\u11af\u110b\u1175\u11ab \u1112\u1161\u11b7\u1101\u1166 \u1112\u1161\u11b7\u1107\u116e\u1105\u1169 \u1112\u1161\u11b8\u1100\u1167\u11a8 \u1112\u1161\u11b8\u1105\u1175\u110c\u1165\u11a8 \u1112\u1161\u11bc\u1100\u1169\u11bc \u1112\u1161\u11bc\u1100\u116e \u1112\u1161\u11bc\u1109\u1161\u11bc \u1112\u1161\u11bc\u110b\u1174 \u1112\u1162\u1100\u1167\u11af \u1112\u1162\u1100\u116e\u11ab \u1112\u1162\u1103\u1161\u11b8 \u1112\u1162\u1103\u1161\u11bc \u1112\u1162\u1106\u116e\u11af \u1112\u1162\u1109\u1165\u11a8 \u1112\u1162\u1109\u1165\u11af \u1112\u1162\u1109\u116e\u110b\u116d\u11a8\u110c\u1161\u11bc \u1112\u1162\u110b\u1161\u11ab \u1112\u1162\u11a8\u1109\u1175\u11b7 \u1112\u1162\u11ab\u1103\u1173\u1107\u1162\u11a8 \u1112\u1162\u11b7\u1107\u1165\u1100\u1165 \u1112\u1162\u11ba\u1107\u1167\u11c0 \u1112\u1162\u11ba\u1109\u1161\u11af \u1112\u1162\u11bc\u1103\u1169\u11bc \u1112\u1162\u11bc\u1107\u1169\u11a8 \u1112\u1162\u11bc\u1109\u1161 \u1112\u1162\u11bc\u110b\u116e\u11ab \u1112\u1162\u11bc\u110b\u1171 \u1112\u1163\u11bc\u1100\u1175 \u1112\u1163\u11bc\u1109\u1161\u11bc \u1112\u1163\u11bc\u1109\u116e \u1112\u1165\u1105\u1161\u11a8 \u1112\u1165\u110b\u116d\u11bc \u1112\u1166\u11af\u1100\u1175 \u1112\u1167\u11ab\u1100\u116a\u11ab \u1112\u1167\u11ab\u1100\u1173\u11b7 \u1112\u1167\u11ab\u1103\u1162 \u1112\u1167\u11ab\u1109\u1161\u11bc \u1112\u1167\u11ab\u1109\u1175\u11af \u1112\u1167\u11ab\u110c\u1161\u11bc \u1112\u1167\u11ab\u110c\u1162 \u1112\u1167\u11ab\u110c\u1175 \u1112\u1167\u11af\u110b\u1162\u11a8 \u1112\u1167\u11b8\u1105\u1167\u11a8 \u1112\u1167\u11bc\u1107\u116e \u1112\u1167\u11bc\u1109\u1161 \u1112\u1167\u11bc\u1109\u116e \u1112\u1167\u11bc\u1109\u1175\u11a8 \u1112\u1167\u11bc\u110c\u1166 \u1112\u1167\u11bc\u1110\u1162 \u1112\u1167\u11bc\u1111\u1167\u11ab \u1112\u1168\u1110\u1162\u11a8 \u1112\u1169\u1100\u1175\u1109\u1175\u11b7 \u1112\u1169\u1102\u1161\u11b7 \u1112\u1169\u1105\u1161\u11bc\u110b\u1175 \u1112\u1169\u1107\u1161\u11a8 \u1112\u1169\u1110\u1166\u11af \u1112\u1169\u1112\u1173\u11b8 \u1112\u1169\u11a8\u1109\u1175 \u1112\u1169\u11af\u1105\u1169 \u1112\u1169\u11b7\u1111\u1166\u110b\u1175\u110c\u1175 \u1112\u1169\u11bc\u1107\u1169 \u1112\u1169\u11bc\u1109\u116e \u1112\u1169\u11bc\u110e\u1161 \u1112\u116a\u1106\u1167\u11ab \u1112\u116a\u1107\u116e\u11ab \u1112\u116a\u1109\u1161\u11af \u1112\u116a\u110b\u116d\u110b\u1175\u11af \u1112\u116a\u110c\u1161\u11bc \u1112\u116a\u1112\u1161\u11a8 \u1112\u116a\u11a8\u1107\u1169 \u1112\u116a\u11a8\u110b\u1175\u11ab \u1112\u116a\u11a8\u110c\u1161\u11bc \u1112\u116a\u11a8\u110c\u1165\u11bc \u1112\u116a\u11ab\u1100\u1161\u11b8 \u1112\u116a\u11ab\u1100\u1167\u11bc \u1112\u116a\u11ab\u110b\u1167\u11bc \u1112\u116a\u11ab\u110b\u1172\u11af \u1112\u116a\u11ab\u110c\u1161 \u1112\u116a\u11af\u1100\u1175 \u1112\u116a\u11af\u1103\u1169\u11bc \u1112\u116a\u11af\u1107\u1161\u11af\u1112\u1175 \u1112\u116a\u11af\u110b\u116d\u11bc \u1112\u116a\u11af\u110d\u1161\u11a8 \u1112\u116c\u1100\u1167\u11ab \u1112\u116c\u1100\u116a\u11ab \u1112\u116c\u1107\u1169\u11a8 \u1112\u116c\u1109\u1162\u11a8 \u1112\u116c\u110b\u116f\u11ab \u1112\u116c\u110c\u1161\u11bc \u1112\u116c\u110c\u1165\u11ab \u1112\u116c\u11ba\u1109\u116e \u1112\u116c\u11bc\u1103\u1161\u11ab\u1107\u1169\u1103\u1169 \u1112\u116d\u110b\u1172\u11af\u110c\u1165\u11a8 \u1112\u116e\u1107\u1161\u11ab \u1112\u116e\u110e\u116e\u11ba\u1100\u1161\u1105\u116e \u1112\u116e\u11ab\u1105\u1167\u11ab \u1112\u116f\u11af\u110a\u1175\u11ab \u1112\u1172\u1109\u1175\u11a8 \u1112\u1172\u110b\u1175\u11af \u1112\u1172\u11bc\u1102\u1162 \u1112\u1173\u1105\u1173\u11b7 \u1112\u1173\u11a8\u1107\u1162\u11a8 \u1112\u1173\u11a8\u110b\u1175\u11ab \u1112\u1173\u11ab\u110c\u1165\u11a8 \u1112\u1173\u11ab\u1112\u1175 \u1112\u1173\u11bc\u1106\u1175 \u1112\u1173\u11bc\u1107\u116e\u11ab \u1112\u1174\u1100\u1169\u11a8 \u1112\u1174\u1106\u1161\u11bc \u1112\u1174\u1109\u1162\u11bc \u1112\u1174\u11ab\u1109\u1162\u11a8 \u1112\u1175\u11b7\u1101\u1165\u11ba".split(" "),
spanish:"a\u0301baco abdomen abeja abierto abogado abono aborto abrazo abrir abuelo abuso acabar academia acceso accio\u0301n aceite acelga acento aceptar a\u0301cido aclarar acne\u0301 acoger acoso activo acto actriz actuar acudir acuerdo acusar adicto admitir adoptar adorno aduana adulto ae\u0301reo afectar aficio\u0301n afinar afirmar a\u0301gil agitar agoni\u0301a agosto agotar agregar agrio agua agudo a\u0301guila aguja ahogo ahorro aire aislar ajedrez ajeno ajuste alacra\u0301n alambre alarma alba a\u0301lbum alcalde aldea alegre alejar alerta aleta alfiler alga algodo\u0301n aliado aliento alivio alma almeja almi\u0301bar altar alteza altivo alto altura alumno alzar amable amante amapola amargo amasar a\u0301mbar a\u0301mbito ameno amigo amistad amor amparo amplio ancho anciano ancla andar ande\u0301n anemia a\u0301ngulo anillo a\u0301nimo ani\u0301s anotar antena antiguo antojo anual anular anuncio an\u0303adir an\u0303ejo an\u0303o apagar aparato apetito apio aplicar apodo aporte apoyo aprender aprobar apuesta apuro arado aran\u0303a arar a\u0301rbitro a\u0301rbol arbusto archivo arco arder ardilla arduo a\u0301rea a\u0301rido aries armoni\u0301a arne\u0301s aroma arpa arpo\u0301n arreglo arroz arruga arte artista asa asado asalto ascenso asegurar aseo asesor asiento asilo asistir asno asombro a\u0301spero astilla astro astuto asumir asunto atajo ataque atar atento ateo a\u0301tico atleta a\u0301tomo atraer atroz atu\u0301n audaz audio auge aula aumento ausente autor aval avance avaro ave avellana avena avestruz avio\u0301n aviso ayer ayuda ayuno azafra\u0301n azar azote azu\u0301car azufre azul baba babor bache bahi\u0301a baile bajar balanza balco\u0301n balde bambu\u0301 banco banda ban\u0303o barba barco barniz barro ba\u0301scula basto\u0301n basura batalla bateri\u0301a batir batuta bau\u0301l bazar bebe\u0301 bebida bello besar beso bestia bicho bien bingo blanco bloque blusa boa bobina bobo boca bocina boda bodega boina bola bolero bolsa bomba bondad bonito bono bonsa\u0301i borde borrar bosque bote boti\u0301n bo\u0301veda bozal bravo brazo brecha breve brillo brinco brisa broca broma bronce brote bruja brusco bruto buceo bucle bueno buey bufanda bufo\u0301n bu\u0301ho buitre bulto burbuja burla burro buscar butaca buzo\u0301n caballo cabeza cabina cabra cacao cada\u0301ver cadena caer cafe\u0301 cai\u0301da caima\u0301n caja cajo\u0301n cal calamar calcio caldo calidad calle calma calor calvo cama cambio camello camino campo ca\u0301ncer candil canela canguro canica canto can\u0303a can\u0303o\u0301n caoba caos capaz capita\u0301n capote captar capucha cara carbo\u0301n ca\u0301rcel careta carga carin\u0303o carne carpeta carro carta casa casco casero caspa castor catorce catre caudal causa cazo cebolla ceder cedro celda ce\u0301lebre celoso ce\u0301lula cemento ceniza centro cerca cerdo cereza cero cerrar certeza ce\u0301sped cetro chacal chaleco champu\u0301 chancla chapa charla chico chiste chivo choque choza chuleta chupar ciclo\u0301n ciego cielo cien cierto cifra cigarro cima cinco cine cinta cipre\u0301s circo ciruela cisne cita ciudad clamor clan claro clase clave cliente clima cli\u0301nica cobre coccio\u0301n cochino cocina coco co\u0301digo codo cofre coger cohete coji\u0301n cojo cola colcha colegio colgar colina collar colmo columna combate comer comida co\u0301modo compra conde conejo conga conocer consejo contar copa copia corazo\u0301n corbata corcho cordo\u0301n corona correr coser cosmos costa cra\u0301neo cra\u0301ter crear crecer crei\u0301do crema cri\u0301a crimen cripta crisis cromo cro\u0301nica croqueta crudo cruz cuadro cuarto cuatro cubo cubrir cuchara cuello cuento cuerda cuesta cueva cuidar culebra culpa culto cumbre cumplir cuna cuneta cuota cupo\u0301n cu\u0301pula curar curioso curso curva cutis dama danza dar dardo da\u0301til deber de\u0301bil de\u0301cada decir dedo defensa definir dejar delfi\u0301n delgado delito demora denso dental deporte derecho derrota desayuno deseo desfile desnudo destino desvi\u0301o detalle detener deuda di\u0301a diablo diadema diamante diana diario dibujo dictar diente dieta diez difi\u0301cil digno dilema diluir dinero directo dirigir disco disen\u0303o disfraz diva divino doble doce dolor domingo don donar dorado dormir dorso dos dosis drago\u0301n droga ducha duda duelo duen\u0303o dulce du\u0301o duque durar dureza duro e\u0301bano ebrio echar eco ecuador edad edicio\u0301n edificio editor educar efecto eficaz eje ejemplo elefante elegir elemento elevar elipse e\u0301lite elixir elogio eludir embudo emitir emocio\u0301n empate empen\u0303o empleo empresa enano encargo enchufe enci\u0301a enemigo enero enfado enfermo engan\u0303o enigma enlace enorme enredo ensayo ensen\u0303ar entero entrar envase envi\u0301o e\u0301poca equipo erizo escala escena escolar escribir escudo esencia esfera esfuerzo espada espejo espi\u0301a esposa espuma esqui\u0301 estar este estilo estufa etapa eterno e\u0301tica etnia evadir evaluar evento evitar exacto examen exceso excusa exento exigir exilio existir e\u0301xito experto explicar exponer extremo fa\u0301brica fa\u0301bula fachada fa\u0301cil factor faena faja falda fallo falso faltar fama familia famoso farao\u0301n farmacia farol farsa fase fatiga fauna favor fax febrero fecha feliz feo feria feroz fe\u0301rtil fervor festi\u0301n fiable fianza fiar fibra ficcio\u0301n ficha fideo fiebre fiel fiera fiesta figura fijar fijo fila filete filial filtro fin finca fingir finito firma flaco flauta flecha flor flota fluir flujo flu\u0301or fobia foca fogata fogo\u0301n folio folleto fondo forma forro fortuna forzar fosa foto fracaso fra\u0301gil franja frase fraude frei\u0301r freno fresa fri\u0301o frito fruta fuego fuente fuerza fuga fumar funcio\u0301n funda furgo\u0301n furia fusil fu\u0301tbol futuro gacela gafas gaita gajo gala galeri\u0301a gallo gamba ganar gancho ganga ganso garaje garza gasolina gastar gato gavila\u0301n gemelo gemir gen ge\u0301nero genio gente geranio gerente germen gesto gigante gimnasio girar giro glaciar globo gloria gol golfo goloso golpe goma gordo gorila gorra gota goteo gozar grada gra\u0301fico grano grasa gratis grave grieta grillo gripe gris grito grosor gru\u0301a grueso grumo grupo guante guapo guardia guerra gui\u0301a guin\u0303o guion guiso guitarra gusano gustar haber ha\u0301bil hablar hacer hacha hada hallar hamaca harina haz hazan\u0303a hebilla hebra hecho helado helio hembra herir hermano he\u0301roe hervir hielo hierro hi\u0301gado higiene hijo himno historia hocico hogar hoguera hoja hombre hongo honor honra hora hormiga horno hostil hoyo hueco huelga huerta hueso huevo huida huir humano hu\u0301medo humilde humo hundir huraca\u0301n hurto icono ideal idioma i\u0301dolo iglesia iglu\u0301 igual ilegal ilusio\u0301n imagen ima\u0301n imitar impar imperio imponer impulso incapaz i\u0301ndice inerte infiel informe ingenio inicio inmenso inmune innato insecto instante intere\u0301s i\u0301ntimo intuir inu\u0301til invierno ira iris ironi\u0301a isla islote jabali\u0301 jabo\u0301n jamo\u0301n jarabe jardi\u0301n jarra jaula jazmi\u0301n jefe jeringa jinete jornada joroba joven joya juerga jueves juez jugador jugo juguete juicio junco jungla junio juntar ju\u0301piter jurar justo juvenil juzgar kilo koala labio lacio lacra lado ladro\u0301n lagarto la\u0301grima laguna laico lamer la\u0301mina la\u0301mpara lana lancha langosta lanza la\u0301piz largo larva la\u0301stima lata la\u0301tex latir laurel lavar lazo leal leccio\u0301n leche lector leer legio\u0301n legumbre lejano lengua lento len\u0303a leo\u0301n leopardo lesio\u0301n letal letra leve leyenda libertad libro licor li\u0301der lidiar lienzo liga ligero lima li\u0301mite limo\u0301n limpio lince lindo li\u0301nea lingote lino linterna li\u0301quido liso lista litera litio litro llaga llama llanto llave llegar llenar llevar llorar llover lluvia lobo locio\u0301n loco locura lo\u0301gica logro lombriz lomo lonja lote lucha lucir lugar lujo luna lunes lupa lustro luto luz maceta macho madera madre maduro maestro mafia magia mago mai\u0301z maldad maleta malla malo mama\u0301 mambo mamut manco mando manejar manga maniqui\u0301 manjar mano manso manta man\u0303ana mapa ma\u0301quina mar marco marea marfil margen marido ma\u0301rmol marro\u0301n martes marzo masa ma\u0301scara masivo matar materia matiz matriz ma\u0301ximo mayor mazorca mecha medalla medio me\u0301dula mejilla mejor melena melo\u0301n memoria menor mensaje mente menu\u0301 mercado merengue me\u0301rito mes meso\u0301n meta meter me\u0301todo metro mezcla miedo miel miembro miga mil milagro militar millo\u0301n mimo mina minero mi\u0301nimo minuto miope mirar misa miseria misil mismo mitad mito mochila mocio\u0301n moda modelo moho mojar molde moler molino momento momia monarca moneda monja monto mon\u0303o morada morder moreno morir morro morsa mortal mosca mostrar motivo mover mo\u0301vil mozo mucho mudar mueble muela muerte muestra mugre mujer mula muleta multa mundo mun\u0303eca mural muro mu\u0301sculo museo musgo mu\u0301sica muslo na\u0301car nacio\u0301n nadar naipe naranja nariz narrar nasal natal nativo natural na\u0301usea naval nave navidad necio ne\u0301ctar negar negocio negro neo\u0301n nervio neto neutro nevar nevera nicho nido niebla nieto nin\u0303ez nin\u0303o ni\u0301tido nivel nobleza noche no\u0301mina noria norma norte nota noticia novato novela novio nube nuca nu\u0301cleo nudillo nudo nuera nueve nuez nulo nu\u0301mero nutria oasis obeso obispo objeto obra obrero observar obtener obvio oca ocaso oce\u0301ano ochenta ocho ocio ocre octavo octubre oculto ocupar ocurrir odiar odio odisea oeste ofensa oferta oficio ofrecer ogro oi\u0301do oi\u0301r ojo ola oleada olfato olivo olla olmo olor olvido ombligo onda onza opaco opcio\u0301n o\u0301pera opinar oponer optar o\u0301ptica opuesto oracio\u0301n orador oral o\u0301rbita orca orden oreja o\u0301rgano orgi\u0301a orgullo oriente origen orilla oro orquesta oruga osadi\u0301a oscuro osezno oso ostra oton\u0303o otro oveja o\u0301vulo o\u0301xido oxi\u0301geno oyente ozono pacto padre paella pa\u0301gina pago pai\u0301s pa\u0301jaro palabra palco paleta pa\u0301lido palma paloma palpar pan panal pa\u0301nico pantera pan\u0303uelo papa\u0301 papel papilla paquete parar parcela pared parir paro pa\u0301rpado parque pa\u0301rrafo parte pasar paseo pasio\u0301n paso pasta pata patio patria pausa pauta pavo payaso peato\u0301n pecado pecera pecho pedal pedir pegar peine pelar peldan\u0303o pelea peligro pellejo pelo peluca pena pensar pen\u0303o\u0301n peo\u0301n peor pepino pequen\u0303o pera percha perder pereza perfil perico perla permiso perro persona pesa pesca pe\u0301simo pestan\u0303a pe\u0301talo petro\u0301leo pez pezun\u0303a picar picho\u0301n pie piedra pierna pieza pijama pilar piloto pimienta pino pintor pinza pin\u0303a piojo pipa pirata pisar piscina piso pista pito\u0301n pizca placa plan plata playa plaza pleito pleno plomo pluma plural pobre poco poder podio poema poesi\u0301a poeta polen polici\u0301a pollo polvo pomada pomelo pomo pompa poner porcio\u0301n portal posada poseer posible poste potencia potro pozo prado precoz pregunta premio prensa preso previo primo pri\u0301ncipe prisio\u0301n privar proa probar proceso producto proeza profesor programa prole promesa pronto propio pro\u0301ximo prueba pu\u0301blico puchero pudor pueblo puerta puesto pulga pulir pulmo\u0301n pulpo pulso puma punto pun\u0303al pun\u0303o pupa pupila pure\u0301 quedar queja quemar querer queso quieto qui\u0301mica quince quitar ra\u0301bano rabia rabo racio\u0301n radical rai\u0301z rama rampa rancho rango rapaz ra\u0301pido rapto rasgo raspa rato rayo raza razo\u0301n reaccio\u0301n realidad reban\u0303o rebote recaer receta rechazo recoger recreo recto recurso red redondo reducir reflejo reforma refra\u0301n refugio regalo regir regla regreso rehe\u0301n reino rei\u0301r reja relato relevo relieve relleno reloj remar remedio remo rencor rendir renta reparto repetir reposo reptil res rescate resina respeto resto resumen retiro retorno retrato reunir reve\u0301s revista rey rezar rico riego rienda riesgo rifa ri\u0301gido rigor rinco\u0301n rin\u0303o\u0301n ri\u0301o riqueza risa ritmo rito rizo roble roce rociar rodar rodeo rodilla roer rojizo rojo romero romper ron ronco ronda ropa ropero rosa rosca rostro rotar rubi\u0301 rubor rudo rueda rugir ruido ruina ruleta rulo rumbo rumor ruptura ruta rutina sa\u0301bado saber sabio sable sacar sagaz sagrado sala saldo salero salir salmo\u0301n salo\u0301n salsa salto salud salvar samba sancio\u0301n sandi\u0301a sanear sangre sanidad sano santo sapo saque sardina sarte\u0301n sastre sata\u0301n sauna saxofo\u0301n seccio\u0301n seco secreto secta sed seguir seis sello selva semana semilla senda sensor sen\u0303al sen\u0303or separar sepia sequi\u0301a ser serie sermo\u0301n servir sesenta sesio\u0301n seta setenta severo sexo sexto sidra siesta siete siglo signo si\u0301laba silbar silencio silla si\u0301mbolo simio sirena sistema sitio situar sobre socio sodio sol solapa soldado soledad so\u0301lido soltar solucio\u0301n sombra sondeo sonido sonoro sonrisa sopa soplar soporte sordo sorpresa sorteo soste\u0301n so\u0301tano suave subir suceso sudor suegra suelo suen\u0303o suerte sufrir sujeto sulta\u0301n sumar superar suplir suponer supremo sur surco suren\u0303o surgir susto sutil tabaco tabique tabla tabu\u0301 taco tacto tajo talar talco talento talla talo\u0301n taman\u0303o tambor tango tanque tapa tapete tapia tapo\u0301n taquilla tarde tarea tarifa tarjeta tarot tarro tarta tatuaje tauro taza tazo\u0301n teatro techo tecla te\u0301cnica tejado tejer tejido tela tele\u0301fono tema temor templo tenaz tender tener tenis tenso teori\u0301a terapia terco te\u0301rmino ternura terror tesis tesoro testigo tetera texto tez tibio tiburo\u0301n tiempo tienda tierra tieso tigre tijera tilde timbre ti\u0301mido timo tinta ti\u0301o ti\u0301pico tipo tira tiro\u0301n tita\u0301n ti\u0301tere ti\u0301tulo tiza toalla tobillo tocar tocino todo toga toldo tomar tono tonto topar tope toque to\u0301rax torero tormenta torneo toro torpedo torre torso tortuga tos tosco toser to\u0301xico trabajo tractor traer tra\u0301fico trago traje tramo trance trato trauma trazar tre\u0301bol tregua treinta tren trepar tres tribu trigo tripa triste triunfo trofeo trompa tronco tropa trote trozo truco trueno trufa tuberi\u0301a tubo tuerto tumba tumor tu\u0301nel tu\u0301nica turbina turismo turno tutor ubicar u\u0301lcera umbral unidad unir universo uno untar un\u0303a urbano urbe urgente urna usar usuario u\u0301til utopi\u0301a uva vaca vaci\u0301o vacuna vagar vago vaina vajilla vale va\u0301lido valle valor va\u0301lvula vampiro vara variar varo\u0301n vaso vecino vector vehi\u0301culo veinte vejez vela velero veloz vena vencer venda veneno vengar venir venta venus ver verano verbo verde vereda verja verso verter vi\u0301a viaje vibrar vicio vi\u0301ctima vida vi\u0301deo vidrio viejo viernes vigor vil villa vinagre vino vin\u0303edo violi\u0301n viral virgo virtud visor vi\u0301spera vista vitamina viudo vivaz vivero vivir vivo volca\u0301n volumen volver voraz votar voto voz vuelo vulgar yacer yate yegua yema yerno yeso yodo yoga yogur zafiro zanja zapato zarza zona zorro zumo zurdo".split(" "),
chinese_simplified:"\u7684\u4e00\u662f\u5728\u4e0d\u4e86\u6709\u548c\u4eba\u8fd9\u4e2d\u5927\u4e3a\u4e0a\u4e2a\u56fd\u6211\u4ee5\u8981\u4ed6\u65f6\u6765\u7528\u4eec\u751f\u5230\u4f5c\u5730\u4e8e\u51fa\u5c31\u5206\u5bf9\u6210\u4f1a\u53ef\u4e3b\u53d1\u5e74\u52a8\u540c\u5de5\u4e5f\u80fd\u4e0b\u8fc7\u5b50\u8bf4\u4ea7\u79cd\u9762\u800c\u65b9\u540e\u591a\u5b9a\u884c\u5b66\u6cd5\u6240\u6c11\u5f97\u7ecf\u5341\u4e09\u4e4b\u8fdb\u7740\u7b49\u90e8\u5ea6\u5bb6\u7535\u529b\u91cc\u5982\u6c34\u5316\u9ad8\u81ea\u4e8c\u7406\u8d77\u5c0f\u7269\u73b0\u5b9e\u52a0\u91cf\u90fd\u4e24\u4f53\u5236\u673a\u5f53\u4f7f\u70b9\u4ece\u4e1a\u672c\u53bb\u628a\u6027\u597d\u5e94\u5f00\u5b83\u5408\u8fd8\u56e0\u7531\u5176\u4e9b\u7136\u524d\u5916\u5929\u653f\u56db\u65e5\u90a3\u793e\u4e49\u4e8b\u5e73\u5f62\u76f8\u5168\u8868\u95f4\u6837\u4e0e\u5173\u5404\u91cd\u65b0\u7ebf\u5185\u6570\u6b63\u5fc3\u53cd\u4f60\u660e\u770b\u539f\u53c8\u4e48\u5229\u6bd4\u6216\u4f46\u8d28\u6c14\u7b2c\u5411\u9053\u547d\u6b64\u53d8\u6761\u53ea\u6ca1\u7ed3\u89e3\u95ee\u610f\u5efa\u6708\u516c\u65e0\u7cfb\u519b\u5f88\u60c5\u8005\u6700\u7acb\u4ee3\u60f3\u5df2\u901a\u5e76\u63d0\u76f4\u9898\u515a\u7a0b\u5c55\u4e94\u679c\u6599\u8c61\u5458\u9769\u4f4d\u5165\u5e38\u6587\u603b\u6b21\u54c1\u5f0f\u6d3b\u8bbe\u53ca\u7ba1\u7279\u4ef6\u957f\u6c42\u8001\u5934\u57fa\u8d44\u8fb9\u6d41\u8def\u7ea7\u5c11\u56fe\u5c71\u7edf\u63a5\u77e5\u8f83\u5c06\u7ec4\u89c1\u8ba1\u522b\u5979\u624b\u89d2\u671f\u6839\u8bba\u8fd0\u519c\u6307\u51e0\u4e5d\u533a\u5f3a\u653e\u51b3\u897f\u88ab\u5e72\u505a\u5fc5\u6218\u5148\u56de\u5219\u4efb\u53d6\u636e\u5904\u961f\u5357\u7ed9\u8272\u5149\u95e8\u5373\u4fdd\u6cbb\u5317\u9020\u767e\u89c4\u70ed\u9886\u4e03\u6d77\u53e3\u4e1c\u5bfc\u5668\u538b\u5fd7\u4e16\u91d1\u589e\u4e89\u6d4e\u9636\u6cb9\u601d\u672f\u6781\u4ea4\u53d7\u8054\u4ec0\u8ba4\u516d\u5171\u6743\u6536\u8bc1\u6539\u6e05\u7f8e\u518d\u91c7\u8f6c\u66f4\u5355\u98ce\u5207\u6253\u767d\u6559\u901f\u82b1\u5e26\u5b89\u573a\u8eab\u8f66\u4f8b\u771f\u52a1\u5177\u4e07\u6bcf\u76ee\u81f3\u8fbe\u8d70\u79ef\u793a\u8bae\u58f0\u62a5\u6597\u5b8c\u7c7b\u516b\u79bb\u534e\u540d\u786e\u624d\u79d1\u5f20\u4fe1\u9a6c\u8282\u8bdd\u7c73\u6574\u7a7a\u5143\u51b5\u4eca\u96c6\u6e29\u4f20\u571f\u8bb8\u6b65\u7fa4\u5e7f\u77f3\u8bb0\u9700\u6bb5\u7814\u754c\u62c9\u6797\u5f8b\u53eb\u4e14\u7a76\u89c2\u8d8a\u7ec7\u88c5\u5f71\u7b97\u4f4e\u6301\u97f3\u4f17\u4e66\u5e03\u590d\u5bb9\u513f\u987b\u9645\u5546\u975e\u9a8c\u8fde\u65ad\u6df1\u96be\u8fd1\u77ff\u5343\u5468\u59d4\u7d20\u6280\u5907\u534a\u529e\u9752\u7701\u5217\u4e60\u54cd\u7ea6\u652f\u822c\u53f2\u611f\u52b3\u4fbf\u56e2\u5f80\u9178\u5386\u5e02\u514b\u4f55\u9664\u6d88\u6784\u5e9c\u79f0\u592a\u51c6\u7cbe\u503c\u53f7\u7387\u65cf\u7ef4\u5212\u9009\u6807\u5199\u5b58\u5019\u6bdb\u4eb2\u5feb\u6548\u65af\u9662\u67e5\u6c5f\u578b\u773c\u738b\u6309\u683c\u517b\u6613\u7f6e\u6d3e\u5c42\u7247\u59cb\u5374\u4e13\u72b6\u80b2\u5382\u4eac\u8bc6\u9002\u5c5e\u5706\u5305\u706b\u4f4f\u8c03\u6ee1\u53bf\u5c40\u7167\u53c2\u7ea2\u7ec6\u5f15\u542c\u8be5\u94c1\u4ef7\u4e25\u9996\u5e95\u6db2\u5b98\u5fb7\u968f\u75c5\u82cf\u5931\u5c14\u6b7b\u8bb2\u914d\u5973\u9ec4\u63a8\u663e\u8c08\u7f6a\u795e\u827a\u5462\u5e2d\u542b\u4f01\u671b\u5bc6\u6279\u8425\u9879\u9632\u4e3e\u7403\u82f1\u6c27\u52bf\u544a\u674e\u53f0\u843d\u6728\u5e2e\u8f6e\u7834\u4e9a\u5e08\u56f4\u6ce8\u8fdc\u5b57\u6750\u6392\u4f9b\u6cb3\u6001\u5c01\u53e6\u65bd\u51cf\u6811\u6eb6\u600e\u6b62\u6848\u8a00\u58eb\u5747\u6b66\u56fa\u53f6\u9c7c\u6ce2\u89c6\u4ec5\u8d39\u7d27\u7231\u5de6\u7ae0\u65e9\u671d\u5bb3\u7eed\u8f7b\u670d\u8bd5\u98df\u5145\u5175\u6e90\u5224\u62a4\u53f8\u8db3\u67d0\u7ec3\u5dee\u81f4\u677f\u7530\u964d\u9ed1\u72af\u8d1f\u51fb\u8303\u7ee7\u5174\u4f3c\u4f59\u575a\u66f2\u8f93\u4fee\u6545\u57ce\u592b\u591f\u9001\u7b14\u8239\u5360\u53f3\u8d22\u5403\u5bcc\u6625\u804c\u89c9\u6c49\u753b\u529f\u5df4\u8ddf\u867d\u6742\u98de\u68c0\u5438\u52a9\u5347\u9633\u4e92\u521d\u521b\u6297\u8003\u6295\u574f\u7b56\u53e4\u5f84\u6362\u672a\u8dd1\u7559\u94a2\u66fe\u7aef\u8d23\u7ad9\u7b80\u8ff0\u94b1\u526f\u5c3d\u5e1d\u5c04\u8349\u51b2\u627f\u72ec\u4ee4\u9650\u963f\u5ba3\u73af\u53cc\u8bf7\u8d85\u5fae\u8ba9\u63a7\u5dde\u826f\u8f74\u627e\u5426\u7eaa\u76ca\u4f9d\u4f18\u9876\u7840\u8f7d\u5012\u623f\u7a81\u5750\u7c89\u654c\u7565\u5ba2\u8881\u51b7\u80dc\u7edd\u6790\u5757\u5242\u6d4b\u4e1d\u534f\u8bc9\u5ff5\u9648\u4ecd\u7f57\u76d0\u53cb\u6d0b\u9519\u82e6\u591c\u5211\u79fb\u9891\u9010\u9760\u6df7\u6bcd\u77ed\u76ae\u7ec8\u805a\u6c7d\u6751\u4e91\u54ea\u65e2\u8ddd\u536b\u505c\u70c8\u592e\u5bdf\u70e7\u8fc5\u5883\u82e5\u5370\u6d32\u523b\u62ec\u6fc0\u5b54\u641e\u751a\u5ba4\u5f85\u6838\u6821\u6563\u4fb5\u5427\u7532\u6e38\u4e45\u83dc\u5473\u65e7\u6a21\u6e56\u8d27\u635f\u9884\u963b\u6beb\u666e\u7a33\u4e59\u5988\u690d\u606f\u6269\u94f6\u8bed\u6325\u9152\u5b88\u62ff\u5e8f\u7eb8\u533b\u7f3a\u96e8\u5417\u9488\u5218\u554a\u6025\u5531\u8bef\u8bad\u613f\u5ba1\u9644\u83b7\u8336\u9c9c\u7cae\u65a4\u5b69\u8131\u786b\u80a5\u5584\u9f99\u6f14\u7236\u6e10\u8840\u6b22\u68b0\u638c\u6b4c\u6c99\u521a\u653b\u8c13\u76fe\u8ba8\u665a\u7c92\u4e71\u71c3\u77db\u4e4e\u6740\u836f\u5b81\u9c81\u8d35\u949f\u7164\u8bfb\u73ed\u4f2f\u9999\u4ecb\u8feb\u53e5\u4e30\u57f9\u63e1\u5170\u62c5\u5f26\u86cb\u6c89\u5047\u7a7f\u6267\u7b54\u4e50\u8c01\u987a\u70df\u7f29\u5f81\u8138\u559c\u677e\u811a\u56f0\u5f02\u514d\u80cc\u661f\u798f\u4e70\u67d3\u4e95\u6982\u6162\u6015\u78c1\u500d\u7956\u7687\u4fc3\u9759\u8865\u8bc4\u7ffb\u8089\u8df5\u5c3c\u8863\u5bbd\u626c\u68c9\u5e0c\u4f24\u64cd\u5782\u79cb\u5b9c\u6c22\u5957\u7763\u632f\u67b6\u4eae\u672b\u5baa\u5e86\u7f16\u725b\u89e6\u6620\u96f7\u9500\u8bd7\u5ea7\u5c45\u6293\u88c2\u80de\u547c\u5a18\u666f\u5a01\u7eff\u6676\u539a\u76df\u8861\u9e21\u5b59\u5ef6\u5371\u80f6\u5c4b\u4e61\u4e34\u9646\u987e\u6389\u5440\u706f\u5c81\u63aa\u675f\u8010\u5267\u7389\u8d75\u8df3\u54e5\u5b63\u8bfe\u51ef\u80e1\u989d\u6b3e\u7ecd\u5377\u9f50\u4f1f\u84b8\u6b96\u6c38\u5b97\u82d7\u5ddd\u7089\u5ca9\u5f31\u96f6\u6768\u594f\u6cbf\u9732\u6746\u63a2\u6ed1\u9547\u996d\u6d53\u822a\u6000\u8d76\u5e93\u593a\u4f0a\u7075\u7a0e\u9014\u706d\u8d5b\u5f52\u53ec\u9f13\u64ad\u76d8\u88c1\u9669\u5eb7\u552f\u5f55\u83cc\u7eaf\u501f\u7cd6\u76d6\u6a2a\u7b26\u79c1\u52aa\u5802\u57df\u67aa\u6da6\u5e45\u54c8\u7adf\u719f\u866b\u6cfd\u8111\u58e4\u78b3\u6b27\u904d\u4fa7\u5be8\u6562\u5f7b\u8651\u659c\u8584\u5ead\u7eb3\u5f39\u9972\u4f38\u6298\u9ea6\u6e7f\u6697\u8377\u74e6\u585e\u5e8a\u7b51\u6076\u6237\u8bbf\u5854\u5947\u900f\u6881\u5200\u65cb\u8ff9\u5361\u6c2f\u9047\u4efd\u6bd2\u6ce5\u9000\u6d17\u6446\u7070\u5f69\u5356\u8017\u590f\u62e9\u5fd9\u94dc\u732e\u786c\u4e88\u7e41\u5708\u96ea\u51fd\u4ea6\u62bd\u7bc7\u9635\u9634\u4e01\u5c3a\u8ffd\u5806\u96c4\u8fce\u6cdb\u7238\u697c\u907f\u8c0b\u5428\u91ce\u732a\u65d7\u7d2f\u504f\u5178\u9986\u7d22\u79e6\u8102\u6f6e\u7237\u8c46\u5ffd\u6258\u60ca\u5851\u9057\u6108\u6731\u66ff\u7ea4\u7c97\u503e\u5c1a\u75db\u695a\u8c22\u594b\u8d2d\u78e8\u541b\u6c60\u65c1\u788e\u9aa8\u76d1\u6355\u5f1f\u66b4\u5272\u8d2f\u6b8a\u91ca\u8bcd\u4ea1\u58c1\u987f\u5b9d\u5348\u5c18\u95fb\u63ed\u70ae\u6b8b\u51ac\u6865\u5987\u8b66\u7efc\u62db\u5434\u4ed8\u6d6e\u906d\u5f90\u60a8\u6447\u8c37\u8d5e\u7bb1\u9694\u8ba2\u7537\u5439\u56ed\u7eb7\u5510\u8d25\u5b8b\u73bb\u5de8\u8015\u5766\u8363\u95ed\u6e7e\u952e\u51e1\u9a7b\u9505\u6551\u6069\u5265\u51dd\u78b1\u9f7f\u622a\u70bc\u9ebb\u7eba\u7981\u5e9f\u76db\u7248\u7f13\u51c0\u775b\u660c\u5a5a\u6d89\u7b52\u5634\u63d2\u5cb8\u6717\u5e84\u8857\u85cf\u59d1\u8d38\u8150\u5974\u5566\u60ef\u4e58\u4f19\u6062\u5300\u7eb1\u624e\u8fa9\u8033\u5f6a\u81e3\u4ebf\u7483\u62b5\u8109\u79c0\u8428\u4fc4\u7f51\u821e\u5e97\u55b7\u7eb5\u5bf8\u6c57\u6302\u6d2a\u8d3a\u95ea\u67ec\u7206\u70ef\u6d25\u7a3b\u5899\u8f6f\u52c7\u50cf\u6eda\u5398\u8499\u82b3\u80af\u5761\u67f1\u8361\u817f\u4eea\u65c5\u5c3e\u8f67\u51b0\u8d21\u767b\u9ece\u524a\u94bb\u52d2\u9003\u969c\u6c28\u90ed\u5cf0\u5e01\u6e2f\u4f0f\u8f68\u4ea9\u6bd5\u64e6\u83ab\u523a\u6d6a\u79d8\u63f4\u682a\u5065\u552e\u80a1\u5c9b\u7518\u6ce1\u7761\u7ae5\u94f8\u6c64\u9600\u4f11\u6c47\u820d\u7267\u7ed5\u70b8\u54f2\u78f7\u7ee9\u670b\u6de1\u5c16\u542f\u9677\u67f4\u5448\u5f92\u989c\u6cea\u7a0d\u5fd8\u6cf5\u84dd\u62d6\u6d1e\u6388\u955c\u8f9b\u58ee\u950b\u8d2b\u865a\u5f2f\u6469\u6cf0\u5e7c\u5ef7\u5c0a\u7a97\u7eb2\u5f04\u96b6\u7591\u6c0f\u5bab\u59d0\u9707\u745e\u602a\u5c24\u7434\u5faa\u63cf\u819c\u8fdd\u5939\u8170\u7f18\u73e0\u7a77\u68ee\u679d\u7af9\u6c9f\u50ac\u7ef3\u5fc6\u90a6\u5269\u5e78\u6d46\u680f\u62e5\u7259\u8d2e\u793c\u6ee4\u94a0\u7eb9\u7f62\u62cd\u54b1\u558a\u8896\u57c3\u52e4\u7f5a\u7126\u6f5c\u4f0d\u58a8\u6b32\u7f1d\u59d3\u520a\u9971\u4eff\u5956\u94dd\u9b3c\u4e3d\u8de8\u9ed8\u6316\u94fe\u626b\u559d\u888b\u70ad\u6c61\u5e55\u8bf8\u5f27\u52b1\u6885\u5976\u6d01\u707e\u821f\u9274\u82ef\u8bbc\u62b1\u6bc1\u61c2\u5bd2\u667a\u57d4\u5bc4\u5c4a\u8dc3\u6e21\u6311\u4e39\u8270\u8d1d\u78b0\u62d4\u7239\u6234\u7801\u68a6\u82bd\u7194\u8d64\u6e14\u54ed\u656c\u9897\u5954\u94c5\u4ef2\u864e\u7a00\u59b9\u4e4f\u73cd\u7533\u684c\u9075\u5141\u9686\u87ba\u4ed3\u9b4f\u9510\u6653\u6c2e\u517c\u9690\u788d\u8d6b\u62e8\u5fe0\u8083\u7f38\u7275\u62a2\u535a\u5de7\u58f3\u5144\u675c\u8baf\u8bda\u78a7\u7965\u67ef\u9875\u5de1\u77e9\u60b2\u704c\u9f84\u4f26\u7968\u5bfb\u6842\u94fa\u5723\u6050\u6070\u90d1\u8da3\u62ac\u8352\u817e\u8d34\u67d4\u6ef4\u731b\u9614\u8f86\u59bb\u586b\u64a4\u50a8\u7b7e\u95f9\u6270\u7d2b\u7802\u9012\u620f\u540a\u9676\u4f10\u5582\u7597\u74f6\u5a46\u629a\u81c2\u6478\u5fcd\u867e\u8721\u90bb\u80f8\u5de9\u6324\u5076\u5f03\u69fd\u52b2\u4e73\u9093\u5409\u4ec1\u70c2\u7816\u79df\u4e4c\u8230\u4f34\u74dc\u6d45\u4e19\u6682\u71e5\u6a61\u67f3\u8ff7\u6696\u724c\u79e7\u80c6\u8be6\u7c27\u8e0f\u74f7\u8c31\u5446\u5bbe\u7cca\u6d1b\u8f89\u6124\u7ade\u9699\u6012\u7c98\u4e43\u7eea\u80a9\u7c4d\u654f\u6d82\u7199\u7686\u4fa6\u60ac\u6398\u4eab\u7ea0\u9192\u72c2\u9501\u6dc0\u6068\u7272\u9738\u722c\u8d4f\u9006\u73a9\u9675\u795d\u79d2\u6d59\u8c8c\u5f79\u5f7c\u6089\u9e2d\u8d8b\u51e4\u6668\u755c\u8f88\u79e9\u5375\u7f72\u68af\u708e\u6ee9\u68cb\u9a71\u7b5b\u5ce1\u5192\u5565\u5bff\u8bd1\u6d78\u6cc9\u5e3d\u8fdf\u7845\u7586\u8d37\u6f0f\u7a3f\u51a0\u5ae9\u80c1\u82af\u7262\u53db\u8680\u5965\u9e23\u5cad\u7f8a\u51ed\u4e32\u5858\u7ed8\u9175\u878d\u76c6\u9521\u5e99\u7b79\u51bb\u8f85\u6444\u88ad\u7b4b\u62d2\u50da\u65f1\u94be\u9e1f\u6f06\u6c88\u7709\u758f\u6dfb\u68d2\u7a57\u785d\u97e9\u903c\u626d\u4fa8\u51c9\u633a\u7897\u683d\u7092\u676f\u60a3\u998f\u529d\u8c6a\u8fbd\u52c3\u9e3f\u65e6\u540f\u62dc\u72d7\u57cb\u8f8a\u63a9\u996e\u642c\u9a82\u8f9e\u52fe\u6263\u4f30\u848b\u7ed2\u96fe\u4e08\u6735\u59c6\u62df\u5b87\u8f91\u9655\u96d5\u507f\u84c4\u5d07\u526a\u5021\u5385\u54ac\u9a76\u85af\u5237\u65a5\u756a\u8d4b\u5949\u4f5b\u6d47\u6f2b\u66fc\u6247\u9499\u6843\u6276\u4ed4\u8fd4\u4fd7\u4e8f\u8154\u978b\u68f1\u8986\u6846\u6084\u53d4\u649e\u9a97\u52d8\u65fa\u6cb8\u5b64\u5410\u5b5f\u6e20\u5c48\u75be\u5999\u60dc\u4ef0\u72e0\u80c0\u8c10\u629b\u9709\u6851\u5c97\u561b\u8870\u76d7\u6e17\u810f\u8d56\u6d8c\u751c\u66f9\u9605\u808c\u54e9\u5389\u70c3\u7eac\u6bc5\u6628\u4f2a\u75c7\u716e\u53f9\u9489\u642d\u830e\u7b3c\u9177\u5077\u5f13\u9525\u6052\u6770\u5751\u9f3b\u7ffc\u7eb6\u53d9\u72f1\u902e\u7f50\u7edc\u68da\u6291\u81a8\u852c\u5bfa\u9aa4\u7a46\u51b6\u67af\u518c\u5c38\u51f8\u7ec5\u576f\u727a\u7130\u8f70\u6b23\u664b\u7626\u5fa1\u952d\u9526\u4e27\u65ec\u953b\u5784\u641c\u6251\u9080\u4ead\u916f\u8fc8\u8212\u8106\u9176\u95f2\u5fe7\u915a\u987d\u7fbd\u6da8\u5378\u4ed7\u966a\u8f9f\u60e9\u676d\u59da\u809a\u6349\u98d8\u6f02\u6606\u6b3a\u543e\u90ce\u70f7\u6c41\u5475\u9970\u8427\u96c5\u90ae\u8fc1\u71d5\u6492\u59fb\u8d74\u5bb4\u70e6\u503a\u5e10\u6591\u94c3\u65e8\u9187\u8463\u997c\u96cf\u59ff\u62cc\u5085\u8179\u59a5\u63c9\u8d24\u62c6\u6b6a\u8461\u80fa\u4e22\u6d69\u5fbd\u6602\u57ab\u6321\u89c8\u8d2a\u6170\u7f34\u6c6a\u614c\u51af\u8bfa\u59dc\u8c0a\u51f6\u52a3\u8bec\u8000\u660f\u8eba\u76c8\u9a91\u4e54\u6eaa\u4e1b\u5362\u62b9\u95f7\u54a8\u522e\u9a7e\u7f06\u609f\u6458\u94d2\u63b7\u9887\u5e7b\u67c4\u60e0\u60e8\u4f73\u4ec7\u814a\u7a9d\u6da4\u5251\u77a7\u5821\u6cfc\u8471\u7f69\u970d\u635e\u80ce\u82cd\u6ee8\u4fe9\u6345\u6e58\u780d\u971e\u90b5\u8404\u75af\u6dee\u9042\u718a\u7caa\u70d8\u5bbf\u6863\u6208\u9a73\u5ac2\u88d5\u5f99\u7bad\u6350\u80a0\u6491\u6652\u8fa8\u6bbf\u83b2\u644a\u6405\u9171\u5c4f\u75ab\u54c0\u8521\u5835\u6cab\u76b1\u7545\u53e0\u9601\u83b1\u6572\u8f96\u94a9\u75d5\u575d\u5df7\u997f\u7978\u4e18\u7384\u6e9c\u66f0\u903b\u5f6d\u5c1d\u537f\u59a8\u8247\u541e\u97e6\u6028\u77ee\u6b47".split(""),
chinese_traditional:"\u7684\u4e00\u662f\u5728\u4e0d\u4e86\u6709\u548c\u4eba\u9019\u4e2d\u5927\u70ba\u4e0a\u500b\u570b\u6211\u4ee5\u8981\u4ed6\u6642\u4f86\u7528\u5011\u751f\u5230\u4f5c\u5730\u65bc\u51fa\u5c31\u5206\u5c0d\u6210\u6703\u53ef\u4e3b\u767c\u5e74\u52d5\u540c\u5de5\u4e5f\u80fd\u4e0b\u904e\u5b50\u8aaa\u7522\u7a2e\u9762\u800c\u65b9\u5f8c\u591a\u5b9a\u884c\u5b78\u6cd5\u6240\u6c11\u5f97\u7d93\u5341\u4e09\u4e4b\u9032\u8457\u7b49\u90e8\u5ea6\u5bb6\u96fb\u529b\u88e1\u5982\u6c34\u5316\u9ad8\u81ea\u4e8c\u7406\u8d77\u5c0f\u7269\u73fe\u5be6\u52a0\u91cf\u90fd\u5169\u9ad4\u5236\u6a5f\u7576\u4f7f\u9ede\u5f9e\u696d\u672c\u53bb\u628a\u6027\u597d\u61c9\u958b\u5b83\u5408\u9084\u56e0\u7531\u5176\u4e9b\u7136\u524d\u5916\u5929\u653f\u56db\u65e5\u90a3\u793e\u7fa9\u4e8b\u5e73\u5f62\u76f8\u5168\u8868\u9593\u6a23\u8207\u95dc\u5404\u91cd\u65b0\u7dda\u5167\u6578\u6b63\u5fc3\u53cd\u4f60\u660e\u770b\u539f\u53c8\u9ebc\u5229\u6bd4\u6216\u4f46\u8cea\u6c23\u7b2c\u5411\u9053\u547d\u6b64\u8b8a\u689d\u53ea\u6c92\u7d50\u89e3\u554f\u610f\u5efa\u6708\u516c\u7121\u7cfb\u8ecd\u5f88\u60c5\u8005\u6700\u7acb\u4ee3\u60f3\u5df2\u901a\u4e26\u63d0\u76f4\u984c\u9ee8\u7a0b\u5c55\u4e94\u679c\u6599\u8c61\u54e1\u9769\u4f4d\u5165\u5e38\u6587\u7e3d\u6b21\u54c1\u5f0f\u6d3b\u8a2d\u53ca\u7ba1\u7279\u4ef6\u9577\u6c42\u8001\u982d\u57fa\u8cc7\u908a\u6d41\u8def\u7d1a\u5c11\u5716\u5c71\u7d71\u63a5\u77e5\u8f03\u5c07\u7d44\u898b\u8a08\u5225\u5979\u624b\u89d2\u671f\u6839\u8ad6\u904b\u8fb2\u6307\u5e7e\u4e5d\u5340\u5f37\u653e\u6c7a\u897f\u88ab\u5e79\u505a\u5fc5\u6230\u5148\u56de\u5247\u4efb\u53d6\u64da\u8655\u968a\u5357\u7d66\u8272\u5149\u9580\u5373\u4fdd\u6cbb\u5317\u9020\u767e\u898f\u71b1\u9818\u4e03\u6d77\u53e3\u6771\u5c0e\u5668\u58d3\u5fd7\u4e16\u91d1\u589e\u722d\u6fdf\u968e\u6cb9\u601d\u8853\u6975\u4ea4\u53d7\u806f\u4ec0\u8a8d\u516d\u5171\u6b0a\u6536\u8b49\u6539\u6e05\u7f8e\u518d\u63a1\u8f49\u66f4\u55ae\u98a8\u5207\u6253\u767d\u6559\u901f\u82b1\u5e36\u5b89\u5834\u8eab\u8eca\u4f8b\u771f\u52d9\u5177\u842c\u6bcf\u76ee\u81f3\u9054\u8d70\u7a4d\u793a\u8b70\u8072\u5831\u9b25\u5b8c\u985e\u516b\u96e2\u83ef\u540d\u78ba\u624d\u79d1\u5f35\u4fe1\u99ac\u7bc0\u8a71\u7c73\u6574\u7a7a\u5143\u6cc1\u4eca\u96c6\u6eab\u50b3\u571f\u8a31\u6b65\u7fa4\u5ee3\u77f3\u8a18\u9700\u6bb5\u7814\u754c\u62c9\u6797\u5f8b\u53eb\u4e14\u7a76\u89c0\u8d8a\u7e54\u88dd\u5f71\u7b97\u4f4e\u6301\u97f3\u773e\u66f8\u5e03\u590d\u5bb9\u5152\u9808\u969b\u5546\u975e\u9a57\u9023\u65b7\u6df1\u96e3\u8fd1\u7926\u5343\u9031\u59d4\u7d20\u6280\u5099\u534a\u8fa6\u9752\u7701\u5217\u7fd2\u97ff\u7d04\u652f\u822c\u53f2\u611f\u52de\u4fbf\u5718\u5f80\u9178\u6b77\u5e02\u514b\u4f55\u9664\u6d88\u69cb\u5e9c\u7a31\u592a\u6e96\u7cbe\u503c\u865f\u7387\u65cf\u7dad\u5283\u9078\u6a19\u5beb\u5b58\u5019\u6bdb\u89aa\u5feb\u6548\u65af\u9662\u67e5\u6c5f\u578b\u773c\u738b\u6309\u683c\u990a\u6613\u7f6e\u6d3e\u5c64\u7247\u59cb\u537b\u5c08\u72c0\u80b2\u5ee0\u4eac\u8b58\u9069\u5c6c\u5713\u5305\u706b\u4f4f\u8abf\u6eff\u7e23\u5c40\u7167\u53c3\u7d05\u7d30\u5f15\u807d\u8a72\u9435\u50f9\u56b4\u9996\u5e95\u6db2\u5b98\u5fb7\u96a8\u75c5\u8607\u5931\u723e\u6b7b\u8b1b\u914d\u5973\u9ec3\u63a8\u986f\u8ac7\u7f6a\u795e\u85dd\u5462\u5e2d\u542b\u4f01\u671b\u5bc6\u6279\u71df\u9805\u9632\u8209\u7403\u82f1\u6c27\u52e2\u544a\u674e\u53f0\u843d\u6728\u5e6b\u8f2a\u7834\u4e9e\u5e2b\u570d\u6ce8\u9060\u5b57\u6750\u6392\u4f9b\u6cb3\u614b\u5c01\u53e6\u65bd\u6e1b\u6a39\u6eb6\u600e\u6b62\u6848\u8a00\u58eb\u5747\u6b66\u56fa\u8449\u9b5a\u6ce2\u8996\u50c5\u8cbb\u7dca\u611b\u5de6\u7ae0\u65e9\u671d\u5bb3\u7e8c\u8f15\u670d\u8a66\u98df\u5145\u5175\u6e90\u5224\u8b77\u53f8\u8db3\u67d0\u7df4\u5dee\u81f4\u677f\u7530\u964d\u9ed1\u72af\u8ca0\u64ca\u8303\u7e7c\u8208\u4f3c\u9918\u5805\u66f2\u8f38\u4fee\u6545\u57ce\u592b\u5920\u9001\u7b46\u8239\u4f54\u53f3\u8ca1\u5403\u5bcc\u6625\u8077\u89ba\u6f22\u756b\u529f\u5df4\u8ddf\u96d6\u96dc\u98db\u6aa2\u5438\u52a9\u6607\u967d\u4e92\u521d\u5275\u6297\u8003\u6295\u58de\u7b56\u53e4\u5f91\u63db\u672a\u8dd1\u7559\u92fc\u66fe\u7aef\u8cac\u7ad9\u7c21\u8ff0\u9322\u526f\u76e1\u5e1d\u5c04\u8349\u885d\u627f\u7368\u4ee4\u9650\u963f\u5ba3\u74b0\u96d9\u8acb\u8d85\u5fae\u8b93\u63a7\u5dde\u826f\u8ef8\u627e\u5426\u7d00\u76ca\u4f9d\u512a\u9802\u790e\u8f09\u5012\u623f\u7a81\u5750\u7c89\u6575\u7565\u5ba2\u8881\u51b7\u52dd\u7d55\u6790\u584a\u5291\u6e2c\u7d72\u5354\u8a34\u5ff5\u9673\u4ecd\u7f85\u9e7d\u53cb\u6d0b\u932f\u82e6\u591c\u5211\u79fb\u983b\u9010\u9760\u6df7\u6bcd\u77ed\u76ae\u7d42\u805a\u6c7d\u6751\u96f2\u54ea\u65e2\u8ddd\u885b\u505c\u70c8\u592e\u5bdf\u71d2\u8fc5\u5883\u82e5\u5370\u6d32\u523b\u62ec\u6fc0\u5b54\u641e\u751a\u5ba4\u5f85\u6838\u6821\u6563\u4fb5\u5427\u7532\u904a\u4e45\u83dc\u5473\u820a\u6a21\u6e56\u8ca8\u640d\u9810\u963b\u6beb\u666e\u7a69\u4e59\u5abd\u690d\u606f\u64f4\u9280\u8a9e\u63ee\u9152\u5b88\u62ff\u5e8f\u7d19\u91ab\u7f3a\u96e8\u55ce\u91dd\u5289\u554a\u6025\u5531\u8aa4\u8a13\u9858\u5be9\u9644\u7372\u8336\u9bae\u7ce7\u65a4\u5b69\u812b\u786b\u80a5\u5584\u9f8d\u6f14\u7236\u6f38\u8840\u6b61\u68b0\u638c\u6b4c\u6c99\u525b\u653b\u8b02\u76fe\u8a0e\u665a\u7c92\u4e82\u71c3\u77db\u4e4e\u6bba\u85e5\u5be7\u9b6f\u8cb4\u9418\u7164\u8b80\u73ed\u4f2f\u9999\u4ecb\u8feb\u53e5\u8c50\u57f9\u63e1\u862d\u64d4\u5f26\u86cb\u6c89\u5047\u7a7f\u57f7\u7b54\u6a02\u8ab0\u9806\u7159\u7e2e\u5fb5\u81c9\u559c\u677e\u8173\u56f0\u7570\u514d\u80cc\u661f\u798f\u8cb7\u67d3\u4e95\u6982\u6162\u6015\u78c1\u500d\u7956\u7687\u4fc3\u975c\u88dc\u8a55\u7ffb\u8089\u8e10\u5c3c\u8863\u5bec\u63da\u68c9\u5e0c\u50b7\u64cd\u5782\u79cb\u5b9c\u6c2b\u5957\u7763\u632f\u67b6\u4eae\u672b\u61b2\u6176\u7de8\u725b\u89f8\u6620\u96f7\u92b7\u8a69\u5ea7\u5c45\u6293\u88c2\u80de\u547c\u5a18\u666f\u5a01\u7da0\u6676\u539a\u76df\u8861\u96de\u5b6b\u5ef6\u5371\u81a0\u5c4b\u9109\u81e8\u9678\u9867\u6389\u5440\u71c8\u6b72\u63aa\u675f\u8010\u5287\u7389\u8d99\u8df3\u54e5\u5b63\u8ab2\u51f1\u80e1\u984d\u6b3e\u7d39\u5377\u9f4a\u5049\u84b8\u6b96\u6c38\u5b97\u82d7\u5ddd\u7210\u5ca9\u5f31\u96f6\u694a\u594f\u6cbf\u9732\u687f\u63a2\u6ed1\u93ae\u98ef\u6fc3\u822a\u61f7\u8d95\u5eab\u596a\u4f0a\u9748\u7a05\u9014\u6ec5\u8cfd\u6b78\u53ec\u9f13\u64ad\u76e4\u88c1\u96aa\u5eb7\u552f\u9304\u83cc\u7d14\u501f\u7cd6\u84cb\u6a6b\u7b26\u79c1\u52aa\u5802\u57df\u69cd\u6f64\u5e45\u54c8\u7adf\u719f\u87f2\u6fa4\u8166\u58e4\u78b3\u6b50\u904d\u5074\u5be8\u6562\u5fb9\u616e\u659c\u8584\u5ead\u7d0d\u5f48\u98fc\u4f38\u6298\u9ea5\u6fd5\u6697\u8377\u74e6\u585e\u5e8a\u7bc9\u60e1\u6236\u8a2a\u5854\u5947\u900f\u6881\u5200\u65cb\u8de1\u5361\u6c2f\u9047\u4efd\u6bd2\u6ce5\u9000\u6d17\u64fa\u7070\u5f69\u8ce3\u8017\u590f\u64c7\u5fd9\u9285\u737b\u786c\u4e88\u7e41\u5708\u96ea\u51fd\u4ea6\u62bd\u7bc7\u9663\u9670\u4e01\u5c3a\u8ffd\u5806\u96c4\u8fce\u6cdb\u7238\u6a13\u907f\u8b00\u5678\u91ce\u8c6c\u65d7\u7d2f\u504f\u5178\u9928\u7d22\u79e6\u8102\u6f6e\u723a\u8c46\u5ffd\u6258\u9a5a\u5851\u907a\u6108\u6731\u66ff\u7e96\u7c97\u50be\u5c1a\u75db\u695a\u8b1d\u596e\u8cfc\u78e8\u541b\u6c60\u65c1\u788e\u9aa8\u76e3\u6355\u5f1f\u66b4\u5272\u8cab\u6b8a\u91cb\u8a5e\u4ea1\u58c1\u9813\u5bf6\u5348\u5875\u805e\u63ed\u70ae\u6b98\u51ac\u6a4b\u5a66\u8b66\u7d9c\u62db\u5433\u4ed8\u6d6e\u906d\u5f90\u60a8\u6416\u8c37\u8d0a\u7bb1\u9694\u8a02\u7537\u5439\u5712\u7d1b\u5510\u6557\u5b8b\u73bb\u5de8\u8015\u5766\u69ae\u9589\u7063\u9375\u51e1\u99d0\u934b\u6551\u6069\u525d\u51dd\u9e7c\u9f52\u622a\u7149\u9ebb\u7d21\u7981\u5ee2\u76db\u7248\u7de9\u6de8\u775b\u660c\u5a5a\u6d89\u7b52\u5634\u63d2\u5cb8\u6717\u838a\u8857\u85cf\u59d1\u8cbf\u8150\u5974\u5566\u6163\u4e58\u5925\u6062\u52fb\u7d17\u624e\u8faf\u8033\u5f6a\u81e3\u5104\u7483\u62b5\u8108\u79c0\u85a9\u4fc4\u7db2\u821e\u5e97\u5674\u7e31\u5bf8\u6c57\u639b\u6d2a\u8cc0\u9583\u67ec\u7206\u70ef\u6d25\u7a3b\u7246\u8edf\u52c7\u50cf\u6efe\u5398\u8499\u82b3\u80af\u5761\u67f1\u76ea\u817f\u5100\u65c5\u5c3e\u8ecb\u51b0\u8ca2\u767b\u9ece\u524a\u947d\u52d2\u9003\u969c\u6c28\u90ed\u5cf0\u5e63\u6e2f\u4f0f\u8ecc\u755d\u7562\u64e6\u83ab\u523a\u6d6a\u79d8\u63f4\u682a\u5065\u552e\u80a1\u5cf6\u7518\u6ce1\u7761\u7ae5\u9444\u6e6f\u95a5\u4f11\u532f\u820d\u7267\u7e5e\u70b8\u54f2\u78f7\u7e3e\u670b\u6de1\u5c16\u555f\u9677\u67f4\u5448\u5f92\u984f\u6dda\u7a0d\u5fd8\u6cf5\u85cd\u62d6\u6d1e\u6388\u93e1\u8f9b\u58ef\u92d2\u8ca7\u865b\u5f4e\u6469\u6cf0\u5e7c\u5ef7\u5c0a\u7a97\u7db1\u5f04\u96b8\u7591\u6c0f\u5bae\u59d0\u9707\u745e\u602a\u5c24\u7434\u5faa\u63cf\u819c\u9055\u593e\u8170\u7de3\u73e0\u7aae\u68ee\u679d\u7af9\u6e9d\u50ac\u7e69\u61b6\u90a6\u5269\u5e78\u6f3f\u6b04\u64c1\u7259\u8caf\u79ae\u6ffe\u9209\u7d0b\u7f77\u62cd\u54b1\u558a\u8896\u57c3\u52e4\u7f70\u7126\u6f5b\u4f0d\u58a8\u6b32\u7e2b\u59d3\u520a\u98fd\u4eff\u734e\u92c1\u9b3c\u9e97\u8de8\u9ed8\u6316\u93c8\u6383\u559d\u888b\u70ad\u6c61\u5e55\u8af8\u5f27\u52f5\u6885\u5976\u6f54\u707d\u821f\u9451\u82ef\u8a1f\u62b1\u6bc0\u61c2\u5bd2\u667a\u57d4\u5bc4\u5c46\u8e8d\u6e21\u6311\u4e39\u8271\u8c9d\u78b0\u62d4\u7239\u6234\u78bc\u5922\u82bd\u7194\u8d64\u6f01\u54ed\u656c\u9846\u5954\u925b\u4ef2\u864e\u7a00\u59b9\u4e4f\u73cd\u7533\u684c\u9075\u5141\u9686\u87ba\u5009\u9b4f\u92b3\u66c9\u6c2e\u517c\u96b1\u7919\u8d6b\u64a5\u5fe0\u8085\u7f38\u727d\u6436\u535a\u5de7\u6bbc\u5144\u675c\u8a0a\u8aa0\u78a7\u7965\u67ef\u9801\u5de1\u77e9\u60b2\u704c\u9f61\u502b\u7968\u5c0b\u6842\u92ea\u8056\u6050\u6070\u912d\u8da3\u62ac\u8352\u9a30\u8cbc\u67d4\u6ef4\u731b\u95ca\u8f1b\u59bb\u586b\u64a4\u5132\u7c3d\u9b27\u64fe\u7d2b\u7802\u905e\u6232\u540a\u9676\u4f10\u9935\u7642\u74f6\u5a46\u64ab\u81c2\u6478\u5fcd\u8766\u881f\u9130\u80f8\u978f\u64e0\u5076\u68c4\u69fd\u52c1\u4e73\u9127\u5409\u4ec1\u721b\u78da\u79df\u70cf\u8266\u4f34\u74dc\u6dfa\u4e19\u66ab\u71e5\u6a61\u67f3\u8ff7\u6696\u724c\u79e7\u81bd\u8a73\u7c27\u8e0f\u74f7\u8b5c\u5446\u8cd3\u7cca\u6d1b\u8f1d\u61a4\u7af6\u9699\u6012\u7c98\u4e43\u7dd2\u80a9\u7c4d\u654f\u5857\u7199\u7686\u5075\u61f8\u6398\u4eab\u7cfe\u9192\u72c2\u9396\u6dc0\u6068\u7272\u9738\u722c\u8cde\u9006\u73a9\u9675\u795d\u79d2\u6d59\u8c8c\u5f79\u5f7c\u6089\u9d28\u8da8\u9cf3\u6668\u755c\u8f29\u79e9\u5375\u7f72\u68af\u708e\u7058\u68cb\u9a45\u7be9\u5cfd\u5192\u5565\u58fd\u8b6f\u6d78\u6cc9\u5e3d\u9072\u77fd\u7586\u8cb8\u6f0f\u7a3f\u51a0\u5ae9\u8105\u82af\u7262\u53db\u8755\u5967\u9cf4\u5dba\u7f8a\u6191\u4e32\u5858\u7e6a\u9175\u878d\u76c6\u932b\u5edf\u7c4c\u51cd\u8f14\u651d\u8972\u7b4b\u62d2\u50da\u65f1\u9240\u9ce5\u6f06\u6c88\u7709\u758f\u6dfb\u68d2\u7a57\u785d\u97d3\u903c\u626d\u50d1\u6dbc\u633a\u7897\u683d\u7092\u676f\u60a3\u993e\u52f8\u8c6a\u907c\u52c3\u9d3b\u65e6\u540f\u62dc\u72d7\u57cb\u8f25\u63a9\u98f2\u642c\u7f75\u8fad\u52fe\u6263\u4f30\u8523\u7d68\u9727\u4e08\u6735\u59c6\u64ec\u5b87\u8f2f\u965d\u96d5\u511f\u84c4\u5d07\u526a\u5021\u5ef3\u54ac\u99db\u85af\u5237\u65a5\u756a\u8ce6\u5949\u4f5b\u6f86\u6f2b\u66fc\u6247\u9223\u6843\u6276\u4ed4\u8fd4\u4fd7\u8667\u8154\u978b\u68f1\u8986\u6846\u6084\u53d4\u649e\u9a19\u52d8\u65fa\u6cb8\u5b64\u5410\u5b5f\u6e20\u5c48\u75be\u5999\u60dc\u4ef0\u72e0\u8139\u8ae7\u62cb\u9ef4\u6851\u5d17\u561b\u8870\u76dc\u6ef2\u81df\u8cf4\u6e67\u751c\u66f9\u95b1\u808c\u54e9\u53b2\u70f4\u7def\u6bc5\u6628\u507d\u75c7\u716e\u5606\u91d8\u642d\u8396\u7c60\u9177\u5077\u5f13\u9310\u6046\u5091\u5751\u9f3b\u7ffc\u7db8\u6558\u7344\u902e\u7f50\u7d61\u68da\u6291\u81a8\u852c\u5bfa\u9a5f\u7a46\u51b6\u67af\u518a\u5c4d\u51f8\u7d33\u576f\u72a7\u7130\u8f5f\u6b23\u6649\u7626\u79a6\u9320\u9326\u55aa\u65ec\u935b\u58df\u641c\u64b2\u9080\u4ead\u916f\u9081\u8212\u8106\u9176\u9592\u6182\u915a\u9811\u7fbd\u6f32\u5378\u4ed7\u966a\u95e2\u61f2\u676d\u59da\u809a\u6349\u98c4\u6f02\u6606\u6b3a\u543e\u90ce\u70f7\u6c41\u5475\u98fe\u856d\u96c5\u90f5\u9077\u71d5\u6492\u59fb\u8d74\u5bb4\u7169\u50b5\u5e33\u6591\u9234\u65e8\u9187\u8463\u9905\u96db\u59ff\u62cc\u5085\u8179\u59a5\u63c9\u8ce2\u62c6\u6b6a\u8461\u80fa\u4e1f\u6d69\u5fbd\u6602\u588a\u64cb\u89bd\u8caa\u6170\u7e73\u6c6a\u614c\u99ae\u8afe\u59dc\u8abc\u5147\u52a3\u8aa3\u8000\u660f\u8eba\u76c8\u9a0e\u55ac\u6eaa\u53e2\u76e7\u62b9\u60b6\u8aee\u522e\u99d5\u7e9c\u609f\u6458\u927a\u64f2\u9817\u5e7b\u67c4\u60e0\u6158\u4f73\u4ec7\u81d8\u7aa9\u6ecc\u528d\u77a7\u5821\u6f51\u8525\u7f69\u970d\u6488\u80ce\u84bc\u6ff1\u5006\u6345\u6e58\u780d\u971e\u90b5\u8404\u760b\u6dee\u9042\u718a\u7cde\u70d8\u5bbf\u6a94\u6208\u99c1\u5ac2\u88d5\u5f99\u7bad\u6350\u8178\u6490\u66ec\u8fa8\u6bbf\u84ee\u6524\u652a\u91ac\u5c4f\u75ab\u54c0\u8521\u5835\u6cab\u76ba\u66a2\u758a\u95a3\u840a\u6572\u8f44\u9264\u75d5\u58e9\u5df7\u9913\u798d\u4e18\u7384\u6e9c\u66f0\u908f\u5f6d\u5617\u537f\u59a8\u8247\u541e\u97cb\u6028\u77ee\u6b47".split("")};var Mnemonic=function(a){function b(b){binaryString="";for(var c=0;c<b.length;c++)binaryString+=d(parseInt(b[c],16).toString(2),4);return binaryString}function d(b,c){for(b=b.toString();b.length<c;)b="0"+b;return b}var f=this,e=[],q=function(b){var c=new sjcl.misc.hmac(b,sjcl.hash.sha512);this.encrypt=function(){return c.encrypt.apply(c,arguments)}};f.generate=function(b){b=b||128;var c=b%32;if(0<c)throw"Strength should be divisible by 32, but it is not ("+c+").";if(!("crypto"in window&&null!==window.crypto))throw"Mnemonic should be generated with strong randomness, but crypto.getRandomValues is unavailable";
b=new Uint8Array(b/8);b=crypto.getRandomValues(b);return f.toMnemonic(b)};f.toMnemonic=function(a){if(0<a.length%4)throw"Data length in bits should be divisible by 32, but it is not ("+a.length+" bytes = "+8*a.length+" bits).";for(var c=[],l=0;l<a.length/4;l++)v=0,v+=a[4*l+0]<<24,v+=a[4*l+1]<<16,v+=a[4*l+2]<<8,v+=a[4*l+3]<<0,c.push(v);for(var c=sjcl.hash.sha256.hash(c),c=sjcl.codec.hex.fromBits(c),l="",g=0;g<a.length;g++)l+=d(a[g].toString(2),8);a=d(b(c),256).substring(0,8*a.length/32);a=l+a;c=[];
l=a.length/11;for(g=0;g<l;g++){var h=parseInt(a.substring(11*g,11*(g+1)),2);c.push(e[h])}return f.joinWords(c)};f.check=function(a){a=f.splitWords(a);if(0==a.length||0<a.length%3)return!1;for(var c=[],l=0;l<a.length;l++){var g=e.indexOf(a[l]);if(-1==g)return!1;g=d(g.toString(2),11);c.push(g)}c=c.join("");a=c.length;for(var l=c.substring(0,a/33*32),c=c.substring(a-a/33,a),g=l.length/32,h=[],r=0;r<g;r++){var k=l.substring(0,32),k=parseInt(k,2);h.push(k);l=l.slice(32)}l=sjcl.hash.sha256.hash(h);l=sjcl.codec.hex.fromBits(l);
a=d(b(l),256).substring(0,a/33);return c==a};f.toSeed=function(b,c){c=c||"";b=f.joinWords(f.splitWords(b));var a=f.normalizeString(b);c=f.normalizeString(c);c="mnemonic"+c;var a=sjcl.codec.utf8String.toBits(a),d=sjcl.codec.utf8String.toBits(c),a=sjcl.misc.pbkdf2(a,d,2048,512,q);return sjcl.codec.hex.fromBits(a)};f.splitWords=function(b){return b.split(/\s/g).filter(function(b){return b.length})};f.joinWords=function(b){var c=" ";"japanese"==a&&(c="\u3000");return b.join(c)};f.normalizeString=function(b){return b.normalize("NFKD")};
e=WORDLISTS[a];if(2048!=e.length)throw err="Wordlist should contain 2048 words, but it contains "+e.length+" words.",err;};(function(a){function b(c,a,g){if(g!==d)return c instanceof b?c:"undefined"===typeof c?f:b.parse(c);for(c=c||[];c.length&&!c[c.length-1];)--c.length;this._d=c;this._s=c.length?a||1:0}var d={};b._construct=function(c,a){return new b(c,a,d)};b.base=1E7;b.base_log10=7;var f=new b([],0,d);b.ZERO=f;var e=new b([1],1,d);b.ONE=e;var q=new b(e._d,-1,d);b.M_ONE=q;b._0=f;b._1=e;b.small=[f,e,new b([2],1,d),new b([3],1,d),new b([4],1,d),new b([5],1,d),new b([6],1,d),new b([7],1,d),new b([8],1,d),new b([9],1,
d),new b([10],1,d),new b([11],1,d),new b([12],1,d),new b([13],1,d),new b([14],1,d),new b([15],1,d),new b([16],1,d),new b([17],1,d),new b([18],1,d),new b([19],1,d),new b([20],1,d),new b([21],1,d),new b([22],1,d),new b([23],1,d),new b([24],1,d),new b([25],1,d),new b([26],1,d),new b([27],1,d),new b([28],1,d),new b([29],1,d),new b([30],1,d),new b([31],1,d),new b([32],1,d),new b([33],1,d),new b([34],1,d),new b([35],1,d),new b([36],1,d)];b.digits="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");b.prototype.toString=
function(c){c=+c||10;if(2>c||36<c)throw Error("illegal radix "+c+".");if(0===this._s)return"0";if(10===c){c=0>this._s?"-":"";c+=this._d[this._d.length-1].toString();for(var a=this._d.length-2;0<=a;a--){for(var d=this._d[a].toString();7>d.length;)d="0"+d;c+=d}return c}a=b.digits;c=b.small[c];for(var d=this._s,h=this.abs(),f=[],k;0!==h._s;)k=h.divRem(c),h=k[0],k=k[1],f.push(a[k.valueOf()]);return(0>d?"-":"")+f.reverse().join("")};b.radixRegex=[/^$/,/^$/,/^[01]*$/,/^[012]*$/,/^[0-3]*$/,/^[0-4]*$/,/^[0-5]*$/,
/^[0-6]*$/,/^[0-7]*$/,/^[0-8]*$/,/^[0-9]*$/,/^[0-9aA]*$/,/^[0-9abAB]*$/,/^[0-9abcABC]*$/,/^[0-9a-dA-D]*$/,/^[0-9a-eA-E]*$/,/^[0-9a-fA-F]*$/,/^[0-9a-gA-G]*$/,/^[0-9a-hA-H]*$/,/^[0-9a-iA-I]*$/,/^[0-9a-jA-J]*$/,/^[0-9a-kA-K]*$/,/^[0-9a-lA-L]*$/,/^[0-9a-mA-M]*$/,/^[0-9a-nA-N]*$/,/^[0-9a-oA-O]*$/,/^[0-9a-pA-P]*$/,/^[0-9a-qA-Q]*$/,/^[0-9a-rA-R]*$/,/^[0-9a-sA-S]*$/,/^[0-9a-tA-T]*$/,/^[0-9a-uA-U]*$/,/^[0-9a-vA-V]*$/,/^[0-9a-wA-W]*$/,/^[0-9a-xA-X]*$/,/^[0-9a-yA-Y]*$/,/^[0-9a-zA-Z]*$/];b.parse=function(c,a){function l(b){b=
b.replace(/\s*[*xX]\s*10\s*(\^|\*\*)\s*/,"e");return b.replace(/^([+\-])?(\d+)\.?(\d*)[eE]([+\-]?\d+)$/,function(b,c,a,d,l){l=+l;var g=0>l,h=a.length+l;b=(g?a:d).length;l=(l=Math.abs(l))>=b?l-b+g:0;b=Array(l+1).join("0");a+=d;return(c||"")+(g?a=b+a:a+=b).substr(0,h+=g?b.length:0)+(h<a.length?"."+a.substr(h):"")})}c=c.toString();if("undefined"===typeof a||10===+a)c=l(c);var h=(new RegExp("^([+\\-]?)("+("undefined"===typeof a?"0[xcb]":16==a?"0x":8==a?"0c":2==a?"0b":"")+")?([0-9a-z]*)(?:\\.\\d*)?$",
"i")).exec(c);if(h){var e=h[1]||"+",k=h[2]||"",h=h[3]||"";if("undefined"===typeof a)a="0x"===k||"0X"===k?16:"0c"===k||"0C"===k?8:"0b"===k||"0B"===k?2:10;else if(2>a||36<a)throw Error("Illegal radix "+a+".");a=+a;if(!b.radixRegex[a].test(h))throw Error("Bad digit for radix "+a);h=h.replace(/^0+/,"").split("");if(0===h.length)return f;e="-"===e?-1:1;if(10==a){for(k=[];7<=h.length;)k.push(parseInt(h.splice(h.length-b.base_log10,b.base_log10).join(""),10));k.push(parseInt(h.join(""),10));return new b(k,
e,d)}k=f;a=b.small[a];for(var n=b.small,m=0;m<h.length;m++)k=k.multiply(a).add(n[parseInt(h[m],36)]);return new b(k._d,e,d)}throw Error("Invalid BigInteger format: "+c);};b.prototype.add=function(c){if(0===this._s)return b(c);c=b(c);if(0===c._s)return this;if(this._s!==c._s)return c=c.negate(),this.subtract(c);var a=this._d;c=c._d;for(var g=a.length,h=c.length,f=Array(Math.max(g,h)+1),k=Math.min(g,h),e=0,m=0;m<k;m++)e=a[m]+c[m]+e,f[m]=e%1E7,e=e/1E7|0;h>g&&(a=c,g=h);for(m=k;e&&m<g;m++)e=a[m]+e,f[m]=
e%1E7,e=e/1E7|0;for(e&&(f[m]=e);m<g;m++)f[m]=a[m];return new b(f,this._s,d)};b.prototype.negate=function(){return new b(this._d,-this._s|0,d)};b.prototype.abs=function(){return 0>this._s?this.negate():this};b.prototype.subtract=function(c){if(0===this._s)return b(c).negate();c=b(c);if(0===c._s)return this;if(this._s!==c._s)return c=c.negate(),this.add(c);var a=this;0>this._s&&(a=new b(c._d,1,d),c=new b(this._d,1,d));var g=a.compareAbs(c);if(0===g)return f;if(0>g){var h=c;c=a;a=h}a=a._d;c=c._d;var h=
a.length,e=c.length,k=Array(h),n=0,m,p;for(m=0;m<e;m++)p=a[m]-n-c[m],0>p?(p+=1E7,n=1):n=0,k[m]=p;for(m=e;m<h;m++){p=a[m]-n;if(0>p)p+=1E7;else{k[m++]=p;break}k[m]=p}for(;m<h;m++)k[m]=a[m];return new b(k,g,d)};(function(){function c(c,a){for(var l=c._d,g=l.slice(),h=0;;){var f=(l[h]||0)+1;g[h]=f%1E7;if(9999999>=f)break;++h}return new b(g,a,d)}function a(c,a){for(var l=c._d,g=l.slice(),h=0;;){var f=(l[h]||0)-1;if(0>f)g[h]=f+1E7;else{g[h]=f;break}++h}return new b(g,a,d)}b.prototype.next=function(){switch(this._s){case 0:return e;
case -1:return a(this,-1);default:return c(this,1)}};b.prototype.prev=function(){switch(this._s){case 0:return q;case -1:return c(this,-1);default:return a(this,1)}}})();b.prototype.compareAbs=function(c){if(this===c)return 0;if(!(c instanceof b)){if(!isFinite(c))return isNaN(c)?c:-1;c=b(c)}if(0===this._s)return 0!==c._s?-1:0;if(0===c._s)return 1;var a=this._d.length,d=c._d.length;if(a<d)return-1;if(a>d)return 1;d=this._d;c=c._d;for(--a;0<=a;a--)if(d[a]!==c[a])return d[a]<c[a]?-1:1;return 0};b.prototype.compare=
function(c){if(this===c)return 0;c=b(c);return 0===this._s?-c._s:this._s===c._s?this.compareAbs(c)*this._s:this._s};b.prototype.isUnit=function(){return this===e||this===q||1===this._d.length&&1===this._d[0]};b.prototype.multiply=function(c){if(0===this._s)return f;c=b(c);if(0===c._s)return f;if(this.isUnit())return 0>this._s?c.negate():c;if(c.isUnit())return 0>c._s?this.negate():this;if(this===c)return this.square();var a=this._d.length>=c._d.length,g=(a?this:c)._d,a=(a?c:this)._d,h=g.length,e=a.length,
k=h+e,n=Array(k),m;for(m=0;m<k;m++)n[m]=0;for(m=0;m<e;m++){for(var k=0,p=a[m],q=h+m,A,B=m;B<q;B++)A=n[B]+p*g[B-m]+k,k=A/1E7|0,n[B]=A%1E7|0;k&&(A=n[B]+k,n[B]=A%1E7)}return new b(n,this._s*c._s,d)};b.prototype.multiplySingleDigit=function(c){if(0===c||0===this._s)return f;if(1===c)return this;var a;if(1===this._d.length)return a=this._d[0]*c,1E7<=a?new b([a%1E7|0,a/1E7|0],1,d):new b([a],1,d);if(2===c)return this.add(this);if(this.isUnit())return new b([c],1,d);var g=this._d,h=g.length;a=h+1;for(var e=
Array(a),k=0;k<a;k++)e[k]=0;for(var n=k=0;n<h;n++)a=c*g[n]+k,k=a/1E7|0,e[n]=a%1E7|0;k&&(e[n]=k);return new b(e,1,d)};b.prototype.square=function(){if(0===this._s)return f;if(this.isUnit())return e;var c=this._d,a=c.length,g=Array(a+a+1),h,r,k,n;for(n=0;n<a;n++)k=2*n,h=c[n]*c[n],r=h/1E7|0,g[k]=h%1E7,g[k+1]=r;for(n=0;n<a;n++){r=0;k=2*n+1;for(var m=n+1;m<a;m++,k++)h=c[m]*c[n]*2+g[k]+r,r=h/1E7|0,g[k]=h%1E7;k=a+n;h=r+g[k];r=h/1E7|0;g[k]=h%1E7;g[k+1]+=r}return new b(g,1,d)};b.prototype.quotient=function(b){return this.divRem(b)[0]};
b.prototype.divide=b.prototype.quotient;b.prototype.remainder=function(b){return this.divRem(b)[1]};b.prototype.divRem=function(a){a=b(a);if(0===a._s)throw Error("Divide by zero");if(0===this._s)return[f,f];if(1===a._d.length)return this.divRemSmall(a._s*a._d[0]);switch(this.compareAbs(a)){case 0:return[this._s===a._s?e:q,f];case -1:return[f,this]}for(var c=this._s*a._s,g=a.abs(),h=this._d,r=h.length,k=[],n,m=new b([],0,d);r;)if(m._d.unshift(h[--r]),m=new b(m._d,1,d),0>m.compareAbs(a))k.push(0);else{if(0===
m._s)n=0;else{var p=m._d.length;n=g._d.length;p=1E7*m._d[p-1]+m._d[p-2];n=1E7*g._d[n-1]+g._d[n-2];m._d.length>g._d.length&&(p=1E7*(p+1));n=Math.ceil(p/n)}do{p=g.multiplySingleDigit(n);if(0>=p.compareAbs(m))break;n--}while(n);k.push(n);n&&(n=m.subtract(p),m._d=n._d.slice())}return[new b(k.reverse(),c,d),new b(m._d,this._s,d)]};b.prototype.divRemSmall=function(a){a=+a;if(0===a)throw Error("Divide by zero");var c=this._s*(0>a?-1:1);a=Math.abs(a);if(1>a||1E7<=a)throw Error("Argument out of range");if(0===
this._s)return[f,f];if(1===a||-1===a)return[1===c?this.abs():new b(this._d,c,d),f];if(1===this._d.length){var g=new b([this._d[0]/a|0],1,d);a=new b([this._d[0]%a|0],1,d);0>c&&(g=g.negate());0>this._s&&(a=a.negate());return[g,a]}for(var h=this._d.slice(),g=Array(h.length),e=0,k=0,n=0,m;h.length;)e=1E7*e+h[h.length-1],e<a?(g[n++]=0,h.pop(),k=1E7*k+e):(m=0===e?0:e/a|0,k=e-a*m,(g[n++]=m)?(h.pop(),e=k):h.pop());a=new b([k],1,d);0>this._s&&(a=a.negate());return[new b(g.reverse(),c,d),a]};b.prototype.isEven=
function(){var a=this._d;return 0===this._s||0===a.length||0===a[0]%2};b.prototype.isOdd=function(){return!this.isEven()};b.prototype.sign=function(){return this._s};b.prototype.isPositive=function(){return 0<this._s};b.prototype.isNegative=function(){return 0>this._s};b.prototype.isZero=function(){return 0===this._s};b.prototype.exp10=function(a){a=+a;if(0===a)return this;if(Math.abs(a)>Number(p))throw Error("exponent too large in BigInteger.exp10");if(0===this._s)return f;if(0<a){for(var c=new b(this._d.slice(),
this._s,d);7<=a;a-=7)c._d.unshift(0);if(0==a)return c;c._s=1;c=c.multiplySingleDigit(Math.pow(10,a));return 0>this._s?c.negate():c}if(-a>=7*this._d.length)return f;c=new b(this._d.slice(),this._s,d);for(a=-a;7<=a;a-=7)c._d.shift();return 0==a?c:c.divRemSmall(Math.pow(10,a))[0]};b.prototype.pow=function(a){if(this.isUnit())return 0<this._s?this:b(a).isOdd()?this:this.negate();a=b(a);if(0===a._s)return e;if(0>a._s){if(0===this._s)throw Error("Divide by zero");return f}if(0===this._s)return f;if(a.isUnit())return this;
if(0<a.compareAbs(p))throw Error("exponent too large in BigInteger.pow");for(var c=this,d=e,h=b.small[2];a.isPositive()&&(!a.isOdd()||(d=d.multiply(c),!a.isUnit()));)c=c.square(),a=a.quotient(h);return d};b.prototype.modPow=function(a,d){for(var c=e,h=this;a.isPositive();)a.isOdd()&&(c=c.multiply(h).remainder(d)),a=a.quotient(b.small[2]),a.isPositive()&&(h=h.square().remainder(d));return c};b.prototype.log=function(){switch(this._s){case 0:return-Infinity;case -1:return NaN}var a=this._d.length;if(30>
7*a)return Math.log(this.valueOf());var f=Math.ceil(30/7),g=this._d.slice(a-f);return Math.log((new b(g,1,d)).valueOf())+(a-f)*Math.log(1E7)};b.prototype.valueOf=function(){return parseInt(this.toString(),10)};b.prototype.toJSValue=function(){return parseInt(this.toString(),10)};var p=b(2147483647);b.MAX_EXP=p;(function(){function a(a){return function(c){return a.call(b(c))}}function d(a){return function(c,d){return a.call(b(c),b(d))}}function f(a){return function(c,d,h){return a.call(b(c),b(d),b(h))}}
(function(){var c,g,e="toJSValue isEven isOdd sign isZero isNegative abs isUnit square negate isPositive toString next prev log".split(" "),l="compare remainder divRem subtract add quotient divide multiply pow compareAbs".split(" "),m=["modPow"];for(c=0;c<e.length;c++)g=e[c],b[g]=a(b.prototype[g]);for(c=0;c<l.length;c++)g=l[c],b[g]=d(b.prototype[g]);for(c=0;c<m.length;c++)g=m[c],b[g]=f(b.prototype[g]);b.exp10=function(a,c){return b(a).exp10(c)}})()})();a.BigInteger=b})("undefined"!==typeof exports?
exports:this);(function(){function a(a){var b=Math.pow(2,31);if("m"!=a[0])return"First character must be 'm'";if(1<a.length){if("/"!=a[1])return"Separator must be '/'";a=a.split("/");if(255<a.length)return"Derivation depth is "+a.length+", must be less than 255";for(var c=1;c<a.length;c++){var d=a[c],f=d.replace(/^[0-9]+'?$/g,"");if(0<f.length)return"Invalid characters "+f+" found at depth "+c;d=parseInt(d.replace("'",""));if(isNaN(c))return"Invalid number at depth "+c;if(d>b)return"Value of "+d+" at depth "+c+
" must be less than "+b}}return!1}function b(a){a=q.normalizeString(a);var b=d(a);if(0==b.length)return"Blank mnemonic";for(var c=0;c<b.length;c++){var e=b[c],p=f(a);if(-1==WORDLISTS[p].indexOf(e)){console.log("Finding closest match to "+e);a:{a=e;for(var p=WORDLISTS[p],b=99,c=p[0],k=0;k<p.length;k++){var n=p[k];if(0==n.indexOf(a)){a=n;break a}var m=Levenshtein.get(a,n);m<b&&(c=n,b=m)}a=c}return e+" not in wordlist, did you mean "+a+"?"}}e=b.join("japanese"==p?"\u3000":" ");return q.check(e)?!1:"Invalid mnemonic"}
function d(a){a=a.split(/\s/g);for(var b=[],c=0;c<a.length;c++){var d=a[c];0<d.length&&b.push(d)}return b}function f(a){var b="";if(0<a.length){a=d(a);var c={};for(k in WORDLISTS){for(var e=c[k]=0;e<a.length;e++)-1<WORDLISTS[k].indexOf(a[e])&&c[k]++;var f=0,e=[],k;for(k in c){var n=c[k];n>f?(f=n,e=[k]):n==f&&e.push(k)}}0<e.length&&(b=e[0],1<e.length&&(console.warn("Multiple possible languages"),console.warn(e)))}0==b.length&&(b="english");return b}var e={english:new Mnemonic("english")},q=e.english,
p=bitcoinjs.bitcoin.networks.bitcoin;window.bip39.getLanguage=f;window.bip39.getHDKey=function(c,d,g){var h=f(c);h in e||(e[h]=new Mnemonic(h));q=e[h];if(h=b(c))return console.log(h),!1;c=q.toSeed(c,d);c=bitcoinjs.bitcoin.HDNode.fromSeedHex(c,p);if(h=a(g))console.log(h);else{g=g.split("/");for(d=0;d<g.length;d++){var l=g[d],h=parseInt(l);if(!isNaN(h)){var l="'"==l[l.length-1],k=!c.isNeutered();c=l&&!k?null:l?c.deriveHardened(h):c.derive(h)}}return c}};window.bip39.getPrivate=function(a,b){return(""==
b?a:a.derive(b)).keyPair.toWIF()};window.bip39.getAddress=function(a,b,d){d=d||"D";a=""==b?a:a.derive(b);b=a.keyPair.getAddress().toString();"dgb"==d&&(b=bitcoinjs.bitcoin.crypto.hash160(a.getPublicKeyBuffer()),b=bitcoinjs.bitcoin.script.witnessPubKeyHash.output.encode(b),b=bitcoinjs.bitcoin.address.fromOutputScript(b,p));if("S"==d||"3"==d)b=bitcoinjs.bitcoin.crypto.hash160(a.getPublicKeyBuffer()),d=bitcoinjs.bitcoin.script.witnessPubKeyHash.output.encode(b),d=bitcoinjs.bitcoin.crypto.hash160(d),
b=bitcoinjs.bitcoin.script.scriptHash.output.encode(d),b=bitcoinjs.bitcoin.address.fromOutputScript(b,p);return b};window.bip39.findPhraseErrors=b;window.bip39.getHDKeyFromXPrv=function(a,b){for(var c=bitcoinjs.bitcoin.HDNode.fromBase58(a,p),d=b.split("/"),e=0;e<d.length;e++){var f=d[e],l=parseInt(f);if(!isNaN(l))var f="'"==f[f.length-1],m=!c.isNeutered(),c=f&&!m?null:f?c.deriveHardened(l):c.derive(l)}return c}})();
})();
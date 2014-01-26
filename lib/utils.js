
var fs = require('fs');
var path = require('path');

/**
 * Matchers.
 */

var booleans = /\{\{[#^] *(\w+) *\}\}/g;
var strings = /\{\{(?:!)? *(\w+) *\}\}/g;

/**
 * Return an array of boolean template tags for a given `string`.
 *
 * @param {String} string
 * @return {Array}
 */

exports.booleans = function (string) {
  var m;
  var ret = [];
  while (m = booleans.exec(string)) ret.push(m[1]);
  return ret;
};

/**
 * Return an array of string template tags for a given `string`.
 *
 * @param {String} string
 * @return {Array}
 */

exports.strings = function (string) {
  var m;
  var ret = [];
  while (m = strings.exec(string)) ret.push(m[1]);
  return ret;
};

/**
 * Recursively call a `fn` with the resolved path of every file in a `dir`.
 *
 * @param {String} dir
 * @param {Function} fn
 */

exports.recurse = function (dir, fn) {
  if ('.git' == path.basename(dir)) return;
  fs.readdirSync(dir).forEach(function (filename) {
    fn(path.resolve(dir, filename));
  });
};

/**
 * Check whether a `path` is a directory.
 *
 * @param {String} path
 * @return {Boolean}
 */

exports.isDir = function (path) {
  return fs.statSync(path).isDirectory();
};
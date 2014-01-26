
var fs = require('fs-extra');
var minstache = require('minstache');
var read = require('fs-readdir-recursive');
var resolve = require('path').resolve;
var ask = require('./utils').ask;
var noop = function(){};

/**
 * Expose `Khaos`.
 */

module.exports = Khaos;

/**
 * Initialize a new `Khaos` generator with a `template` directory.
 *
 * @param {String} template
 */

function Khaos (template) {
  this.template = template;
}

/**
 * Generate the template to an `out` directory, filling in locals.
 *
 * @param {String} out
 * @param {Object} locals
 */

Khaos.prototype.generate = function (out) {
  var template = this.template;
  var schema = {};
  var files = {};

  read(template).forEach(function (file) {
    if ('.git' == file) return;
    var path = resolve(template, file);
    var str = fs.readFileSync(path, 'utf8');
    files[file] = str;
    populate(schema, file);
    populate(schema, str);
  });

  ask(schema, function (locals) {
    Object.keys(files).forEach(function (file) {
      var str = files[file];
      file = minstache(file, locals);
      str = minstache(str, locals);
      fs.outputFileSync(resolve(out, file), str);
    });
  });
};

/**
 * Matchers.
 */

var bool = /\{\{# *(\w+) *\}\}/g;
var str = /\{\{ *(\w+) *\}\}/g;

/**
 * Populate a `schema` with template variables from a `string`.
 *
 * @param {Object} schema
 * @param {String} string
 * @return {Object}
 */

function populate (schema, string) {
  var bools = match(bool, string);
  var strs = match(str, string);

  bools.forEach(function (key) {
    if (!schema[key]) schema[key] = 'boolean';
  });

  strs.forEach(function (str) {
    schema[str] = 'string';
  });
}

/**
 * Match convenience.
 *
 * @param {RegExp} regexp
 * @param {String} string
 */

function match (regexp, string) {
  var m = regexp.exec(string);
  if (!m) return [];
  return m.slice(1);
}

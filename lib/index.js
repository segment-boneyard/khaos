
var ask = require('./ask');
var fs = require('fs-extra');
var minstache = require('minstache');
var noop = function(){};
var populate = require('./populate');
var read = require('fs-readdir-recursive');
var resolve = require('path').resolve;

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

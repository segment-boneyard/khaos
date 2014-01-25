
var fs = require('fs-extra');
var minstache = require('minstache');
var prompt = require('sync-prompt').prompt;
var read = require('fs-readdir-recursive');
var resolve = require('path').resolve;
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
  this.locals = {};
}

/**
 * Prompt the user for string by `key`.
 *
 * @param {String} key
 */

Khaos.prototype.prompt = function (key) {
  this.locals[key] = prompt(key + ': ');
};

/**
 * Generate the template to an `out` directory, filling in locals.
 *
 * @param {String} out
 * @param {Object} locals
 */

Khaos.prototype.generate = function (out) {
  var locals = this.locals;
  var template = this.template;
  read(template).forEach(function (file) {
    if ('.git' == file || 'khaos.json' == file) return;
    var str = fs.readFileSync(resolve(template, file), 'utf8');
    str = minstache(str, locals);
    file = minstache(file, locals);
    fs.outputFileSync(resolve(out, file), str);
  });
};
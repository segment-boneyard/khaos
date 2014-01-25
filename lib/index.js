
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
  this.questions = [];
  this.locals = {};
}

/**
 * Ask a `question`.
 *
 * @param {String} question
 */

Khaos.prototype.ask = function (key) {
  this.questions.push(key);
  return this;
};

/**
 * Generate the template to an `out` directory, filling in locals.
 *
 * @param {String} out
 * @param {Object} locals
 */

Khaos.prototype.generate = function (out) {
  var self = this;
  ask(this.questions, function(locals){
    var template = this.template;
    read(template).forEach(function (file) {
      if ('.git' == file || 'khaos.json' == file) return;
      var str = fs.readFileSync(resolve(template, file), 'utf8');
      str = minstache(str, locals);
      file = minstache(file, locals);
      fs.outputFileSync(resolve(out, file), str);
    });
  });
};

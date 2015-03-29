
var assert = require('assert');
var async = require('async');
var deep = require('deep-extend');
var fs = require('co-fs-extra');
var helpers = require('./helpers');
var is = require('is');
var lodash = require('lodash');
var Metalsmith = require('metalsmith');
var path = require('path');
var plugins = require('./plugins');
var prompt = require('prompt-for');
var sort = require('sort-object');
var thunkify = require('thunkify');
var uid = require('uid');
var unyield = require('unyield');
var utf8 = require('is-utf8');
var parse = require('./parse');

/**
 * Convenience.
 */

var cp = fs.copy;
var dirname = path.dirname;
var exists = fs.exists;
var extend = lodash.extend;
var join = path.join;
var mkdir = fs.mkdirs;
var omit = lodash.omit;
var resolve = path.resolve;
var rm = fs.remove;
var stat = fs.stat;

/**
 * Thunks.
 */

prompt = thunkify(prompt);

/**
 * Expose `Khaos`.
 */

module.exports = Khaos;

/**
 * Automatically added properties.
 */

var automatic = ['date', 'destination'];

/**
 * Initialize a new `Khaos` instance.
 *
 * @param {String} template
 * @return {Khaos}
 */

function Khaos(template){
  if (!(this instanceof Khaos)) return new Khaos(template);
  assert(is.string(template), 'You must pass a template path string.');
  this.template = resolve(template);
  this.helpers(helpers);
}

/**
 * Add a plugin `fn` to run before writing the files to disk.
 *
 * @param {Function} fn
 * @return {Array or Khaos}
 */

Khaos.prototype.before = function(fn){
  if (!arguments.length) return this._before || [];
  assert(is.fn(fn), 'You must pass a plugin function.');
  this._before = this._before || [];
  this._before.push(fn);
  return this;
};

/**
 * Add a plugin `fn` to run after writing the files to disk.
 *
 * @param {Function} fn
 * @return {Array or Khaos}
 */

Khaos.prototype.after = function(fn){
  if (!arguments.length) return this._after || [];
  assert(is.fn(fn), 'You must pass a plugin function.');
  this._after = this._after || [];
  this._after.push(fn);
  return this;
};

/**
 * Get or set the prompt `options`.
 *
 * @param {Object} options
 * @return {Object or Khaos}
 */

Khaos.prototype.options = function(options){
  if (!arguments.length) return this._options || {};
  assert(is.object(options), 'You must pass a prompt options object.');
  this._options = options;
  return this;
};

/**
 * Get or set additional `schema` information.
 *
 * @param {Object} schema
 * @return {Object or Khaos}
 */

Khaos.prototype.schema = function(schema){
  if (!arguments.length) return this._schema || {};
  assert(is.object(schema), 'You must pass a schema object.');
  this._schema = schema;
  return this;
};

/**
 * Get or set the `order` for the prompts.
 *
 * @param {Array} order
 * @return {Array or Khaos}
 */

Khaos.prototype.order = function(order){
  if (!arguments.length) return this._order || [];
  assert(is.array(order), 'You must pass an order array.');
  this._order = order;
  return this;
};

/**
 * Add additional handlebars `helpers`. You can also pass in a path string to a
 * file that exports an object of helpers.
 *
 * @param {Object or String} helpers
 * @return {Object or Khaos}
 */

Khaos.prototype.helpers = function(helpers){
  if (!arguments.length) return this._helpers
  assert(is.object(helpers) || is.string(helpers), 'You must pass an helpers object or file path string.');

  if (is.string(helpers)) {
    var path = resolve(helpers);
    try {
      helpers = require(path);
    } catch (e) {
      throw new Error('Failed to require Handlebars helpers at ' + path);
    }
  }

  assert(is.object(helpers), 'You must pass an helpers object or file path string.');
  this._helpers = this._helpers || {};
  extend(this._helpers, helpers);
  return this;
};

/**
 * Read the template with Metalsmith.
 *
 * @return {Object}
 */

Khaos.prototype.read = unyield(function*(){
  var tmpl = this.template;
  var dir = yield isDirectory(tmpl);
  var m = metalsmith();

  if (!dir) {
    var tmp = temp();
    yield mkdir(tmp);
    yield cp(tmpl, join(tmp, tmpl));
    tmpl = join(tmp, dirname(tmpl));
  }

  var files = yield m.read(tmpl);
  close(files);

  if (!dir) yield rm(tmp);
  return files;
});

/**
 * Parse a schema from a set of `files`.
 *
 * @param {Object} files
 * @return {Object}
 */

Khaos.prototype.parse = unyield(function*(files){
  assert(is.object(files), 'You must pass a files object.');
  var ret = {};

  for (var key in files) {
    var file = files[key];
    if (!utf8(file.contents)) continue;
    extend(ret, parse(key));
    extend(ret, parse(file.contents.toString()));
  }

  ret = omit(ret, automatic);
  ret = deep(ret, this.schema());
  ret = sort(ret, { sort: sorter(this.order()) });
  return ret;
});

/**
 * Prompt for a given `schema`.
 *
 * @param {Object} schema
 * @return {Object}
 */

Khaos.prototype.prompt = unyield(function*(schema){
  assert(is.object(schema), 'You must pass a schema object.');
  var answers = yield prompt(schema, this.options());
  return answers;
});

/**
 * Write a Metalsmith `files` object to a directory.
 *
 * @param {String} destination
 * @param {Object} files
 * @param {Object} answers
 */

Khaos.prototype.write = unyield(function*(destination, files, answers){
  assert(is.string(destination), 'You must pass a destination path to generate to.');
  assert(is.object(files), 'You must pass a files object.');
  assert(is.object(answers), 'You must pass an answers object.');
  var tmpl = this.template;
  var dir = yield isDirectory(tmpl);
  var dest = destination;
  var m = metalsmith();

  m.metadata(answers);
  m.use(this.before());

  for (var key in plugins) {
    var fn = plugins[key];
    m.use(fn(this, destination));
  }

  if (!dir) {
    var tmp = temp();
    yield mkdir(tmp);
    dest = tmp;
  }

  yield m.write(files, dest);

  if (!dir) {
    var file = Object.keys(files)[0];
    yield cp(join(dest, file), destination);
    yield rm(dest);
  }

  m = metalsmith();
  m.use(this.hooks.write);
  yield m.run(files);
});

/**
 * Read the template, optionally prompting for `answers`, and then write to a
 * `dest` path.
 *
 * @param {String} destination
 * @param {Object} answers (optional)
 */

Khaos.prototype.generate = unyield(function*(destination, answers){
  assert(is.string(destination), 'You must pass a destination path to generate to.');
  var files = yield this.read();

  if (!answers) {
    var schema = yield this.parse(files);
    answers = yield this.prompt(schema);
  }

  assert(is.object(answers), 'The answers must be an object.');
  yield this.write(destination, files, answers);
});

/**
 * Check whether a `path` is a directory.
 *
 * @param {String} dir
 * @return {Boolean}
 */

function *isDirectory(dir) {
  var stats = yield stat(dir);
  return stats.isDirectory();
}

/**
 * Return a Khaos-compatible instance of Metalsmith.
 *
 * @return {Metalsmith}
 */

function metalsmith() {
  return new Metalsmith('/').frontmatter(false);
}

/**
 * Return a temporary directory path.
 *
 * @return {String}
 */

function temp() {
  return '/tmp/khaos-' + uid();
}

/**
* Generate a custom sort method for given starting `order`.
*
* @param {Array} order
* @return {Function}
*/

function sorter(order){
  order = order || [];
  return function(a, b){
    var i = order.indexOf(a);
    var j = order.indexOf(b);
    if (~i && !~j) return -1;
    if (~j && !~i) return 1;
    if (i < j) return -1;
    if (j < i) return 1;
    return 0;
  };
}

/**
 * Close opening handlebars blocks in filenames since you can't normally have
 * closing slashes in file names. Kinda leaky.
 *
 * @param {Object} files
 */

function close(files) {
  var matcher = /\{\{[#^] *(\w+) *\}\}/;
  for (var file in files) {
    var m = matcher.exec(file);
    if (!m) continue;
    var data = files[file];
    delete files[file];
    file += '{{/' + m[1] + '}}';
    files[file] = data;
  }
};

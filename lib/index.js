
var assert = require('assert');
var async = require('async');
var fs = require('fs-extra');
var helpers = require('./helpers');
var is = require('is');
var Metalsmith = require('metalsmith');
var mkdir = require('mkdirp').sync;
var path = require('path');
var plugins = require('./plugins');
var rm = require('rimraf').sync;
var uid = require('uid');

var cp = fs.copySync;
var exists = fs.existsSync;
var join = path.join;
var resolve = path.resolve;
var stat = fs.statSync;

/**
 * Expose `Khaos`.
 */

module.exports = Khaos;

/**
 * Initialize a new Khaos instance with a `source` template and a `destination`.
 *
 * @param {String} source
 * @param {String} destination
 */

function Khaos(source, destination){
  if (!(this instanceof Khaos)) return new Khaos(source, destination);
  if (!source) throw new Error('You must provide a source template path.');
  if (!destination) throw new Error('You must provide a destination path.');
  this.source(source);
  this.destination(destination);
  this.hooks = {
    read: [],
    prompt: [],
    write: []
  };
}

/**
 * Get or set the `source` path.
 *
 * @param {Object} source
 * @return {Object or Khaos}
 */

Khaos.prototype.source = function(source){
  if (!arguments.length) return this._source;
  assert(is.string(source), 'You must pass an source path string.');
  this._source = source;
  return this;
};

/**
 * Get or set the `destination` path.
 *
 * @param {Object} destination
 * @return {Object or Khaos}
 */

Khaos.prototype.destination = function(destination){
  if (!arguments.length) return this._destination;
  assert(is.string(destination), 'You must pass an destination path string.');
  this._destination = destination;
  return this;
};

/**
 * Get or set the `prompt` options.
 *
 * @param {Object} prompt
 * @return {Object or Khaos}
 */

Khaos.prototype.prompt = function(prompt){
  if (!arguments.length) return this._prompt || {};
  assert(is.object(prompt), 'You must pass an prompt options object.');
  this._prompt = prompt;
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
  if (!arguments.length) return this._helpers || {};
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
  this._helpers = helpers;
  return this;
};

/**
 * Use a plugin `fn` with `type`.
 *
 * Types:
 *
 *  - read     Runs after the template directory has been read.
 *  - prompt   Runs after the answers have been prompted for.
 *  - write    Runs after the destination directory has been written.
 *
 * @param {String} type
 * @param {Function} fn
 */

Khaos.prototype.use = function(type, fn){
  assert(this.hooks[type], 'You must pass a type of either `read`, `prompt` or `write`.');
  this.hooks[type].push(fn);
  return this;
};

/**
 * Run the templating process, which will prompt the user for all the
 * placeholders and then fill in the template.
 *
 * @param {Function} fn
 */

Khaos.prototype.run = function(fn){
  var source = this.source();
  var destination = this.destination();
  var hooks = this.hooks;

  // everything but the `write` plugins
  var middleware = hooks.read
    .concat(plugins(this.options))
    .concat(hooks.prompt);

  // make our metalsmith instance
  var metalsmith = new Metalsmith('/')
    .source(resolve(source))
    .destination(resolve(destination))
    .frontmatter(false)
    .use(middleware);

  // done handler to invoke the `write` plugins
  function done(err, files, metalsmith) {
    if (err) return fn(err);
    async.eachSeries(hooks.write, run, end);

    function run(fn, callback) {
      fn(files, metalsmith, callback);
    }

    function end(err) {
      fn(err, files, metalsmith);
    }
  }

  // for directory templates, we're done
  if (stat(source).isDirectory()) return metalsmith.build(done);

  // otherwise, handle the single-file template case using tmp directories
  var src = '/tmp/khaos-' + uid();
  var dest = '/tmp/khaos-' + uid();
  mkdir(src);
  mkdir(dest);
  cp(source, join(src, source));

  // build metalsmith then remove the tmp directories
  metalsmith
    .source(src)
    .destination(dest)
    .build(function(err, files){
      if (err) return fn(err);
      cp(join(dest, source), destination);
      rm(src);
      rm(dest);
      done(null, files, metalsmith);
    });

};

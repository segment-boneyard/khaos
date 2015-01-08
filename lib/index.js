
var fs = require('fs-extra');
var path = require('path');
var helpers = require('./helpers');
var Metalsmith = require('metalsmith');
var plugins = require('./plugins');
var rm = require('rimraf').sync;
var uid = require('uid');
var mkdir = require('mkdirp').sync;
var handlebars = require('handlebars');

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
 * @param {Object} options (optional)
 */

function Khaos(source, destination, options){
  if (!(this instanceof Khaos)) return new Khaos(source, destination, options);
  if (!source) throw new Error('You must provide a source template.');
  if (!destination) throw new Error('You must provide a destination.');
  options = options || {};
  this.source = source;
  this.destination = destination;
  this.options = options;
  this.middleware = [];
  this.metalsmith = new Metalsmith('/');
}

/**
 * Register a new helper.
 *
 * @param {String} name
 * @param {Function} fn
 */

Khaos.prototype.helper = function(name, fn){
  handlebars.registerHelper(name, fn);
  return this;
};

/**
 * Push a new "plugin" onto the middleware stack.
 *
 * @param {Function} fn
 */

Khaos.prototype.use = function(fn){
  this.middleware.push(fn);
  return this;
};

/**
 * Run the templating process, which will prompt the user for all the
 * placeholders and then fill in the template.
 *
 * @param {Function} fn
 */

Khaos.prototype.run = function(fn){
  var source = this.source;
  var destination = this.destination;
  var metalsmith = this.metalsmith;
  var middleware = this.middleware;
  var options = this.options;

  metalsmith
    .source(resolve(source))
    .destination(resolve(destination))
    .frontmatter(false)
    .use(middleware.concat(plugins(options)));

  if (stat(source).isDirectory()) return metalsmith.build(fn);

  var src = '/tmp/khaos-' + uid();
  var dest = '/tmp/khaos-' + uid();

  mkdir(src);
  mkdir(dest);
  cp(source, join(src, source));

  metalsmith
    .source(src)
    .destination(dest)
    .build(function(err, files){
      if (err) return fn(err);
      cp(join(dest, source), destination);
      rm(src);
      rm(dest);
      fn(null, files);
    });
};

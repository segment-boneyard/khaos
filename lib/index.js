
var fs = require('fs-extra');
var path = require('path');
var helpers = require('./helpers');
var Metalsmith = require('metalsmith');
var plugins = require('./plugins');
var rm = require('rimraf').sync;
var uid = require('uid');
var mkdir = require('mkdirp').sync;
var Ware = require('ware');

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
  if (!source) throw new Error('You must provide a source template.');
  if (!destination) throw new Error('You must provide a destination.');
  if (!exists(source)) throw new Error('Cannot find ' + source);
  this.source = source;
  this.destination = destination;
  this.ware = new Ware(plugins);
}

/**
 * Use an additional Metalsmith plugin, in case you want to add some custom
 * logic to how a template is generated.
 *
 * @param {Function} plugin
 * @return {Khaos}
 */

Khaos.prototype.use = function(plugin){
  this.ware.use(plugin);
  return this;
};

/**
 * Run the templating process, which will prompt the user for all the
 * placeholders and then fill in the template.
 *
 * Aliased to `build` to mirror Metalsmith.
 *
 * @param {Function} fn
 */

Khaos.prototype.build =
Khaos.prototype.run = function(fn){
  var source = this.source;
  var destination = this.destination;
  var metalsmith = new Metalsmith('/')
    .use(this.ware)
    .source(resolve(source))
    .destination(resolve(destination));

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

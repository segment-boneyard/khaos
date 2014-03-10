
var helpers = require('./helpers');
var Metalsmith = require('metalsmith');
var noop = function(){};
var resolve = require('path').resolve;
var fns = require('./plugins');

/**
 * Expose `Khaos`.
 */

module.exports = Khaos;

/**
 * Initialize a new Khaos instance with a `src` template and a `dest` directory.
 *
 * @param {String} src
 * @param {String} dest
 */

function Khaos(src, dest){
  if (!(this instanceof Khaos)) return new Khaos(src, dest);
  this.src = resolve(src);
  this.dest = resolve(dest);
  this.metalsmith = new Metalsmith('/')
    .source(this.src)
    .destination(this.dest)
    .use(fns.date)
    .use(fns.close)
    .use(fns.ask)
    .use(fns.filename)
    .use(fns.templates);
}

/**
 * Use an additional Metalsmith plugin, in case you want to add some custom
 * logic to how the template is generated.
 *
 * @param {Function} plugin
 * @return {Khaos}
 */

Khaos.prototype.use = function(plugin){
  this.metalsmith.use(plugin);
  return this;
};

/**
 * Run the templating process, which will prompt the user and then create the
 * new project directory.
 *
 * @param {Function} fn
 */

Khaos.prototype.run = function(fn){
  fn = fn || noop;
  var dest = this.dest;
  this.metalsmith.build(function(err, files){
    fn(err);
  });
};

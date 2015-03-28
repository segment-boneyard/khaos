
var date = require('metalsmith-build-date');
var deep = require('deep-extend');
var handlebars = require('handlebars');
var lodash = require('lodash');
var path = require('path');
var prompt = require('metalsmith-prompt');
var templates = require('metalsmith-templates');
var utf8 = require('is-utf8');
var sort = require('sort-object');

var omit = lodash.omit;
var extend = lodash.extend;
var basename = path.basename;

/**
 * Expose `generate`.
 */

module.exports = generate;

/**
 * Return an array of plugins for a given set of `options`.
 *
 * @param {Object} options (optional)
 * @return {Array}
 */

function generate(options){
  options = options || {};
  var plugins = [];

  /**
   * Build date.
   */

  plugins.push(date());

  /**
   * Basename, without the extension.
   */

  plugins.push(function(files, metalsmith, done){
    setImmediate(done);
    var metadata = metalsmith.metadata();
    var dest = metalsmith.destination();
    metadata.basename = path.basename(dest, path.extname(dest));
  });


  /**
   * Close opening handlebars blocks in filenames since you can't normally have
   * closing slashes in file names. Kinda leaky.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */

  plugins.push(function(files, metalsmith, done){
    setImmediate(done);
    var matcher = /\{\{[#^] *(\w+) *\}\}/;
    for (var file in files) {
      var m = matcher.exec(file);
      if (!m) continue;
      var data = files[file];
      delete files[file];
      file += '{{/' + m[1] + '}}';
      files[file] = data;
    }
  });

  /**
   * Parse handlebars variables from each file, and invoke the prompt Metalsmith
   * plugin with the parsed schema.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */

  plugins.push(function(files, metalsmith, done){
    var strs = [];

    for (var key in files) {
      var file = files[key];
      if (!utf8(file.contents)) continue;
      strs.push(key, file.contents.toString());
    }

    var existing = Object.keys(metalsmith.metadata());
    var schema = omit(parse(strs), existing);
    schema = omit(schema, existing);
    schema = deep(schema, options.schema);
    schema = sort(schema, { sort: sorter(options.order) });

    var fn = prompt(schema, { color: 'white', pad: 3 });
    return fn.call(this, files, metalsmith, done);
  });

  /**
   * Template the filenames themselves.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */

  plugins.push(function(files, metalsmith, done){
    setImmediate(done);
    var metadata = metalsmith.metadata();
    var filenames = extend({}, files);
    for (var file in filenames) {
      var data = files[file];
      var fn = handlebars.compile(file);
      var clone = extend({}, data, metadata);
      var str = fn(clone);
      var i = file.indexOf('{{');
      delete files[file];
      if (str == file.slice(0, i)) continue;
      files[str] = data;
    }
  });

  /**
   * Template the file contents.
   */

  plugins.push(templates({
    engine: 'handlebars',
    pattern: '**'
  }));

  /**
   * Return the array of Metalsmith plugins.
   */

  return plugins;
}

/**
 * Return a prompt schema from a series of Handlebars strings.
 *
 * @param {Array} strings
 * @return {Object}
 */

function parse(strings) {
  var ret = {};

  strings.forEach(function(string){
    var ast = handlebars.parse(string).statements;
    ast.forEach(function(obj){
      switch (obj.type) {
        case 'mustache':
          if (obj.params.length) {
            obj.params.forEach(function(_){
              if ('ID' == _.type) ret[_.string] = { type: 'string' };
            });
          } else {
            var key = obj.sexpr.id.string;
            ret[key] = { type: 'string' };
          }
          break;
        case 'block':
          var key = obj.mustache.sexpr.id.string;
          if (ret[key]) return;
          ret[key] = { type: 'boolean' };
          break;
      }
    });
  });

  return ret;
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
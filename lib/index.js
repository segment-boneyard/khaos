
var ask = require('./ask');
var fs = require('fs');
var swig = require('swig');
var parse = require('./parse');
var path = require('path');
var utils = require('./utils');

var basename = path.basename;
var booleans = utils.booleans;
var dirname = path.dirname;
var isDir = utils.isDir;
var join = path.join;
var mkdir = fs.mkdirSync;
var recurse = utils.recurse;
var rel = path.relative;
var resolve = path.resolve;
var write = fs.writeFileSync;

/**
 * Expose `khaos`.
 */

module.exports = khaos;

/**
 * Generate a `template` to a `dest`, filling in locals.
 *
 * @param {String} template
 * @param {String} dest
 * @param {Function} fn
 */

function khaos(template, dest, fn){
  var obj = parse(template);
  var schema = obj.schema;
  var files = obj.files;

  ask(schema, function(locals){
    debugger;
    file(template);
    if (fn) fn(null, locals);

    /**
     * Render a file by `path`.
     *
     * @param {String} path
     */

    function file(path){
      debugger;
      var base = render(basename(path), locals);
      if (!base) return;
      var dir = render(dirname(path), locals);
      var out = resolve(dest, rel(template, join(dir, base)));

      if (isDir(path)) {
        mkdir(out);
        recurse(path, file);
        return;
      }

      var str = render(files[path], locals);
      if ('Makefile' == basename(path)) str.replace(/\n/g, '\t');
      write(out, str);
    }
  });
}

/**
 * Render a `string` with `locals`.
 *
 * @param {String} string
 * @param {Object} locals
 * @return {String}
 */

function render(string, locals){
  return swig.render(string, { locals: locals });
}
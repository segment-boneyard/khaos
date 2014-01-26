
var ask = require('./ask');
var fs = require('fs');
var minstache = require('minstache');
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
 */

function khaos (template, dest) {
  var obj = parse(template);
  var schema = obj.schema;
  var files = obj.files;

  ask(schema, function (locals) {
    file(template);

    /**
     * Render a file by `path`.
     *
     * @param {String} path
     */

    function file (path) {
      var base = minstache(close(basename(path)), locals);
      if (!base) return;
      var out = join(dirname(path), base);
      out = resolve(dest, rel(template, out));

      if (isDir(path)) {
        mkdir(out);
        recurse(path, file);
        return;
      }

      var str = minstache(files[path], locals);
      write(out, str);
    }

  });
}

/**
 * Close a template conditional in a file `path`.
 *
 * @param {String} path
 * @return {String}
 */

function close (path) {
  var name = booleans(path)[0];
  if (!name) return path;
  return path + '{{/' + name + '}}';
}
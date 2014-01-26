
var fs = require('fs');
var path = require('path');
var utils = require('./utils');

var basename = path.basename;
var isDir = utils.isDir;
var strings = utils.strings;
var booleans = utils.booleans;
var read = fs.readFileSync;
var readdir = fs.readdirSync;
var recurse = utils.recurse;
var resolve = path.resolve;

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Parse a `template` for its schema.
 *
 * @param {String} tmpl
 * @return {Object}
 */

function parse(tmpl){
  var schema = {};
  var files = {};

  file(tmpl);

  return {
    schema: schema,
    files: files
  };

  /**
   * Populate the schema from a file `path`.
   *
   * @param {String} path
   */

  function file(path){
    populate(path);
    if (isDir(path)) return recurse(path, file);
    var str = read(path, 'utf8');
    populate(str);
    files[path] = str;
  }

  /**
   * Populate the schema with template variables from a `string`.
   *
   * @param {String} string
   * @return {Object}
   */

  function populate(string){
    booleans(string).forEach(function(key){
      if (!schema[key]) schema[key] = 'boolean';
    });
    strings(string).forEach(function(key){
      schema[key] = 'string';
    });
  }
}
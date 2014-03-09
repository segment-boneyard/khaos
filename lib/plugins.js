
var basename = require('path').basename;
var date = require('metalsmith-build-date');
var extend = require('extend');
var handlebars = require('handlebars');
var prompt = require('metalsmith-prompt');
var templates = require('metalsmith-templates');

/**
 * Build date.
 */

exports.date = date();

/**
 * Close opening handlebars blocks in filenames since you can normally have
 * closing slashes.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

exports.close = function(files, metalsmith, done){
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
};

/**
 * Parse handlebars variables from each file, and invoke the prompt Metalsmith
 * plugin with the schema.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

exports.ask = function(files, metalsmith, done){
  var schema = {};
  var strs = Object.keys(files);
  strs = strs.concat(strs.map(function(file){
    return files[file].contents.toString();
  }));

  strs.forEach(function(str){
    var ast = handlebars.parse(str).statements;
    ast.forEach(function(obj){
      switch (obj.type) {
        case 'mustache':
          var key = obj.sexpr.id.string;
          schema[key] = 'string';
          break;
        case 'block':
          if (schema[key]) return;
          var key = obj.mustache.sexpr.id.string;
          schema[key] = 'boolean';
          break;
      }
    });
  });

  var fn = prompt(schema, { color: 'red' });
  return fn.call(this, files, metalsmith, done);
}

/**
 * Template the filenames themselves.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

exports.filename = function(files, metalsmith, done){
  setImmediate(done);
  var metadata = metalsmith.metadata();
  for (var file in files) {
    var data = files[file];
    var fn = handlebars.compile(file)
    var clone = extend({}, data, metadata);
    var str = fn(clone);
    delete files[file];
    files[str] = data;
  }
}

/**
 * Templates.
 */

exports.templates = templates({
  engine: 'handlebars',
  pattern: '**'
});

/**
 * Replace tabs in Makefiles so that they run properly.
 *
 * @param {Object} files
 * @param {Metalsmith} metalsmith
 * @param {Function} done
 */

exports.makefiles = function(files, metalsmith, done){
  setImmediate(done);
  for (var file in files) {
    if ('Makefile' != basename(file)) return;
    var str = files[file].contents
      .toString()
      .replace(/\n/g, '\t');
    files[file].contents = new Buffer(str);
  }
}

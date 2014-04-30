
var basename = require('path').basename;
var date = require('metalsmith-build-date');
var extend = require('extend');
var handlebars = require('handlebars');
var path = require('path');
var prompt = require('metalsmith-prompt');
var templates = require('metalsmith-templates');

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

  plugins.push(function basename(files, metalsmith, done){
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

  plugins.push(function close(files, metalsmith, done){
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

  plugins.push(function ask(files, metalsmith, done){
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
            if (obj.params.length) {
              obj.params.forEach(function(_){
                if ('ID' == _.type) schema[_.string] = { type: 'string' };
              });
            } else {
              var key = obj.sexpr.id.string;
              schema[key] = { type: 'string' };
            }
            break;
          case 'block':
            var key = obj.mustache.sexpr.id.string;
            if (schema[key]) return;
            schema[key] = { type: 'boolean' };
            break;
        }
      });
    });

    // already added automatically by other plugins
    delete schema.date;
    delete schema.basename;

    var fn = prompt(schema, {
      color: 'red',
      pad: true,
      schema: extend(schema, options.schema)
    });

    return fn.call(this, files, metalsmith, done);
  });

  /**
   * Template the filenames themselves.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */

  plugins.push(function filename(files, metalsmith, done){
    setImmediate(done);
    var metadata = metalsmith.metadata();
    for (var file in files) {
      var data = files[file];
      var fn = handlebars.compile(file);
      var clone = extend({}, data, metadata);
      var str = fn(clone);
      delete files[file];
      files[str] = data;
    }
  });

  /**
   * Templates.
   */

  plugins.push(templates({
    engine: 'handlebars',
    pattern: '**'
  }));

  /**
   * Replace tabs in Makefiles so that they run properly.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   * @param {Function} done
   */

  plugins.push(function makefiles(files, metalsmith, done){
    // TODO
    done();
  });

  return plugins;
}
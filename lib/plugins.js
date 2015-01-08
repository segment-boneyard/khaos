
var basename = require('path').basename;
var date = require('metalsmith-build-date');
var deep = require('deep-extend');
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
    if (!options.prompt) return done();
    var fn = prompt(options.prompt, { color: 'white', pad: 3 });
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

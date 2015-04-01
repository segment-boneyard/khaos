
var extend = require('lodash').extend;
var handlebars = require('handlebars');
var templates = require('metalsmith-templates');

/**
 * Expose `plugins`.
 */

module.exports = plugins;

/**
 * Return the write-time plugins.
 *
 * @param {Khaos} khaos
 * @return {Array}
 */

function plugins(khaos) {
  var fns = [];

  /**
   * Template the file names.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   */

  fns.push(function(files, metalsmith){
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
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   */

  fns.push(templates({
    engine: 'handlebars',
    helpers: khaos.helpers(),
    inPlace: true,
    pattern: '!*.hbs'
  }));

  /**
   * Return.
   */

  return fns;
}

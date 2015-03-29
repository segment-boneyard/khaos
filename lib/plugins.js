
var date = require('metalsmith-build-date');
var extend = require('lodash').extend;
var handlebars = require('handlebars');
var templates = require('metalsmith-templates');

/**
 * Automatically add the build date.
 *
 * @param {Khaos} khaos
 * @param {String} dest
 * @return {Function}
 */

exports.date = function(khaos){
  return date();
};

/**
 * Automatically add the `destination`.
 *
 * @param {Khaos} khaos
 * @param {String} dest
 * @return {Function}
 */

exports.destination = function(khaos, dest){
  return function(files, m){
    var data = m.metadata();
    data.destination = dest;
    m.metadata(data);
  };
};

/**
 * Template the filenames themselves.
 *
 * @param {Khaos} khaos
 * @param {String} dest
 * @return {Function}
 */

exports.filenames = function(khaos){
  return function(files, metalsmith){
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
  };
};

/**
 * Template the file contents.
 *
 * @param {Khaos} khaos
 * @param {String} dest
 * @return {Function}
 */

exports.files = function(khaos){
  return templates({
    engine: 'handlebars',
    helpers: khaos.helpers(),
    inPlace: true,
    pattern: '**'
  });
};

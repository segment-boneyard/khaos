
var extname = require('path').extname;

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
   * Close opening handlebars blocks in filenames since you can't normally have
   * closing slashes in file names. Kinda leaky.
   *
   * @param {Object} files
   * @param {Metalsmith} metalsmith
   */

  fns.push(function(files){
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
   * Return.
   */

  return fns;
}

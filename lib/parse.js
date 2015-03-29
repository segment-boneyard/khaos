
var handlebars = require('handlebars');

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Parse the schema from a Handlebars `string`.
 *
 * @param {String} string
 * @return {Schema}
 */

function parse(string){
  var ast = handlebars.parse(string).statements;
  var ret = {};

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

  return ret;
};
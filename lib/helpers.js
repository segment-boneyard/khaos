
var Case = require('to-case');
var moment = require('moment');

/**
 * Cases.
 */

Object.keys(Case.cases).forEach(function(key){
  exports[key + 'case'] = function(str){
    return Case[key](str);
  };
});

/**
 * Default.
 */

exports.default = function(value, def){
  return value ? value : def;
};

/**
 * Date.
 */

exports.date = function(date, format){
  return moment(date).format(format);
};

/**
 * Is and isnt.
 */

exports.is = function(value, match){
  return value === match;
};

exports.isnt = function(value, match){
  return value !== match;
};
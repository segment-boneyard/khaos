
var handlebars = require('handlebars');
var Case = require('case');
var moment = require('moment');

/**
 * Register a helper for each case.
 */

Object.keys(Case.cases).forEach(function(key){
  handlebars.registerHelper(key + 'case', function(str){
    return Case[key](str);
  });
});

/**
 * Add a default helper.
 */

handlebars.registerHelper('default', function(value, def){
  return value ? value : def;
});

/**
 * Add a date helper.
 */

handlebars.registerHelper('date', function(date, format){
  return moment(date).format(format);
});

/**
 * Add `is` and `isnt` helper.
 */

handlebars.registerHelper('is', function(value, match){
  return value === match;
});

handlebars.registerHelper('isnt', function(value, match){
  return value !== match;
});
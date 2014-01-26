
/**
 * Expose `populate`.
 */

module.exports = populate;

/**
 * Matchers.
 */

var bool = /{{[#^] *(\w+) *}}/g;
var str = /{{(?:!)? *(\w+) *}}/g;

/**
 * Populate a `schema` with template variables from a `string`.
 *
 * @param {Object} schema
 * @param {String} string
 * @return {Object}
 */

function populate (schema, string) {
  var bools = match(bool, string);
  var strs = match(str, string);

  console.log('strs', strs);
  console.log('bools', bools);

  bools.forEach(function (key) {
    if (!schema[key]) schema[key] = 'boolean';
  });

  strs.forEach(function (str) {
    schema[str] = 'string';
  });
};

/**
 * Match convenience.
 *
 * @param {RegExp} regexp
 * @param {String} string
 */

function match (regexp, string) {
  var m;
  var ret = [];
  while (m = regexp.exec(string)) ret.push(m[1]);
  return ret;
}
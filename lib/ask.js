
var max = require('max-component');
var pad = require('pad-component').left;
var prompt = require('cli-prompt');

/**
 * Expose `ask`.
 */

module.exports = ask;

/**
 * Ask `schema` and call `fn(obj)`
 *
 * @param {Array} schema
 * @param {Function} fn
 * @api private
 */

function ask(schema, fn){
  var questions = Object.keys(schema);
  var width = max(questions, 'length') + 4;
  var answers = {};
  var i = 0;

  function next(){
    var key = questions[i++];
    if (!key) return done();
    var type = schema[key];
    var q = pad(key, width);
    var ask = 'boolean' == type ? bool : str;
    ask(q, function(a){
      answers[key] = a;
      next();
    });
  }

  function done(){
    console.log();
    fn(answers);
  }

  console.log();
  next();
}

/**
 * Prompt for a string with `msg`.
 *
 * @param {String} msg
 * @param {Function} fn
 */

function str(msg, fn){
  prompt(msg + ': ', fn);
}

/**
 * Prompt for a boolean with `msg`.
 *
 * @param {String} msg
 * @param {Function} fn
 */

function bool(msg, fn){
  prompt(msg + '? (y/n) ', function(val){
    fn(/y|yes/i.test(val));
  });
}
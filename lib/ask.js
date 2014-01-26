
var max = require('max-component');
var readline = require('readline');

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
  var longest = max(questions, 'length');
  var answers = [];
  var i = 0;

  var ui = readline.createInterface({
    output: process.stdout,
    input: process.stdin
  });

  function next(){
    var q = questions[i++];
    if (!q) return done();
    var type = schema[q];
    if ('boolean' == type) q += ' (y/n)';
    q = pad(q, longest);
    ui.question(q, function(answer){
      if ('boolean' == type) answer = bool(answer);
      answers.push(answer);
      next();
    });
  }

  function done(){
    answers = normalize(questions, answers);
    console.log();
    ui.close();
    fn(answers);
  }

  console.log();
  next();
};

/**
 * Cast `type` to boolean.
 *
 * @param {String} str
 * @return {Boolean}
 * @api private
 */

function bool(str){
  return 'yes' == str
    || 'y' == str;
}

/**
 * Pad the given `question` with the `longest` one.
 *
 * @param {String} question
 * @param {String} longest
 * @return {String}
 * @api private
 */

function pad(question, longest){
  var len = Math.max(0, longest - question.length);
  return '    '
    + Array(len + 1).join(' ')
    + question
    + ' : ';
}

/**
 * Normalize `questions` and `answers`.
 *
 * @param {Array} questions
 * @param {Array} answers
 * @return {Object}
 * @api private
 */

function normalize(questions, answers){
  return questions.reduce(function(ret, q, i){
    q = q.toLowerCase().replace(/[^a-z]/g, '');
    ret[q] = answers[i];
    return ret;
  }, {});
}


var max = require('max-component');
var readline = require('readline');

/**
 * Ask `questions` and call `fn(obj)`
 *
 * @param {Array} questions
 * @param {Function} fn
 * @api private
 */

exports.ask = function(questions, fn){
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
    q = pad(q, longest);
    ui.question(q, function(answer){
      answers.push(q);
      next();
    });
  }

  function done(){
    answers = normalize(questions, answers);
    console.log();
    fn(answers);
  }

  console.log();
  next();
};

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

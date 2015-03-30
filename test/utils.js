
var Khaos = require('..');
var exec = require('child_process').exec;
var equal = require('assert-dir-equal');
var resolve = require('path').resolve;

/**
 * Write a series of `answers` to stdin.
 *
 * @param {Array} answers
 */

exports.answer = function(answers){
  setTimeout(function(answer){
    answers.forEach(exports.write);
  }, 100);
};

/**
 * Write an answer `str` to stdin.
 *
 * @param {String} str
 */

exports.write = function(str){
  str.split('').forEach(exports.press);
  exports.press('', { name: 'enter' });
};

/**
 * Trigger a keypress on stdin with `c` and `key`.
 *
 * @param {String} c
 * @param {Object} key
 */

exports.press = function(c, key){
  process.stdin.emit('keypress', c, key);
};

/**
 * Create a Khaos instance for a given fixture by `name`.
 *
 * @param {String} name
 * @return {Khaos}
 */

exports.fixture = function(name){
  var path = resolve(__dirname, 'fixtures', name, 'template');
  return Khaos(path);
};

/**
 * Verify that an expected result happed for a fixture by `name`.
 *
 * @param {String} name
 */

exports.verify = function(name){
  var expected = resolve(__dirname, 'fixtures', name, 'expected');
  equal('test/tmp', expected);
};

/**
 * Return a function to execute a khaos `cmd` with template `dir`.
 *
 * @param {String} cmd
 * @param {String} dir
 * @return {Function}
 */

exports.command = function(cmd, dir){
  dir = dir || 'test/tmp';
  return function(done){
    exec('bin/khaos ' + cmd + ' --directory ' + dir, function(err, stdout, stderr){
      done(null, {
        err: err,
        stdout: stdout,
        stderr: stderr
      });
    });
  };
};

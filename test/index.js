
var assert = require('assert');
var equal = require('assert-dir-equal');
var rm = require('rimraf').sync;
var Khaos = require('..');

describe('khaos', function(){
  beforeEach(function(){
    rm('test/tmp');
  });

  it('should fill in files', function(done){
    test('basic', ['basic'], done);
  });

  it('should file in multiple variables', function(done){
    test('multiple', ['title', 'description'], done);
  });

  it('should fill in nested files', function(done){
    test('nested', ['nested'], done);
  });

  it('should fill in file names', function(done){
    test('file-names', ['file-names'], done);
  });

  it('should fill in folder names', function(done){
    test('folder-names', ['folder-names'], done);
  });

  it('should handle conditionals', function(done){
    test('conditionals', ['title', 'n', 'description'], done);
  });

  it('should handle conditional files', function(done){
    test('conditional-files', ['y'], done);
  });

  it('should handle conditional folders', function(done){
    test('conditional-folders', ['y'], done);
  });

  it('should register case helpers', function(done){
    test('case', ['case'], done);
  });

  it('should register a default helper', function(done){
    test('default', [''], done);
  });

  it('should register a date helper', function(done){
    test('date', [], done);
  });
});

/**
 * Test convenience.
 *
 * @param {String} fixture
 * @param {Array} answers
 * @param {Function} done
 */

function test(fixture, answers, done){
  Khaos('test/fixtures/' + fixture, 'test/tmp')
    .run(function(err){
      if (err) return done(err);
      equal('test/tmp', 'test/fixtures/' + fixture + '-out');
      done();
    });

  setTimeout(function(){
    answers.forEach(answer);
  }, 20);
}

/**
 * Write an answer `str` to stdin.
 *
 * @param {String} str
 * @param {Function} fn
 */

function answer(str){
  str.split('').forEach(press);
  press('', { name: 'enter' });
}

/**
 * Trigger a keypress on stdin with `c` and `key`.
 *
 * @param {String} c
 * @param {Object} key
 */

function press(c, key){
  process.stdin.emit('keypress', c, key);
}
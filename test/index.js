
var assert = require('assert');
var read = require('fs').readFileSync;
var dir = require('fs-readdir-recursive');
var rm = require('rimraf').sync;
var khaos = require('..');

describe('khaos', function(){

  beforeEach(function(){
    rm('test/tmp');
  });

  it('should fill in files', function(){
    test('basic', 'basic');
  });

  it('should file in multiple variables', function(){
    test('multiple', 'title', 'description');
  });

  it('should fill in nested files', function(){
    test('nested', 'nested');
  });

  it('should fill in file names', function(){
    test('file-names', 'file-names');
  });

  it('should fill in folder names', function(){
    test('folder-names', 'folder-names');
  });

  it('should handle conditionals', function(){
    test('conditionals', 'n', 'title', 'description');
  });

  it('should handle conditional files', function(){
    test('conditional-files', 'y');
  });

  it('should handle conditional folders', function(){
    test('conditional-folders', 'y');
  });

});

/**
 * Test convenience.
 *
 * @param {String} fixture
 * @param {Strings} answers...
 */

function test(fixture){
  var answers = [].slice.call(arguments, 1);
  khaos('test/fixtures/' + fixture, 'test/tmp');
  answers.forEach(answer);
  var files = dir('test/fixtures/' + fixture + '-out');
  files.forEach(function(file){
    var tmp = read('test/tmp/' + file, 'utf8');
    var out = read('test/fixtures/' + fixture + '-out/' + file, 'utf8');
    assert.equal(tmp, out);
  });
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
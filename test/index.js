
var assert = require('assert');
var equal = require('assert-dir-equal');
var exists = require('fs').existsSync;
var rm = require('rimraf').sync;
var Khaos = require('..');

describe('Khaos', function(){
  beforeEach(function(){
    rm('test/tmp');
  });

  it('should require a source directory', function(){
    assert.throws(function(){
      new Khaos();
    }, /You must provide a source template\./);
  });

  it('should require a destination directory', function(){
    assert.throws(function(){
      new Khaos('src');
    }, /You must provide a destination\./);
  });

  describe('#run', function(){
    it('should error out', function(done){
      run('error', {}, [], function(err){
        assert(err);
        done();
      });
    });

    it('should fill in files', function(done){
      var opts = { prompt: ['name'] };
      var answers = ['basic'];
      run('basic', opts, answers, done);
    });

    it('should fill in multiple variables', function(done){
      var opts = { prompt: ['title', 'description'] };
      var answers = ['the title', 'the description'];
      run('multiple', opts, answers, done);
    });

    it('should fill in nested files', function(done){
      var opts = { prompt: ['name'] };
      var answers = ['nested'];
      run('nested', opts, answers, done);
    });

    it('should fill in file names', function(done){
      var opts = { prompt: ['name'] };
      var answers = ['file-names'];
      run('file-names', opts, answers, done);
    });

    it('should fill in folder names', function(done){
      var opts = { prompt: ['name'] };
      var answers = ['folder-names'];
      run('folder-names', opts, answers, done);
    });

    it('should handle conditionals', function(done){
      var opts = { prompt: ['title', 'show', 'description'] };
      var answers = ['title', 'n', 'description'];
      run('conditionals', opts, answers, done);
    });

    it('should handle conditional files', function(done){
      var opts = { prompt: ['show'] };
      var answers = ['y'];
      run('conditional-files', opts, answers, done);
    });

    it('should handle conditional folders', function(done){
      var opts = { prompt: ['show'] };
      var answers = ['y'];
      run('conditional-folders', opts, answers, done);
    });

    it('should register case helpers', function(done){
      var opts = { prompt: ['name'] };
      var answers = ['case'];
      run('case', opts, answers, done);
    });

    it('should register a default helper', function(done){
      var opts = {};
      var answers = [''];
      run('default', opts, answers, done);
    });

    it('should register a date helper', function(done){
      var opts = {};
      var answers = [];
      run('date', opts, answers, done);
    });

    it('should handle single-file templates', function(done){
      var opts = { prompt: ['name'] };
      var answers = ['file'];
      run('file', opts, answers, done);
    });
  });
});

/**
 * Test convenience.
 *
 * @param {String} fixture
 * @param {Array} answers
 * @param {Function} done
 */

function run(fixture, opts, answers, done){
  new Khaos('test/fixtures/' + fixture + '/in', 'test/tmp', opts)
    .run(function(err){
      if (err) return done(err);
      equal('test/tmp', 'test/fixtures/' + fixture + '/out');
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
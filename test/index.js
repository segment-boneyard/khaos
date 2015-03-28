
var assert = require('assert');
var equal = require('assert-dir-equal');
var exists = require('fs').existsSync;
var Khaos = require('..');
var resolve = require('path').resolve;
var rm = require('rimraf').sync;

/**
 * Cache.
 */

var k;

/**
 * Tests.
 */

describe('Khaos', function(){
  beforeEach(function(){
    k = Khaos('src', 'dest');
    rm('test/tmp');
  });

  it('should not require the new keyword', function(){
    assert(k instanceof Khaos);
  });

  it('should require a source directory', function(){
    assert.throws(function(){
      Khaos();
    }, /You must provide a source template path\./);
  });

  it('should require a destination directory', function(){
    assert.throws(function(){
      Khaos('src');
    }, /You must provide a destination path\./);
  });

  it('should setup hooks', function(){
    assert.deepEqual(k.hooks, {
      read: [],
      prompt: [],
      write: []
    });
  });

  describe('#source', function(){
    it('should get a source directory', function(){
      assert.equal(k.source(), 'src');
    });

    it('should set a source directory', function(){
      k.source('dir');
      assert.equal(k.source(), 'dir');
    });

    it('should error on non-string', function(){
      assert.throws(function(){
        k.source(0);
      });
    });
  });

  describe('#destination', function(){
    it('should get a destination directory', function(){
      assert.equal(k.destination(), 'dest');
    });

    it('should set a destination directory', function(){
      k.destination('dir');
      assert.equal(k.destination(), 'dir');
    });

    it('should error on non-string', function(){
      assert.throws(function(){
        k.destination(0);
      });
    });
  });

  describe('#prompt', function(){
    it('should default to an empty object', function(){
      assert.deepEqual(k.prompt(), {});
    });

    it('should set a prompt options object', function(){
      k.prompt({ option: true });
      assert.deepEqual(k._prompt, { option: true });
    });

    it('should get a prompt options object', function(){
      k._prompt = { option: true };
      assert.deepEqual(k.prompt(), { option: true });
    });

    it('should error on non-object', function(){
      assert.throws(function(){
        k.prompt(0);
      });
    });
  });

  describe('#schema', function(){
    it('should default to an empty object', function(){
      assert.deepEqual(k.schema(), {});
    });

    it('should set a schema object', function(){
      k.schema({ key: {} });
      assert.deepEqual(k._schema, { key: {} });
    });

    it('should get a schema object', function(){
      k._schema = { key: {} };
      assert.deepEqual(k.schema(), { key: {} });
    });

    it('should error on non-object', function(){
      assert.throws(function(){
        k.schema(0);
      });
    });
  });

  describe('#order', function(){
    it('should default to an empty array', function(){
      assert.deepEqual(k.order(), []);
    });

    it('should set an order array', function(){
      k.order(['one', 'two', 'three']);
      assert.deepEqual(k._order, ['one', 'two', 'three']);
    });

    it('should get an order array', function(){
      k._order = ['one', 'two', 'three'];
      assert.deepEqual(k.order(), ['one', 'two', 'three']);
    });

    it('should error on non-array', function(){
      assert.throws(function(){
        k.order(0);
      });
    });
  });

  describe('#helpers', function(){
    it('should default to an empty object', function(){
      assert.deepEqual(k.helpers(), {});
    });

    it('should set a helpers object', function(){
      k.helpers({ helper: true });
      assert.deepEqual(k._helpers, { helper: true });
    });

    it('should read a helpers file path string', function(){
      k.helpers(resolve(__dirname, 'fixtures/helpers.js'));
      assert.deepEqual(k._helpers, { helper: true });
    });

    it('should get a helpers object', function(){
      k._helpers = { helper: true };
      assert.deepEqual(k.helpers(), { helper: true });
    });

    it('should error on non-object and non-string', function(){
      assert.throws(function(){
        k.helpers(0);
      });
    });
  });

  describe('#use', function(){
    var noop = function(){};

    it('should add a hook', function(){
      k.use('read', noop);
      assert.equal(k.hooks.read.length, 1);
      assert.equal(k.hooks.read[0], noop);
    });

    it('should error on an unknown hook', function(){
      assert.throws(function(){
        k.use('unknown', noop);
      });
    });
  });

  describe('#run', function(){
    it('should error out', function(done){
      run('error', [''], function(err){
        assert(err);
        done();
      });
    });

    it('should fill in files', function(done){
      run('basic', ['basic'], done);
    });

    it('should fill in multiple variables', function(done){
      run('multiple', ['title', 'description'], done);
    });

    it('should fill in nested files', function(done){
      run('nested', ['nested'], done);
    });

    it('should fill in file names', function(done){
      run('file-names', ['file-names'], done);
    });

    it('should fill in folder names', function(done){
      run('folder-names', ['folder-names'], done);
    });

    it('should handle conditionals', function(done){
      run('conditionals', ['title', 'n', 'description'], done);
    });

    it('should handle conditional files', function(done){
      run('conditional-files', ['y'], done);
    });

    it('should handle conditional folders', function(done){
      run('conditional-folders', ['y'], done);
    });

    it('should register case helpers', function(done){
      run('case', ['case'], done);
    });

    it('should register a default helper', function(done){
      run('default', [''], done);
    });

    it('should register a date helper', function(done){
      run('date', [], done);
    });

    it('should handle single-file templates', function(done){
      run('file', ['file'], done);
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

function run(fixture, answers, done){
  Khaos('test/fixtures/' + fixture + '/in', 'test/tmp')
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
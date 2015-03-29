
var assert = require('assert');
var equal = require('assert-dir-equal');
var exists = require('fs').existsSync;
var Khaos = require('..');
var resolve = require('path').resolve;
var rm = require('rimraf').sync;

/**
 * Tests.
 */

describe('Khaos', function(){
  beforeEach(function(){
    rm('test/tmp');
  });

  it('should not require the new keyword', function(){
    var k = Khaos('template');
    assert(k instanceof Khaos);
  });

  it('should throw without a template path', function(){
    assert.throws(function(){
      Khaos();
    });
  });

  describe('#options', function(){
    it('should default to an empty object', function(){
      var k = Khaos('template');
      assert.deepEqual(k.options(), {});
    });

    it('should set a options options object', function(){
      var k = Khaos('template');
      k.options({ option: true });
      assert.deepEqual(k._options, { option: true });
    });

    it('should get a options options object', function(){
      var k = Khaos('template');
      k._options = { option: true };
      assert.deepEqual(k.options(), { option: true });
    });

    it('should error on non-object', function(){
      var k = Khaos('template');
      assert.throws(function(){
        k.options(0);
      });
    });
  });

  describe('#schema', function(){
    it('should default to an empty object', function(){
      var k = Khaos('template');
      assert.deepEqual(k.schema(), {});
    });

    it('should set a schema object', function(){
      var k = Khaos('template');
      k.schema({ key: {} });
      assert.deepEqual(k._schema, { key: {} });
    });

    it('should get a schema object', function(){
      var k = Khaos('template');
      k._schema = { key: {} };
      assert.deepEqual(k.schema(), { key: {} });
    });

    it('should error on non-object', function(){
      var k = Khaos('template');
      assert.throws(function(){
        k.schema(0);
      });
    });
  });

  describe('#order', function(){
    it('should default to an empty array', function(){
      var k = Khaos('template');
      assert.deepEqual(k.order(), []);
    });

    it('should set an order array', function(){
      var k = Khaos('template');
      k.order(['one', 'two', 'three']);
      assert.deepEqual(k._order, ['one', 'two', 'three']);
    });

    it('should get an order array', function(){
      var k = Khaos('template');
      k._order = ['one', 'two', 'three'];
      assert.deepEqual(k.order(), ['one', 'two', 'three']);
    });

    it('should error on non-array', function(){
      var k = Khaos('template');
      assert.throws(function(){
        k.order(0);
      });
    });
  });

  describe('#helpers', function(){
    it('should get a helpers object', function(){
      var k = Khaos('template');
      k._helpers = { helper: true };
      assert.deepEqual(k.helpers(), { helper: true });
    });

    it('should mixin a helpers object', function(){
      var k = Khaos('template');
      k.helpers({ helper: true });
      assert.equal(k.helpers().helper, true);
    });

    it('should default to built-in helpers', function(){
      var k = Khaos('template');
      var helpers = require('../lib/helpers');
      var h = k.helpers();

      for (var key in helpers) {
        assert.equal(h[key], helpers[key]);
      }
    });

    it('should read a helpers file path string', function(){
      var k = Khaos('template');
      k.helpers(resolve(__dirname, 'fixtures/helpers.js'));
      assert.equal(k.helpers().helper, true);
    });

    it('should error on non-object and non-string', function(){
      var k = Khaos('template');
      assert.throws(function(){
        k.helpers(0);
      });
    });
  });

  describe('#before', function(){
    var noop = function(){};

    it('should default to an empty array', function(){
      var k = Khaos('template');
      assert.deepEqual(k.before(), []);
    });

    it('should get before plugins', function(){
      var k = Khaos('template');
      k._before = [noop];
      assert.equal(k.before()[0], noop);
    });

    it('should add a before plugin', function(){
      var k = Khaos('template');
      k.before(noop);
      assert.equal(k._before[0], noop);
    });

    it('should error on a non-function', function(){
      var k = Khaos('template');
      assert.throws(function(){
        k.before(0);
      });
    });
  });

  describe('#after', function(){
    var noop = function(){};

    it('should default to an empty array', function(){
      var k = Khaos('template');
      assert.deepEqual(k.after(), []);
    });

    it('should get after plugins', function(){
      var k = Khaos('template');
      k._after = [noop];
      assert.equal(k.after()[0], noop);
    });

    it('should add a after plugin', function(){
      var k = Khaos('template');
      k.after(noop);
      assert.equal(k._after[0], noop);
    });

    it('should error on a non-function', function(){
      var k = Khaos('template');
      assert.throws(function(){
        k.after(0);
      });
    });
  });

  describe('#read', function(){
    it('should read a template directory', function*(){
      var k = Khaos('test/fixtures/read-template/template');
      var files = yield k.read();
      assert.equal(files.file.contents.toString(), 'body');
    });

    it('should handle single-file templates', function*(){
      var k = Khaos('test/fixtures/read-file/template');
      var files = yield k.read();
      assert.equal(files['template'].contents.toString(), 'body');
    });

    it('should close open handlebars interpolations in file names', function*(){
      var k = Khaos('test/fixtures/read-close/template');
      var files = yield k.read();
      assert.equal(files['{{#var}}file{{/var}}'].contents.toString(), 'body');
    });
  });

  describe('#parse', function(){
    it('should parse string placeholders', function*(){
      var k = fixture('parse-file-string');
      var files = yield k.read();
      var schema = yield k.parse(files);
      assert.deepEqual(schema, { string: { type: 'string' }});
    });

    it('should parse boolean placeholders in files', function*(){
      var k = fixture('parse-file-boolean');
      var files = yield k.read();
      var schema = yield k.parse(files);
      assert.deepEqual(schema, { boolean: { type: 'boolean' }});
    });

    it('should parse string placeholders in file names', function*(){
      var k = fixture('parse-filename-string');
      var files = yield k.read();
      var schema = yield k.parse(files);
      assert.deepEqual(schema, { string: { type: 'string' }});
    });

    it('should parse boolean placeholders in file names', function*(){
      var k = fixture('parse-filename-boolean');
      var files = yield k.read();
      var schema = yield k.parse(files);
      assert.deepEqual(schema, { boolean: { type: 'boolean' }});
    });

    it('should omit automatically added keys', function*(){
      var k = fixture('parse-automatic');
      var files = yield k.read();
      var schema = yield k.parse(files);
      assert.deepEqual(schema, {});
    });

    it('should deeply mixin a provided schema', function*(){
      var k = fixture('parse-schema');
      k.schema({ string: { label: 'String' }});
      var files = yield k.read();
      var schema = yield k.parse(files);
      assert.deepEqual(schema, { string: { type: 'string', label: 'String' }});
    });

    it('should respect a sort order', function*(){
      var k = fixture('parse-order');
      k.order(['two', 'three']);
      var files = yield k.read();
      var schema = yield k.parse(files);
      var keys = Object.keys(schema);
      assert.equal(keys[0], 'two');
      assert.equal(keys[1], 'three');
      assert.equal(keys[2], 'one');
    });
  });

  describe('#prompt', function(){
    it('should prompt for placeholders in files');
    it('should prompt for placeholders in file names');
    it('should obey a supplied schema');
    it('should not prompt for automatically added values');
  });

  describe('#write', function(){
    it('should write to a destination directory', function*(){
      var k = Khaos('test/');
    });

    it('should handle single-file templates');
    it('should run a prompt hook');

    it.skip('should run an after hook', function*(done){
      var k = Khaos('test/fixtures/read-hook/template');
      k.use('read', hook);
      var files = yield k.read();

      function hook(files) {
        assert(files.file.contents.toString(), 'body');
        done();
      }
    });
  });

  describe.skip('#run', function(){
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
  Khaos()
    .template('test/fixtures/' + fixture + '/in')
    .destination('test/tmp')
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


/**
 * Create a Khaos instance for a given fixture by `name`.
 *
 * @param {String} name
 * @return {Khaos}
 */

function fixture(name) {
  var path = resolve(__dirname, 'fixtures', name, 'template');
  return Khaos(path);
}
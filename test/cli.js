
var assert = require('assert');
var spawn = require('child_process').spawn;
var exists = require('fs').existsSync;
var once = require('once');
var rm = require('rimraf').sync;
var utils = require('./utils');
var resolve = require('path').resolve;

/**
 * Convenience.
 */

var verify = utils.verify;
var fixture = utils.fixture;
var answer = utils.answer;
var command = utils.command;

/**
 * Tests.
 */

describe.skip('CLI', function(){
  beforeEach(function(){
    rm('test/tmp');
  });

  describe('install <repository> [<name>]', function(){
    it('should show help without any args', function(done){
      khaos('install', function(err, stdout, stderr){
        if (err) return done(err);
        assert(stdout);
        assert(~stdout.indexOf('Usage: khaos-install <repository> [<name>]'));
        done();
      });
    });

    it('should fail without a / in the repository', function(done){
      khaos('install segmentio node', function(err, stdout, stderr){
        assert(err);
        assert(stderr);
        assert(~stderr.indexOf('Couldn\'t find a GitHub repository named "segmentio".'));
        done();
      });
    });

    it('should fail on a non-existant repository', function(done){
      khaos('install segmentio/noooooooo test', function(err, stdout, stderr){
        assert(err);
        assert(stderr);
        assert(~stderr.indexOf('Repository not found.'));
        done();
      });
    });

    it('should install a new template', function(done){
      khaos('install segmentio/khaos-node node', function(err){
        if (err) return done(err);
        assert(exists('test/tmp/node'));
        assert(exists('test/tmp/node/template'));
        assert(exists('test/tmp/node/template/Readme.md'));
        done();
      });
    });

    it('should infer an alias name based on the repository', function(done){
      khaos('install segmentio/khaos-node', function(err){
        if (err) return done(err);
        assert(exists('test/tmp/node'));
        assert(exists('test/tmp/node/template'));
        assert(exists('test/tmp/node/template/Readme.md'));
        done();
      });
    });
  });

  describe('update [<template>]', function(){
    it('should fail with a non-existant template', function(done){
      khaos('update non-existant', function(err, stdout, stderr){
        assert(err);
        assert(stderr);
        assert(~stderr.indexOf('Couldn\'t find a local template named "non-existant".'));
        done();
      });
    });

    it('should update an existing template');
  });

  describe('create <template> <project>', function(){
    it('should generate a new template', function*(){
      yield create('cli-create-template', ['string', 'y']);
      verify('cli-create-template');
    });
  });
});

/**
 *
 */

function create(fixture, answers) {
  return function(done){
    var stdout = '';
    var stderr = '';
    var args = ['create', fixture, 'test/tmp', '--directory', 'test/fixtures'];
    var opts = { cwd: process.cwd, stdio: 'pipe' };
    var child = spawn('bin/khaos', args, opts);

    process.on('exit', function(){
      child.kill();
    });

    setTimeout(function(){
      answer(answers, child.stdin);
    }, 1000);

    child.stdout.on('data', function(data){
      stdout += data.toString();
    });


    child.stderr.on('data', function(data){
      stderr += data.toString();
    });

    child.on('close', function(code){
      if (code === 1) done(new Error(stderr));
      console.log(stdout);
      done();
    });
  };
}



/**
 * Execute a khaos `cmd`.
 *
 * @param {String} cmd
 * @param {Function} fn
 */

function khaos(cmd, fn){
  fn = once(fn);
  exec('bin/khaos ' + cmd + ' --directory test/tmp', fn);
}

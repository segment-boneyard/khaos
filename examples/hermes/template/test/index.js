
var {{camelcase basename}} = require('..');
var assert = require('assert');
var Hermes = require('hermes');
var hermes;

describe('{{basename}}', function(){
  beforeEach(function(){
    hermes = new Hermes().use({{camelcase basename}}());
  });

  it('should...');
});
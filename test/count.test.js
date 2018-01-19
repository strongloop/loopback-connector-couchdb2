// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: loopback-connector-couchdb2
// This file is licensed under the Apache License 2.0.
// License text available at https://opensource.org/licenses/Apache-2.0

'use strict';

var _ = require('lodash');
var async = require('async');
var should = require('should');
var testUtil = require('./lib/test-util');
var url = require('url');
var db, TestCountUser;

if (!process.env.COUCHDB2_TEST_SKIP_INIT) {
  require('./init.js');
}

function create50Samples() {
  var r = [];
  for (var i = 0; i < 70; i++) {
    r.push({name: 'user'.concat(i)});
  }
  return r;
};

function cleanUpData(done) {
  TestCountUser.destroyAll(done);
};

describe('count', function() {
  before(function(done) {
    const config = _.assign(global.config, {globalLimit: 100});
    const samples = create50Samples();
    db = global.getDataSource(config);

    TestCountUser = db.define('TestCountUser', {
      name: {type: String},
    }, {forceId: false});

    db.automigrate((err) => {
      if (err) return done(err);
      TestCountUser.create(samples, done);
    });
  });

  it('returns more than 25 results with global limit set', function(done) {
    TestCountUser.count((err, r)=> {
      if (err) return done(err);
      console.log(r);
      done();
    });
  });

  it('destroys more than 25 results with global limit set', function(done) {
    cleanUpData((err)=> {
      if (err) return done(err);
      TestCountUser.count((err, r) => {
        if (err) return done(err);
        r.should.equal(0);
        done();
      });
    });
  });
});

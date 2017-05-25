'use strict';

import TestData from '../src'
import should from 'should'
import {application} from 'nxus-core'
import DataManagerModule from 'nxus-data-manager'

describe("test-data", function() {
    //following just stolen from data-manager unit test...
  beforeEach(() => {
    let module = new DataManagerModule();
    application.emit('load')
  });
  var ut = {};
   describe("Load", () => {
    it("import object under test should not be null", () => TestData.should.not.be.null)
    it("instatiates OK", (done) =>  {
      ut = new TestData()
      ut.should.not.be.null
      should.not.exist(ut._database)
      done()
    })
    it("CSV load data works OK", function(done) {
      this.timeout(3500)
      ut.load('test/tests.csv', 'tests').then( (records) => {
        console.log("loaded results", records)
        done()
      })
      
    })
    
  });
});
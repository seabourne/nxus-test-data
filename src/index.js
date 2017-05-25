
'use strict';

import {Dispatcher} from 'nxus-core'
import {dataManager} from 'nxus-data-manager'
import _ from 'underscore'
import Mongodb from 'mongodb'

const DB_TYPES = { 
  mongo: { type: "mongo", connect: "url"}, 
  sqlite : { type: "sqlite"}
}
const TEST_RECORD_PROPERTY = "nxus_test_data"

export default class TestData extends Dispatcher {
  constructor(opts) {
    super()
    this.setMaxListeners(25)
    this.options = {
      dbType: DB_TYPES.mongo.type,
      url: 'mongodb://localhost:27017/test',
    }
    if (opts) {
      this.options.dbType = opts.dbType
      delete opts.dbType
      _.extend(this.options, opts)
    }
    this._database = null
    //only mongo for now.
    this._client = Mongodb.MongoClient
  }

  async load(source, target) {
    await this._connectDB()
    dataManager.on('record.csv', () => {
      console.log( "got one!" )
    })
    let records = await dataManager.importFile(source)
    console.log('uploaded ', records)
    try {
      let wResult = await this._database.collection(target).insertMany(records)
      return wResult.ops
    } catch(err) {
      console.log(err)
    } finally {
      this._disconnectDB()
    }
  }

  loadFromFolder(location) {

  }

  purge() {

  }

  async _connectDB() {
    let db = await this._client.connect(this.options.url);
    console.log("nxus test connected to ", db.databaseName)
    this._database = db
  }

  async _disconnectDB() {
    if (this._database) {
      await this._database.close()
    }
    this._database = null
  }

}


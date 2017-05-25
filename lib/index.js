
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _nxusCore = require('nxus-core');

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const DB_TYPES = {
  mongo: { type: "mongo", connect: "url" },
  sqlite: { type: "sqlite" }
};
const TEST_RECORD_PROPERTY = "nxus_test_data";

class TestData extends _nxusCore.Dispatcher {
  constructor(opts) {
    super();
    this.setMaxListeners(25);
    this.options = {};
    this.options.dbType = opts.dbType || DB_TYPES.mongo.type;
    delete opts.dbType;
    _underscore2.default.extend(this.options, opts);
    this._database = null;
    //only mongo for now..
    this._client = _mongodb.Mongodb.MongoClient;
  }

  load(location, target) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this._connectDB();
      try {
        let wResult = _this._database.collection('tests').insertMany([{ one: "two", two: "three" }]);
        return wResult.ops;
      } catch (err) {
        console.log(err);
      } finally {
        _this._disconnectDB();
      }
    })();
  }

  loadFromFolder(location) {}

  purge() {}

  _connectDB() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      let db = yield _this2._client.connect('mongodb://localhost:27017/test');
      _this2._database = db;
    })();
  }

  _disconnectDB() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      yield _this3._database.close();
    })();
  }

}
exports.default = TestData;
const fs = require('fs');

class SimpleStorage {
  constructor() {
    this.dataDir = __dirname + '/../data/';
  }
  /**
   *
   * @param {string} key
   */
  get(key) {
    if (!this.has(key)) {
      return null;
    }
    const data = fs.readFileSync(this._getFileByKey(key)).toString();
    return JSON.parse(data);
  }

  /**
   *
   * @param {string} key
   * @param {*} value
   */
  set(key, value, cb, isSync = false) {
    if (this.has(key)) {
      this.remove(key, null, true);
    }
    if (isSync) {
      fs.writeFileSync(this._getFileByKey(key), JSON.stringify(value));
    } else {
      fs.writeFile(this._getFileByKey(key), JSON.stringify(value), cb);
    }
    return true;
  }

  /**
   *
   * @param {string} key
   */
  has(key) {
    return fs.existsSync(this._getFileByKey(key));
  }

  remove(key, cb, isSync = false) {
    if (this.has(key)) {
      if (isSync === true) {
        return fs.unlinkSync(this._getFileByKey(key));
      } else {
        return fs.unlink(this._getFileByKey(key), cb);
      }
    }
  }

  _getFileByKey(key) {
    return `${this.dataDir}${key}.json`;
  }
}

const simpleStorage = new SimpleStorage();

module.exports = simpleStorage;

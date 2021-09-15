const fs = require('fs');
const path = require('path');

/**
 * 递归创建文件夹
 * @param {*} dirname
 * @returns
 */
export function createDirIfNotExists(dirname) {
  function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirname))) {
        fs.mkdirSync(dirname);
        return true;
      }
    }
  }
  mkdirsSync(dirname);
  return dirname;
}

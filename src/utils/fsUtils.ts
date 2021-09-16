import { dirname } from 'path';
import { existsSync, mkdirSync } from 'fs';

/**
 * 递归创建文件夹
 * @param {*} _dirname
 * @returns
 */
export function createDirIfNotExists(_dirname) {
  function mkdirsSync(_dirname) {
    if (existsSync(_dirname)) {
      return true;
    } else {
      if (mkdirsSync(dirname(_dirname))) {
        mkdirSync(_dirname);
        return true;
      }
    }
  }
  mkdirsSync(_dirname);
  return _dirname;
}

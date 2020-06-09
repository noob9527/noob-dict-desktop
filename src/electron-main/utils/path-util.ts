import * as path from 'path';
import isDev from 'electron-is-dev';
import { Runtime } from '../../common/utils/runtime';
import { remote } from 'electron';

const assetsPath = 'assets';
const iconPath = 'icon';

export {
  getBuildPath,
  getIconPath,
  getAssetsPath,
  getWindowHashUrl
}

function getWindowStaticUrl(): string {
  return isDev
    ? 'http://localhost:3000/'
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`
}

// https://stackoverflow.com/a/47926513
function getWindowHashUrl(hashbang: string = ''): string {
  if (hashbang) {
    return getWindowStaticUrl() + `#/${hashbang}`;
  } else {
    return getWindowStaticUrl();
  }
}

function getBuildPath(relativePath: string = '') {
  const root = Runtime.isRenderer()
    ? remote.app.getAppPath() + '/build'
    // note that __dirname will be evaluated to the build directory at runtime
    : __dirname
  return path.join(root, ...relativePath.split('/'));
}

function getAssetsPath(relativePath: string = '') {
  return getBuildPath(`${assetsPath}/${relativePath}`)
}

function getIconPath(relativePath: string = '') {
  return getAssetsPath(`${iconPath}/${relativePath}`);
}

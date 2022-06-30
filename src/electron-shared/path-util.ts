import * as path from 'path';
import { Runtime } from './runtime';
const assetsPath = 'assets';
const iconPath = 'icon';

export {
  getBuildPath,
  getIconPath,
  getAssetsPath,
  getWindowHashUrl
}

function getWindowStaticUrl(): string {
  return Runtime.isDev
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
  let root: string;
  if (Runtime.isRenderer()) {
    const remote = require('@electron/remote');
    root = remote.app.getAppPath()
  } else {
    // note that __dirname will be evaluated to the build directory at runtime
    root = __dirname
  }
  return path.join(root, ...relativePath.split('/'));
}

function getAssetsPath(relativePath: string = '') {
  return getBuildPath(`${assetsPath}/${relativePath}`)
}

function getIconPath(relativePath: string = '') {
  return getAssetsPath(`${iconPath}/${relativePath}`);
}

import * as path from 'path';
import isDev from 'electron-is-dev';

const assetsPath = 'assets';

export {
  getBuildPath,
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
  return path.join(__dirname, ...relativePath.split('/'));
}

function getAssetsPath(relativePath: string = "") {
  // note that __dirname will be evaluated to the build directory at runtime
  return path.join(__dirname, assetsPath, ...relativePath.split('/'));
}


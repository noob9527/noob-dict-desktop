import * as path from 'path';
import { Runtime } from './runtime';

const assetsPath = 'assets';
const iconPath = 'icon';

export {
  getBuildPath,
  getPublicPath,
  getIconPath,
  getAssetsPath,
  getWindowHashUrl,
  getUserDataPath,
  getDefaultLocalDBPath,
};

function getWindowStaticUrl(): string {
  return Runtime.isDev
    ? process.env.VITE_DEV_SERVER_URL!!
    : `file://${path.join(__dirname, '..', 'build', 'index.html')}`;
}

// https://stackoverflow.com/a/47926513
function getWindowHashUrl(hashbang: string = ''): string {
  if (hashbang) {
    return getWindowStaticUrl() + `#/${hashbang}`;
  } else {
    return getWindowStaticUrl();
  }
}

/**
 * <root>/build/
 *
 * we might use some build plugin to generate files
 * the generated file will be put into this folder.
 * @param relativePath
 */
function getBuildPath(relativePath: string = '') {
  let root: string;
  if (Runtime.isRenderer()) {
    // const remote = require('@electron/remote');
    // root = remote.app.getAppPath();
    // <root>/build
    root = (window as any).bridge.appPath;
  } else {
    // note that __dirname will be evaluated to the build directory at runtime
    root = __dirname;
  }
  return path.join(root, ...relativePath.split('/'));
}

/**
 * <root>/public/assets/
 *
 * for old build processes, we use
 * `getBuildPath(`${assetsPath}/${relativePath}`);`
 * to get assets path.
 * this requires we copy public/assets to build/assets first,
 * which means we need to run `yarn build` at least once
 * to make `yarn dev` works.
 * (because the build processes will do the copy job).
 *
 * now, we just access <root>/public/assets directly.
 *
 * @see https://vitejs.dev/guide/assets.html#the-public-directory
 * @param relativePath
 */
function getPublicPath(relativePath: string = '') {
  let root: string;
  if (Runtime.isDev) {
    // <root>/public
    root = path.resolve(path.join(__dirname, '../public'));
  } else {
    // note that __dirname will be evaluated to the build directory at runtime
    root = __dirname;
  }
  return path.join(root, ...relativePath.split('/'));
}

function getAssetsPath(relativePath: string = '') {
  return getPublicPath(`${assetsPath}/${relativePath}`);
}

function getIconPath(relativePath: string = '') {
  return getAssetsPath(`${iconPath}/${relativePath}`);
}

function getUserDataPath(relativePath: string = '') {
  let folder: string;
  if (Runtime.isRenderer()) {
    // const remote = require('@electron/remote');
    // folder = remote.app.getPath('userData');
    folder = (window as any).bridge.userDataPath;
  } else {
    const electron = require('electron');
    folder = electron.app.getPath('userData');
  }
  return path.join(folder, ...relativePath.split('/'));
}

function getDefaultLocalDBPath() {
  return getUserDataPath('DB.sqlite');
}

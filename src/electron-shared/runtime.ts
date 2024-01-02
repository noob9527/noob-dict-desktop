import * as electron from 'electron';

export const Runtime = {
  isRenderer,
  isDev: isDev(),
  platform: getPlatform(),
  isMac: isMac(),
};

function isRenderer() {
  // running in a web browser
  if (typeof process === 'undefined') return true;

  // node-integration is disabled
  if (!process) return true;

  // We're in node.js somehow
  if (!process.type) return false;

  if(process.argv.includes('--app-path=/Users/xy/Workspace/code/personal/noob-dict/noob-dict-desktop/node_modules/@jest-runner/electron/build')) {
    // jest runner
    return false;
  }

  return process.type === 'renderer';
}

function isDev(): boolean {
  if (isRenderer()) {
    // Uncaught Error: Cannot find module '@electron/remote'
    // when build app with vite.
    // const remote = require('@electron/remote');
    // return !remote.app.isPackaged;

    // https://www.electronjs.org/docs/latest/api/context-bridge
    // @see electron-preload.ts
    return (window as any).bridge.isDev
  } else {
    if (!electron.app) {
      // jest runner
      return true;
    }
    return !electron.app.isPackaged;
  }
}

function getPlatform(): NodeJS.Platform {
  if (isRenderer()) {
    // Uncaught Error: Cannot find module '@electron/remote'
    // when build app with vite.
    // const remote = require('@electron/remote');
    // return remote.process.platform;

    // https://www.electronjs.org/docs/latest/api/context-bridge
    // @see electron-preload.ts
    return (window as any).bridge.platform
  } else {
    return process.platform;
  }
}

function isMac(): boolean {
  return getPlatform() === 'darwin'
}

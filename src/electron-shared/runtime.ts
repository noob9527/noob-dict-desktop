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

  return process.type === 'renderer'
}

function isDev(): boolean {
  if (isRenderer()) {
    const remote = require('@electron/remote');
    return !remote.app.isPackaged;
  } else {
    return !electron.app.isPackaged;
  }
}

function getProcess(): NodeJS.Process {
  if (isRenderer()) {
    const remote = require('@electron/remote');
    return remote.process;
  } else {
    return process;
  }
}

function getPlatform(): NodeJS.Platform {
  return getProcess().platform
}

function isMac(): boolean {
  return getPlatform() === 'darwin'
}

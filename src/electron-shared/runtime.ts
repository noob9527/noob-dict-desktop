import * as electron from 'electron';

export const Runtime = {
  isRenderer,
  isDev: isDev(),
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

/**
 * currently, two logging utils is installed in this app
 * namely, electron-timer and electron-log
 *
 * somehow electron-timber log doesn't show up in prod env
 *
 * reference:
 * - https://github.com/megahertz/electron-log
 * - https://github.com/sindresorhus/electron-timber
 */
import timber from 'electron-timber';
import log from 'electron-log';
import { Runtime } from './runtime';

interface Logger {
  log(...args: any[]): void;

  debug(...args: any[]): void;

  warn(...args: any[]): void;

  error(...args: any[]): void;
}

timber.debug = timber.log;

const res = Runtime.isRenderer() ? timber : log;
export default res as Logger


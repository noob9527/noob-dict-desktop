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

  getLogger(prefix: string): Logger
}

timber.debug = timber.log;
const internalLogger = Runtime.isRenderer() ? timber : log;

class LoggerImpl implements Logger {

  constructor(
    private prefix?: string
  ) {
  }

  debug(...args: any[]): void {
    internalLogger.debug(...this.addPrefix(...args));
  }

  error(...args: any[]): void {
    internalLogger.error(...this.addPrefix(...args));
  }

  log(...args: any[]): void {
    internalLogger.log(...this.addPrefix(...args));
  }

  warn(...args: any[]): void {
    internalLogger.warn(...this.addPrefix(...args));
  }

  private addPrefix(...args: any[]): any[] {
    return this.prefix ? [this.prefix + ':', ...args] : args;
  }

  getLogger(prefix: string): Logger {
    const p = this.prefix ? this.prefix + '.' + prefix : prefix;
    return new LoggerImpl(p);
  }
}

const logger = new LoggerImpl();

export default logger as Logger


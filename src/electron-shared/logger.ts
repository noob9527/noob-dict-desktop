/**
 * reference:
 * - https://github.com/megahertz/electron-log
 */
import log from 'electron-log';
import { Runtime } from './runtime';

interface Logger {
  log(...args: any[]): void;

  info(...args: any[]): void;

  debug(...args: any[]): void;

  warn(...args: any[]): void;

  error(...args: any[]): void;

  getLogger(prefix: string): Logger
}

const internalLogger = Runtime.isRenderer()
        ? console
        : log;

class LoggerImpl implements Logger {

  constructor(
    private prefix?: string,
  ) {
    // otherwise this line
    // `autoUpdater.logger = logger;`
    // will throw error
    this.addPrefix = this.addPrefix.bind(this);
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

  info(...args: any[]): void {
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

export default logger as Logger;


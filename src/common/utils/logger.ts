import logger from 'electron-timber';

interface Logger {
    log(...args: any[]): void;
    warn(...args: any[]): void;
    error(...args: any[]): void;
}

export default logger as Logger
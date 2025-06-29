import { Logger } from '../protocols/log-protocol';

class LogClass implements Logger {
  info(message: string, meta?: any): void {
    console.info(message, meta);
  }

  debug(message: string, meta?: any): void {
    console.debug(message, meta);
  }

  warn(message: string, meta?: any): void {
    console.warn(message, meta);
  }

  error(message: string, meta?: any): void {
    console.error(message, meta);
  }
}

export const Log = new LogClass();

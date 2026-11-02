const SENSITIVE = /("?(?:password|card_?number|cvc)"?\s*[:=]\s*)("[^"]*"|[^,&\s}]+)/gi;

export function redact(value: unknown): string {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return (text ?? '').replace(SENSITIVE, '$1"***"');
}

type Level = 'info' | 'warn' | 'error';

function write(level: Level, message: string, meta?: unknown): void {
  const line = `[${new Date().toISOString()}] [${level.toUpperCase()}] ${message}${
    meta === undefined ? '' : ` ${redact(meta)}`
  }`;
  process.stdout.write(`${line}\n`);
}

export const logger = {
  info: (message: string, meta?: unknown): void => write('info', message, meta),
  warn: (message: string, meta?: unknown): void => write('warn', message, meta),
  error: (message: string, meta?: unknown): void => write('error', message, meta),
};

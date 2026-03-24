type LogLevel = 'info' | 'error' | 'warn';

interface LogData {
  [key: string]: unknown;
}

export function log(level: LogLevel, event: string, data: LogData): void {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    event,
    ...data,
  };

  // In development, log to console with formatting
  if (process.env.NODE_ENV === 'development') {
    const levelColors = {
      info: '\x1b[36m',  // cyan
      error: '\x1b[31m', // red
      warn: '\x1b[33m',  // yellow
    };
    const reset = '\x1b[0m';
    console.log(
      `${levelColors[level]}[${level.toUpperCase()}]${reset} ${timestamp} - ${event}`,
      data
    );
  } else {
    // In production, log as JSON for easier parsing
    console.log(JSON.stringify(logEntry));
  }
}

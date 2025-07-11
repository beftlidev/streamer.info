import { StreamerError } from '../types';

export class ErrorHandler {
  static createStreamerError(
    message: string,
    platform?: string,
    username?: string,
    statusCode?: number
  ): StreamerError {
    const error = new Error(message) as StreamerError;
    if (platform !== undefined) error.platform = platform;
    if (username !== undefined) error.username = username;
    if (statusCode !== undefined) error.statusCode = statusCode;
    return error;
  }

  static createHttpError(statusCode: number, statusText: string): string {
    return `HTTP ${statusCode}: ${statusText}`;
  }

  static handleError(error: unknown, context?: string): string {
    if (error instanceof Error) {
      const prefix = context ? `[${context}] ` : '';
      return `${prefix}${error.message}`;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unknown error occurred';
  }

  static isTimeoutError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('timeout') || message.includes('navigation timeout');
    }
    return false;
  }

  static isNetworkError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('network') || 
             message.includes('econnreset') || 
             message.includes('enotfound') ||
             message.includes('econnrefused');
    }
    return false;
  }

  static isBrowserError(error: unknown): boolean {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('browser') || 
             message.includes('page') || 
             message.includes('target closed');
    }
    return false;
  }

  static getErrorType(error: unknown): string {
    if (this.isTimeoutError(error)) return 'TIMEOUT';
    if (this.isNetworkError(error)) return 'NETWORK';
    if (this.isBrowserError(error)) return 'BROWSER';
    return 'UNKNOWN';
  }

  static isRetryableError(error: unknown): boolean {
    return this.isTimeoutError(error) || 
           this.isNetworkError(error) || 
           this.isBrowserError(error);
  }

  static logError(error: unknown, context?: string): void {
    const errorType = this.getErrorType(error);
    const errorMessage = this.handleError(error, context);
    console.error(`[${errorType}] ${errorMessage}`);
  }
}

export function withRetry<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxRetries: number = 3,
  delay: number = 1000
): (...args: T) => Promise<R> {
  return async (...args: T): Promise<R> => {
    let lastError: unknown;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt === maxRetries || !ErrorHandler.isRetryableError(error)) {
          throw error;
        }
        
        ErrorHandler.logError(error, `Attempt ${attempt}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError;
  };
} 
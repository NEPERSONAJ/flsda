import { ApiError } from '../api';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000
  } = options;

  let lastError: Error | null = null;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof ApiError && error.statusCode === 429) {
        const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
        continue;
      }
      
      throw error;
    }
  }
  
  throw lastError || new Error('Превышено максимальное количество попыток');
}
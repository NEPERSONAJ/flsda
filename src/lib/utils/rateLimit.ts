interface QueueItem {
  operation: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

class RateLimiter {
  private queue: QueueItem[] = [];
  private isProcessing = false;
  private lastRequestTime = 0;
  private readonly minInterval: number;
  private readonly maxQueueSize: number;

  constructor(requestsPerSecond: number = 1, maxQueueSize: number = 10) {
    this.minInterval = 1000 / requestsPerSecond;
    this.maxQueueSize = maxQueueSize;
  }

  async enqueue<T>(operation: () => Promise<T>): Promise<T> {
    if (this.queue.length >= this.maxQueueSize) {
      throw new Error('Очередь запросов переполнена. Пожалуйста, подождите.');
    }

    return new Promise((resolve, reject) => {
      this.queue.push({ operation, resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.queue.length > 0) {
      const timeSinceLastRequest = Date.now() - this.lastRequestTime;
      const timeToWait = Math.max(0, this.minInterval - timeSinceLastRequest);
      
      if (timeToWait > 0) {
        await new Promise(resolve => setTimeout(resolve, timeToWait));
      }
      
      const item = this.queue.shift()!;
      
      try {
        const result = await item.operation();
        item.resolve(result);
      } catch (error) {
        item.reject(error);
      }
      
      this.lastRequestTime = Date.now();
    }
    
    this.isProcessing = false;
  }

  clearQueue() {
    const error = new Error('Очередь запросов очищена');
    this.queue.forEach(item => item.reject(error));
    this.queue = [];
  }
}

export const rateLimiter = new RateLimiter(1, 10);
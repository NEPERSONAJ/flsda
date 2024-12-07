export class DownloadError extends Error {
  constructor(message: string, public readonly technical?: string) {
    super(message);
    this.name = 'DownloadError';
  }
}
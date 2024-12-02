export class HttpException extends Error {
  constructor(status, message, error, additionalData = {}) {
    super(message);
    this.status = status;
    this.error = error;
    this.additionalData = additionalData;
  }
}
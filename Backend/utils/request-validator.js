export class RequestValidation {
  static createAPIResponse(success, code, message, data) {
    return {
      success,
      code,
      message,
      data,
    };
  }
}

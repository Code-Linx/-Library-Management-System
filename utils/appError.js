class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Call the Error constructor to set the message
    this.statusCode = statusCode;
    this.isOperational = true; // To indicate if the error is expected or not
    Error.captureStackTrace(this, this.constructor); // Capture the stack trace for debugging
  }
}

module.exports = AppError;

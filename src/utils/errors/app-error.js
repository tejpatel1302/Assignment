class AppError extends Error {
    constructor(message, statusCode, explanation = message) {
        super(message);
        this.statusCode = statusCode;
        this.explanation = explanation; // Optional explanation, defaults to the message if not provided
        this.isOperational = true;  // Flag to identify operational errors vs programming errors
        Error.captureStackTrace(this, this.constructor); // Captures the stack trace for easier debugging
    }
}

module.exports = AppError;

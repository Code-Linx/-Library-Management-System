const AppError = require("../utils/appError");

// Handling Sequelize specific errors
const handleSequelizeUniqueConstraintError = (err) => {
  const message = `Duplicate field value: ${err.errors[0].message}. Please use another value!`;
  return new AppError(message, 400);
};

const handleSequelizeValidationError = (err) => {
  const message = `Invalid input data: ${err.errors
    .map((e) => e.message)
    .join(", ")}`;
  return new AppError(message, 400);
};

const handleSequelizeForeignKeyConstraintError = (err) => {
  const message = `Foreign key constraint violation: ${err.message}`;
  return new AppError(message, 400);
};

const handleSequelizeDatabaseError = (err) => {
  const message = `Database error: ${err.message}`;
  return new AppError(message, 500);
};

const handleJWTError = () => {
  return new AppError("Invalid token. Please log in again!", 401);
};

const handleJWTExpiredError = () => {
  return new AppError("Your token has expired. Please log in again!", 401);
};

// Send error in development mode
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: "error",
    message: err.message,
    stack: err.stack, // Expose the stack trace for debugging
  });
};

// Send error in production mode
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Operational errors are the ones we expect, so send them as is
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    // Programming errors or other unanticipated errors
    console.error("ERROR 💥:", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong! Please try again later.",
    });
  }
};

// Global error handling function
const handleError = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Sequelize specific error handling
  if (err.name === "SequelizeUniqueConstraintError") {
    error = handleSequelizeUniqueConstraintError(err);
  }

  if (err.name === "SequelizeValidationError") {
    error = handleSequelizeValidationError(err);
  }

  if (err.name === "SequelizeForeignKeyConstraintError") {
    error = handleSequelizeForeignKeyConstraintError(err);
  }

  if (err.name === "SequelizeDatabaseError") {
    error = handleSequelizeDatabaseError(err);
  }

  // JWT error handling
  if (err.name === "JsonWebTokenError") error = handleJWTError();
  if (err.name === "TokenExpiredError") error = handleJWTExpiredError();

  // Send error response based on the environment
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(error, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(error, res);
  }
};

module.exports = {
  handleError,
};

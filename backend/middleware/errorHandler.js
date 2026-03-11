const errorHandler = (err, req, res, next) => {
  console.error("❌ Global Error Triggered:", err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show stack trace if we are in development mode for security reasons
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;

const catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next); // Automatically pass any error to the next middleware (error handler)
  };
};

module.exports = catchAsync;

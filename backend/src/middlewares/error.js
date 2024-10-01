class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

/* export const errorMiddleware=(err,req,res,next)=>{
    err.message=err.message || "Internal Error";
    err.statusCode=err.statusCode || 500; */

export const errorMiddleware = (err, req, res, next) => {
  console.log(err); 
  // Set default error message and status code
  const statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "CastError") {
    message = `Invalid ${err.path}: ${err.value}`;
    err = new ErrorHandler(message, 400);
  }
  // You can add other custom error handlers here, like for validation errors
  // if (err.name === "ValidationError") {
  //     message = err.message;
  //     err = new ErrorHandler(message, 400);
  // }


  //Try below
  // return res.status(err.statusCode || statusCode).json({
  //   success: false,
  //   message: err.message || message,
  // });
  res.status(statusCode).json({
    success: false,
    message: message,
  });
};
export { ErrorHandler };

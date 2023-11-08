const ApiError = require("../utls/apiError");

const sendErrorForDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorForpro = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
const handelJwtInvaildSignture = () =>
  new ApiError("invaild token,pls login again", 401);

const handelJwtExpired = () => new ApiError("expired token", 401);

///////////////////////////
const globelError = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-use-before-define
    sendErrorForDev(err, res);
  } else {
    if (err.name === "JsonWebTokenError") err = handelJwtInvaildSignture();
    if (err.name === "TokenExpiredError") err = handelJwtExpired();

    // eslint-disable-next-line no-use-before-define
    sendErrorForpro(err, res);
  }
};
module.exports = globelError;

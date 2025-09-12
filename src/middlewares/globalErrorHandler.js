import { StatusCodes } from "http-status-codes";
import CustomAPIError from "../errors/customApiError.js";
import { isProd } from "../helper.js";
import { X_REQUEST_ID_KEY } from "../constants.js";

export default (err, req, res, next) => {
  console.error('Error occurred:', {
    requestId: req.headers[X_REQUEST_ID_KEY],
    name: err.name,
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  if (err instanceof CustomAPIError) {
    res.status(err.statusCode).json({ msg: err.message });
    return;
  }

  // Default error response
  const isDevelopment = !isProd();

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: isDevelopment ? error.message : 'Internal server error',
    type: 'InternalServerError',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: error.stack })
  });
}
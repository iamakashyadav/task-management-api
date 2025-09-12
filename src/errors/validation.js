import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customApiError.js";

class ValidationError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.UNPROCESSABLE_ENTITY);
  }
}

export default ValidationError;
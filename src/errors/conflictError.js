import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customApiError.js";

class ConflictError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.CONFLICT);
  }
}

export default ConflictError;
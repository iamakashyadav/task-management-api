import { StatusCodes } from "http-status-codes";
import CustomAPIError from "./customApiError.js";

class AuthenticationError extends CustomAPIError {
  constructor(message) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}

export default AuthenticationError;
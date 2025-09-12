import jwt from 'jsonwebtoken';
import AuthenticationError from "../errors/authenticationError.js";
import { JWT_SECRET } from '../constants.js';

const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      throw new AuthenticationError('Authorization header missing');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Token missing');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AuthenticationError('Invalid token'));
    } else if (error.name === 'TokenExpiredError') {
      next(new AuthenticationError('Token expired'));
    } else {
      next(error);
    }
  }
};

export default authenticate;
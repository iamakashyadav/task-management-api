import { v4 as uuidv4 } from 'uuid';
import { X_REQUEST_ID_KEY } from '../constants.js';

const requestId = (req, res, next) => {
    let requestId = req.headers[X_REQUEST_ID_KEY];
    if (!requestId) {
        requestId = uuidv4();
        req.headers[X_REQUEST_ID_KEY] = requestId;
    }
    res.set(X_REQUEST_ID_KEY, requestId);
    next();
}

export default requestId;
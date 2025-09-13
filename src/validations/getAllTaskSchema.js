import Joi from 'joi';
import { VALID_TASK_STATUSES } from '../constants.js';

export default Joi.object({ 
    status: Joi.string().valid(...VALID_TASK_STATUSES),
    page: Joi.number(),
    limit: Joi.number(),
    search: Joi.string(),
}).unknown(true);
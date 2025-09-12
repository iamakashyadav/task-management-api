import Joi from 'joi';
import { VALID_TASK_STATUSES } from '../constants.js';

export default Joi.object({
    title: Joi.string().min(3).max(100).messages({
        'string.min': 'title must be at least 3 characters',
        'string.max': 'title must be less than eqal to 100 characters'
    }),
    description: Joi.string().max(1000).messages({
        'string.max': 'description must be less than eqal to 50 characters'
    }),
    status: Joi.string().valid(...VALID_TASK_STATUSES),
});
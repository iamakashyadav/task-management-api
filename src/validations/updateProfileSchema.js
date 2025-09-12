import Joi from 'joi';

export default Joi.object({
    email: Joi.string().email().messages({
        'string.email': 'Email must be valid',
    }),
    name: Joi.string().min(3).max(50).messages({
        'string.min': 'name must be at least 3 characters',
        'string.max': 'name must be less than eqal to 50 characters'
    })
}).or('name', 'email');
import Joi from 'joi';

export default Joi.object({
    name: Joi.string().min(3).max(50).required().messages({
        'string.min': 'name must be at least 3 characters',
        'string.max': 'name must be less than eqal to 50 characters'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be valid',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters',
        'any.required': 'Password is required'
    })
});
import Joi from 'joi';

export const searchValidation = Joi.object({
    q: Joi.string().required(),
});
import Joi from 'joi';

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string(),
  password: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email(),
  username: Joi.string(),
  password: Joi.string().required(),
}).xor('email', 'username');
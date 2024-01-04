import Joi from 'joi';

export const createNoteValidation = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});

export const updateNoteValidation = Joi.object({
  id: Joi.string().required(),
  title: Joi.string(),
  content: Joi.string(),
});

export const deleteNoteValidation = Joi.object({
  id: Joi.string().required(),
});

export const getNoteByIdValidation = Joi.object({
  id: Joi.string().required(),
});

export const shareNoteValidation = Joi.object({
  // userId: Joi.string().required(),
  id: Joi.string().required(),
});

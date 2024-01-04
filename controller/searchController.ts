import { Request, Response } from 'express';
import { IUserDocument } from '../models/user';
import { searchValidation } from '../validate/searchValidation';
import { searchNotes } from '../service/searchService';

export const searchNotesController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const { error, value } = searchValidation.validate(req.query);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    const notes = await searchNotes(user._id, value.q);
    res.status(notes.status).json(notes);
  } catch (error) {
    console.error("error searchNotesController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

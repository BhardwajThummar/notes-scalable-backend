import { Request, Response } from 'express';
import { getAllNotes, getNoteById, createNote, updateNote, deleteNote, shareNote } from '../service/noteService';
import { IUserDocument } from '../models/user';
import { getNoteByIdValidation, createNoteValidation, updateNoteValidation, deleteNoteValidation, shareNoteValidation } from '../validate/noteValidation';

export const getAllNotesController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const notes = await getAllNotes(user._id);
    res.status(notes.status).json(notes);
  } catch (error) {
    console.error("error getAllNotesController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getNoteByIdController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const { error, value } = getNoteByIdValidation.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const note = await getNoteById(user._id,value.id);
    res.status(note.status).json(note);
  } catch (error) {
    console.error("error getAllNotesController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const createNoteController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const { error, value } = createNoteValidation.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const note = await createNote(
      user._id,
      value.title,
      value.content
    );

    res.status(201).json(note);

  } catch (error) {
    console.error("error createNoteController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const updateNoteController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const { error, value } = updateNoteValidation.validate({...req.body, ...req.params});

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    console.log(value);
    
    const note = await updateNote(
      user._id,
      value.id,
      value.title,
      value.content
    );

    res.status(note.status).json(note);

  } catch (error) {
    console.error("error updateNoteController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const deleteNoteController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const { error, value } = deleteNoteValidation.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const note = await deleteNote(
      user._id,
      value.id
    );

    res.status(note.status).json(note);

  } catch (error) {
    console.error("error deleteNoteController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const shareNoteController = async (req: Request, res: Response) => {
  try {
    const user: IUserDocument = req?.user as IUserDocument;
    const { error, value } = shareNoteValidation.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const note = await shareNote(
      user._id,
      value.id,
      value.userId
    );

    res.status(note.status).json(note);

  } catch (error) {
    console.error("error shareNoteController :>>", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

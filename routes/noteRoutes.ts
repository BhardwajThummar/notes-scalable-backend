import express from 'express';
const router = express.Router();
import { createNoteController, deleteNoteController, getAllNotesController, getNoteByIdController, shareNoteController, updateNoteController } from '../controller/noteController';
import passport from '../middleware/authentication';

// Protect note routes with authentication middleware
router.use(passport.authenticate('jwt', { session: false }));

// Define note routes
router.get('/notes', getAllNotesController);
router.get('/notes/:id', getNoteByIdController);
router.post('/notes', createNoteController);
router.put('/notes/:id', updateNoteController);
router.delete('/notes/:id', deleteNoteController);
router.post('/notes/:id/share', shareNoteController);

export default router;
import express from 'express';
const router = express.Router();
import { searchNotesController } from '../controller/searchController';
import passport from "../middleware/authentication";

// Protect search route with authentication middleware
router.use(passport.authenticate('jwt', { session: false }));

// Define search route
router.get('/search', searchNotesController);

export default router;

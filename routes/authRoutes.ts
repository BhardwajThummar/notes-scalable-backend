import express from 'express';
const router = express.Router();
import { signupController, loginController } from '../controller/authController';

// Define authentication routes
router.post('/signup', signupController);
router.post('/login', loginController);

export default router;

import express from 'express';
import { registerUser, loginUser, verifyEmail, resendVerificationEmail } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser)
    .post('/login', loginUser)
    .post('/resend-verification', resendVerificationEmail)
    .get('/verify/:token', verifyEmail);

export default router;

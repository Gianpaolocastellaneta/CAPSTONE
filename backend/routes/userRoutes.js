import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
} from '../controllers/userController.js';
import { registerUser, loginUser } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js'; 
import passport from 'passport';



const router = express.Router();

router.post('/register', upload.single('profileImage'), registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), updateUserProfile);


// --- Rotte per autenticazione Google ---

// Route per avviare il login con Google
router.get('/login-google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Route per gestire il callback di Google
router.get('/google-callback',
  passport.authenticate('google', { session: false }), 
  (req, res) => {
    // Reindirizza al client passando il token
    res.redirect(`http://localhost:3000/auth/google-callback?token=${req.user.token}`);
  }
);

export default router;

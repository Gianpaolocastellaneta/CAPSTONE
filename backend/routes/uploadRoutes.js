import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotta per caricare un'immagine
router.post('/', protect, upload.single('image'), (req, res) => {
  res.status(200).json({ imageUrl: req.file.path });
});



export default router;

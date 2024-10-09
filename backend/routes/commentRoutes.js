import express from 'express';
import {
  getCommentsByProduct,
  addComment,
  updateComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rotta per ottenere tutti i commenti di un prodotto
router.get('/:productId', getCommentsByProduct);

// Rotta per aggiungere un nuovo commento (protetta)
router.post('/:productId', protect, addComment);

// Rotta per modificare un commento esistente (protetta)
router.put('/:commentId', protect, updateComment);

// Rotta per eliminare un commento (protetta)
router.delete('/:commentId', protect, deleteComment);

export default router;

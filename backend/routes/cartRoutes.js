import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { addToCart, removeFromCart, clearCart, getCart, updateCartItem} from '../controllers/cartController.js';

const router = express.Router();

// Aggiungi un prodotto al carrello
router.post('/add', protect, addToCart);

// Rimuovi un prodotto dal carrello
router.delete('/remove/:productId', protect, removeFromCart);

// Rotta per aggiornare la quantità di un prodotto
router.put('/update', protect, updateCartItem); 

// Svuota il carrello
router.delete('/clear', protect, clearCart);

// Ottengo il carrello
router.get('/', protect, getCart);

export default router;

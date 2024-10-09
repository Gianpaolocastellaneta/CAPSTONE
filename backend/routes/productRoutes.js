import express from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getUserProducts } from '../controllers/productController.js';
import { protect } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js'; 


const router = express.Router();

// Rotta per creare un nuovo prodotto
router.post('/', protect, upload.single('image'), createProduct);

// Rotta per ottenere tutti i prodotti
router.get('/', getProducts);

// Rotta per ottenere i prodotti di uno specifico utente
router.get('/productsUser', protect, getUserProducts);

// Rotta per ottenere un prodotto specifico tramite ID
router.get('/:id', getProductById);

// Rotta per aggiornare un prodotto
router.put('/:id', protect, upload.single('image'), updateProduct);

// Rotta per eliminare un prodotto
router.delete('/:id', protect, deleteProduct);

export default router;

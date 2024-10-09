import mongoose from 'mongoose';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Aggiungo un prodotto al carrello
export const addToCart = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiunta al carrello.', error });
  }
};

// Aggiorno la quantità di un prodotto nel carrello
export const updateCartItem = async (req, res) => {
  const userId = req.user._id;
  const { productId, quantity } = req.body;

 
  if (quantity < 1) {
    return res.status(400).json({ message: 'La quantità deve essere almeno 1.' });
  }

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: 'Carrello non trovato.' });
    }

    const itemIndex = cart.items.findIndex(item => item.product._id.toString() === productId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Prodotto non trovato nel carrello.' });
    }

    // Aggiorno la quantità del prodotto
    cart.items[itemIndex].quantity = quantity;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prodotto nel carrello.', error });
  }
};

// Rimuovo un prodotto dal carrello
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.params;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: 'Carrello non trovato.' });
    }

    // Converte il productId in un ObjectId utilizzando "new"
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Trova l'indice del prodotto nel carrello
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productObjectId.toString());

    if (itemIndex > -1) {
      // Riduci la quantità o rimuovi il prodotto se la quantità è 1
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;  // Riduci la quantità di 1
      } else {
        cart.items.splice(itemIndex, 1);  // Rimuovi l'elemento dal carrello se la quantità è 1
      }
    } else {
      return res.status(404).json({ message: 'Prodotto non trovato nel carrello.' });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella rimozione dal carrello.', error });
  }
};

// Svuoto il carrello
export const clearCart = async (req, res) => {
  const userId = req.user._id;

  try {
    await Cart.findOneAndDelete({ user: userId });
    res.status(200).json({ message: 'Carrello svuotato.' });
  } catch (error) {
    res.status(500).json({ message: 'Errore nello svuotamento del carrello.', error });
  }
};

// Ottengo il carrello
export const getCart = async (req, res) => {
  const userId = req.user._id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate('items.product');
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del carrello.', error });
  }
};

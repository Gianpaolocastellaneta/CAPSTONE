import Comment from '../models/Comment.js';
import Product from '../models/Product.js';

// Ottengo tutti i commenti
export const getCommentsByProduct = async (req, res) => {
  try {
    const comments = await Comment.find({ product: req.params.productId }).populate('user');
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei commenti', error });
  }
};


// Aggiungo un commento
export const addComment = async (req, res) => {
  const { content } = req.body;

  try {
    const product = await Product.findById(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    if (!content) {
      return res.status(400).json({ message: 'Il contenuto del commento è obbligatorio.' });
    }

    const comment = new Comment({
      content,
      product: req.params.productId,
      user: req.user._id,
    });

    // Salva il commento
    await comment.save();

    // Popola i campi di riferimento 
    await comment.populate('user'); // Popolo il campo user con i dati utente

    res.status(201).json({ message: 'Commento aggiunto con successo.', comment });
  } catch (error) {
    console.error('Errore nell\'aggiunta del commento:', error);
    res.status(500).json({ message: 'Errore nell\'aggiunta del commento.', error });
  }
};


// Modifico un commento esistente
export const updateComment = async (req, res) => {
  try {
    console.log('Parametri della richiesta:', req.params);
    console.log('Corpo della richiesta:', req.body);

    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId) {
      return res.status(400).json({ message: 'ID del commento mancante.' });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato.' });
    }

    comment.content = content || comment.content;

    const updatedComment = await comment.save();

    res.json(updatedComment);
  } catch (error) {
    console.error('Errore nell\'aggiornamento del commento:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del commento.', error });
  }
};



// Elimino un commento
export const deleteComment = async (req, res) => {
  try {
    console.log('Parametri della richiesta:', req.params);

    const { commentId } = req.params;

    if (!commentId) {
      return res.status(400).json({ message: 'ID del commento mancante.' });
    }

    const comment = await Comment.findByIdAndDelete(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Commento non trovato.' });
    }

    res.json({ message: 'Commento eliminato con successo.' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del commento:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione del commento.', error });
  }
};
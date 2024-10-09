import Product from '../models/Product.js';

// Funzione per creare un nuovo prodotto
export const createProduct = async (req, res) => {
  const { name, description, category, price } = req.body;
  const userId = req.user._id;

  try {
    const imageUrl = req.file ? req.file.path : null; // l'URL dell'immagine

    const product = await Product.create({
      name,
      description,
      category,
      price,
      image: imageUrl, // Salva l'URL dell'immagine
      user: userId,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Errore nella creazione del prodotto.', error });
  }
};

// Funzione per ottenere tutti i prodotti
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate('user', 'name email');
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero dei prodotti.', error });
  }
};

// Funzione per ottenere i prodotti di uno specifico utente
export const getUserProducts = async (req, res) => {
  try {
    // Trova i prodotti che appartengono all'utente loggato
    const products = await Product.find({ user: req.user._id });

    // Restituisci i prodotti
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero dei prodotti.', error });
  }
};

// Funzione per ottenere un prodotto specifico tramite ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate('user', 'name email');
    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recupero del prodotto.', error });
  }
};




export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, category, price } = req.body;

  try {
    console.log('File:', req.file);
    console.log('Params:', req.params);
    console.log('Body:', req.body);

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorizzato ad aggiornare questo prodotto.' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.category = category || product.category
    product.price = price || product.price;

    if (req.file) {
      product.image = req.file.path;
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error('Errore nel salvataggio del prodotto:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prodotto.', error });
  }
};


// Funzione per eliminare un prodotto
export const deleteProduct = async (req, res) => {
  try {
    console.log('Eliminazione del prodotto con ID:', req.params.id);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    await product.deleteOne();
    
    res.json({ message: 'Prodotto eliminato con successo.' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del prodotto:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione del prodotto.', error });
  }
};

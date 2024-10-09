import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from 'cloudinary';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'capstone', // Cartella Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Formati consentiti
  },
});

const upload = multer({ storage });

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Prodotto non trovato.' });
    }

    // Verifica che l'utente sia il proprietario del prodotto
    if (product.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorizzato ad aggiornare questo prodotto.' });
    }

    // Aggiorna i campi del prodotto
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;

    // Se c'è una nuova immagine, aggiornala su Cloudinary
    if (req.file) {
      product.image = req.file.path; // URL dell'immagine Cloudinary
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Errore nell\'aggiornamento del prodotto.', error });
  }
};

export default upload;

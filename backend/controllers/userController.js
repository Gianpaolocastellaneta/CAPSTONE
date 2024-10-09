import User from '../models/User.js';
import bcrypt from 'bcrypt'; 
import jwt from 'jsonwebtoken';
import cloudinary from 'cloudinary';


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Funzione per ottenere il profilo dell'utente
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profileImage: user.profileImage || null,
      });
    } else {
      res.status(404).json({ message: 'Utente non trovato.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore durante il recupero del profilo.', error });
  }
};

// Funzione per aggiornare il profilo dell'utente
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.surname = req.body.surname || user.surname;
      user.email = req.body.email || user.email;

      // Se l'utente ha caricato una nuova immagine del profilo
      if (req.file) {
        // Carica l'immagine su Cloudinary e ottieni l'URL
        const result = await cloudinary.v2.uploader.upload(req.file.path);
        user.profileImage = result.secure_url; // Aggiorna l'immagine del profilo con l'URL di Cloudinary
      }

      // Se la password è stata cambiata, la hashiamo di nuovo
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        surname: updatedUser.surname,
        email: updatedUser.email,
        profileImage: updatedUser.profileImage || null, // Restituisci anche l'immagine aggiornata
        token: generateToken(updatedUser._id), // Rigenera il token
      });
    } else {
      res.status(404);
      throw new Error('Utente non trovato');
    }
  } catch (error) {
    console.error('Errore durante l\'aggiornamento del profilo:', error);
    res.status(500).json({ message: 'Errore durante l\'aggiornamento del profilo.', error });
  }
};
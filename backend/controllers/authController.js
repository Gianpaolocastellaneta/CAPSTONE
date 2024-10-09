import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cloudinary from 'cloudinary';


// Funzione per generare un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '3h' });
};

// Funzione per registrare un nuovo utente
export const registerUser = async (req, res) => {
  const { name, surname, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'L\'utente esiste già.' });
    }

    let profileImage = null;

    if (req.file) {
      // Carico l'immagine su Cloudinary e ottiengo l'URL
      const result = await cloudinary.v2.uploader.upload(req.file.path);
      profileImage = result.secure_url; // Ottengo l'URL dell'immagine
    }

    const user = await User.create({
      name,
      surname,
      email,
      password: await bcrypt.hash(password, 10),
      profileImage,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Dati utente non validi.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Errore nella registrazione dell\'utente.', error });
  }
};

// Funzione per il login dell'utente
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt with:', { email, password });

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      console.log('Login successful:', user);
      res.json({
        _id: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      });
    } else {
      console.log('Invalid credentials'); 
      res.status(401).json({ message: 'Credenziali non valide.' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Errore durante il login.', error });
  }
};
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware per proteggere le rotte
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Ottengo il token dalla header
      token = req.headers.authorization.split(' ')[1];

      // Verifico il token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Ottengo l'utente dal token e lo aggiungo all'oggetto richiesta
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Non autorizzato, token non valido.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Non autorizzato, token non presente.' });
  }
};

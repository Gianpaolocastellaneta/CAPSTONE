import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import passport from 'passport';

dotenv.config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK,
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const { given_name: name, family_name: surname, email, sub: googleId, picture: profileImage } = profile._json;

    // Cerca l'utente nel database per email
    let user = await User.findOne({ email });

    // Se l'utente esiste già, aggiorna il suo Google ID e altri campi
    if (user) {
      user.googleId = googleId;
      user.profileImage = profileImage;
      await user.save();  // Aggiorna l'utente esistente
    } else {
      // Se l'utente non esiste lo creo
      user = new User({
        name,
        surname,
        email,
        googleId,
        profileImage,
        password: null
      });
      await user.save();  // Salva il nuovo utente
    }

    // Crea un JWT per l'utente
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3h' });

    // Passa l'utente e il token a passport
    done(null, { user, token });
  } catch (error) {
    done(error, null);
  }
}));
import express from 'express';
import mongoose from 'mongoose';
import 'dotenv/config'
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import './config/passport.js';




const server = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST;



server.use(express.json())
server.use(cors()) 

server.use(session({ 
  secret: process.env.SESSION_SECRET, 
  resave: false, 
  saveUninitialized: false 
}));

// Inizializzare Passport
server.use(passport.initialize());
server.use(passport.session());

// Rotte
server.use('/api/auth', userRoutes);
server.use('/api/users', userRoutes); //rotta utenti
server.use('/api/products', productRoutes); //rotta prodotti
server.use('/api/comments', commentRoutes); //rotta commenti
server.use('/api/upload', uploadRoutes); //rotta upload immagini
server.use('/api/cart', cartRoutes); //rotta carrello




// Avvio del server
await mongoose
    .connect(process.env.MONGODB_CONNECTION_URI)
    .then(() => console.log('Database OK'))
    .catch((err) => console.log('Errore DB:', err));

server.listen(PORT, () => console.log(`server is listening on ${HOST}:${PORT}`));
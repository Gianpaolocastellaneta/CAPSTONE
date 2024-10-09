# 🌿 PUGLIA MIA

Questo progetto è un'applicazione web full-stack di un Marketplace di Prodotti tipici Pugliesi, sviluppata utilizzando lo stack MERN (MongoDB, Express, React, Node.js). L'applicazione offre funzionalità di creazione, lettura, aggiornamento e cancellazione (CRUD) oltre a un sistema di autenticazione e autorizzazione degli utenti.

## 📝 Caratteristiche principali
- 🛍️ Autenticazione: Sistema di login e registrazione degli utenti, con supporto per l'autenticazione tramite Google OAuth.
- 🔖 Gestione dei Prodotti: Gli utenti autenticati possono creare, modificare ed eliminare i propri Prodotti
- 📝 Recensioni: Possibilità per un utente autenticato di poter recensire i prodotti e modificare/eliminare una recensione personale.
- 👤 Profilo: Possibilità di modificare dati del profilo autenticato
- 🔎 Ricerca: Funzionalità di ricerca per trovare prodotti specifici.
- 🎨 Responsive Design: Layout adattivo per qualsiasi dispositivo.


## 🛠️ Tecnologie utilizzate
### 🖥️ Frontend
- React
- React Router per la navigazione
- Bootstrap e CSS per lo styling
- Animate.css per le animazioni visive


### ⚙️ Backend
- Node.js con Express
- MongoDB con Mongoose per la gestione del database
- JWT per l'autenticazione
- Passport.js per l'autenticazione OAuth
- Multer e Cloudinary per la gestione dei file


### 🛠️ Struttura del progetto
- **frontend**: Contiene l'applicazione React
- **backend**: Contiene il server Express e la logica

### ✈️ Configurazione e Avvio
1. Clona il repository
2. cd backend && npm i
3. cd frontend && npm i
4. Nella cartella backend creare e popolare il file .env clonando il .env.exemple
5. Avvia il server backend - npm run dev
6. Avvia l'applicazione frontend - npm start



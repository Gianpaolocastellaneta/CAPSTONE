import React, { createContext, useState, useEffect, useContext } from 'react';

// Creo il contesto di autenticazione
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // Controlla se esiste un token in localStorage al caricamento della pagina
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
    }
  }, []);

  // Funzione per il login
  const login = (token, user) => {
    setToken(token);
    setUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('token', token);
    console.log('Token salvato:', token); 
    console.log('Utente:', user);
  };

  // Funzione per il logout
  const logout = () => {
    setToken(null);
    setUser(null); // Reset dell'utente
    setIsAuthenticated(false);
    localStorage.removeItem('token'); // Rimuovi il token da localStorage
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook per usare il contesto
export const useAuthContext = () => useContext(AuthContext);

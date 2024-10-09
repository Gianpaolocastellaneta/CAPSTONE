import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Modal, Button } from 'react-bootstrap';
import './css/login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false); // Stato per il modale di successo

  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      console.log('Login response status:', response.status);
  
      if (!response.ok) {
        throw new Error('Login fallito: ' + (await response.text()));
      }
  
      const data = await response.json();
      console.log('Login data:', data);
  
      if (!data.token || !data._id) {
        throw new Error('Token o dati utente mancanti nella risposta.');
      }
  
      const { token, ...user } = data; 
  
      login(token, user); 
  
      // Mostra il modale di successo
      setShowLoginSuccessModal(true);
  
      // Nascondo il modale automaticamente dopo 2 secondi
      setTimeout(() => {
        setShowLoginSuccessModal(false);
        navigate('/'); // Dopo la chiusura automatica del modale, reindirizza alla home
      }, 2000);
    } catch (err) {
      console.error('Login error:', err.message);
      setError(err.message);
    if (err.message === 'Credenziali non valide.') {
      setError('Accesso non eseguito: credenziali non valide');
    } else {
      setError('Accesso non eseguito: credenziali non valide');
    }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className='text-center mb-4'>Accedi</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              placeholder="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-group mb-5">
            <button type="submit" className="btn btn-dark">Accedi</button>
            
              <Button variant='primary' className="btn btn-outline-light" as={Link} to={'http://localhost:5000/api/auth/login-google'}>
               Accedi con <i className="fab fa-google"></i><span className="d-none d-sm-inline">oogle</span>
               </Button>
          </div>
        </form>
        <div className="registration-message">
          <p>Non sei registrato? <Link to="/register">Registrati ora</Link></p>
        </div>
      </div>

      {/* Modale di accesso */}
      <Modal show={showLoginSuccessModal} onHide={() => setShowLoginSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Accesso effettuato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Accesso effettuato correttamente!
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-outline-dark' variant="light" onClick={() => setShowLoginSuccessModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Login;

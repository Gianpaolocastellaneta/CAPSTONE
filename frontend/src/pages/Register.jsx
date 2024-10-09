import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Spinner } from 'react-bootstrap';
import './css/register.css'

const Register = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Stato per l'immagine del profilo
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Stato per lo spinner
  const [showSuccessModal, setShowSuccessModal] = useState(false); // Stato per il modale di successo

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('surname', surname);
    formData.append('email', email);
    formData.append('password', password);

    if (profileImage) {
      formData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer token'
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Registrazione fallita: ' + (await response.text()));
      }

      const data = await response.json();
      
      setIsLoading(false); // Ferma il caricamento
      setShowSuccessModal(true); // Mostra il modale di successo
      
      // Nascondi il modale dopo 3 secondi e reindirizza alla pagina di login
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setIsLoading(false); // Ferma il caricamento
      setError(err.message);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className='text-center'>Registrati</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label className='label-register mx-2'><strong>Nome</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Inserisci il tuo nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className='mx-2'><strong>Cognome</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Inserisci il tuo cognome"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className='mx-2'><strong>Email</strong></label>
            <input
              type="email"
              className="form-control"
              placeholder="Inserisci email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className='mx-2'><strong>Password</strong></label>
            <input
              type="password"
              className="form-control"
              placeholder="Inserisci password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className='mx-2'><strong>Immagine del Profilo</strong></label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className='btn-register'>
            <button type="submit" className="btn btn-dark" disabled={isLoading}>
              {isLoading ? (
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                'Registrati'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Modale per la registrazione avvenuta con successo */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrazione effettuata</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Registrazione avvenuta con successo! Per continuare, accedi.
        </Modal.Body>
        <Modal.Footer>
          <Button className='btn btn-outline-dark' variant="light" onClick={() => setShowSuccessModal(false)}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Register;

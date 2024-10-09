import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './css/cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false); // Stato per il modale
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
      } else {
        setIsAuthenticated(true);
        await fetchCart(); // Carica il carrello quando l'utente è autenticato
      }
    };

    checkAuth();
  }, [navigate]);

  const fetchCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        throw new Error('Errore nel recupero del carrello');
      }
      const data = await response.json();
      setCartItems(data.items);
      calculateTotal(data.items);
    } catch (error) {
      console.error('Errore durante il recupero del carrello:', error);
    }
  };

  const calculateTotal = (items) => {
    const totalAmount = items.reduce((acc, item) => {
      const price = item.product?.price || 0;
      return acc + price * item.quantity;
    }, 0);
    setTotal(totalAmount);
  };

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          productId: productId,
          quantity: newQuantity,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento della quantità');
      }
  
      // Aggiorna lo stato locale con i nuovi dati
      const updatedCartItems = cartItems.map(item => 
        item.product._id === productId ? { ...item, quantity: newQuantity } : item
      );
      
      setCartItems(updatedCartItems);
  
      // Ricalcola il totale con l'array aggiornato
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error('Errore durante l\'aggiornamento della quantità:', error);
    }
  };
  

  const handleRemoveItem = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Errore durante la rimozione del prodotto dal carrello');
      }
  
      // Filtra fuori il prodotto rimosso dal carrello
      const updatedCartItems = cartItems.filter(item => item.product._id !== productId);
      
      setCartItems(updatedCartItems);
      
      // Ricalcola il totale con il nuovo array
      calculateTotal(updatedCartItems);
    } catch (error) {
      console.error('Errore durante la rimozione del prodotto:', error);
    }
  };
  

  const handleClearCart = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Errore nello svuotamento del carrello');
      }

      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Errore durante lo svuotamento del carrello:', error);
    }
  };

  const handlePurchase = () => {
    // Apri il modale per confermare l'acquisto
    setShowPurchaseModal(true);
  };

  const handleCloseModal = () => {
    setShowPurchaseModal(false);
  };

  return (
    <Container className="mt-5">
      <h2 className='m-body text-center mb-5'><strong>Carrello</strong></h2>
      {cartItems.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <Row key={item.product._id} className="cart-item mb-3">
              <Col xs={4} md={2}>
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="img-fluid"
                />
              </Col>
              <Col xs={8} md={10}>
                <div className="cart-info mx-5">
                  <h4>{item.product.name}</h4>
                  <p>Prezzo: €{item.product.price}</p>
                  <div className="quantity-controls">
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                      disabled={item.quantity === 1}
                    >
                      -
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button
                      variant="secondary"
                      onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                  <Button
                    variant="danger"
                    className="mt-3 btn-cart-remove"
                    onClick={() => handleRemoveItem(item.product._id)}
                  >
                    Rimuovi
                  </Button>
                </div>
              </Col>
            </Row>
          ))}
          <Row className="mt-5">
            <Col md={6}>
              <h3 className='mb-5 mt-3'><u>Totale Carrello</u>: <mark>€{total}</mark></h3>
            </Col>
            <Col md={6} className="text-end">
              <Button className="btn btn-outline-dark text-light border-2" variant="danger" onClick={handleClearCart}>
                Svuota Carrello
              </Button>
              <Button className="btn btn-outline-dark ms-3 text-light border-2 mx-3" variant="success" onClick={handlePurchase}>
                Conferma Acquisto
              </Button>
            </Col>
          </Row>
        </>
      ) : (
        <h5 className='text-center mt-5'>Il carrello è vuoto <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-cart-x" viewBox="0 0 16 16">
        <path d="M7.354 5.646a.5.5 0 1 0-.708.708L7.793 7.5 6.646 8.646a.5.5 0 1 0 .708.708L8.5 8.207l1.146 1.147a.5.5 0 0 0 .708-.708L9.207 7.5l1.147-1.146a.5.5 0 0 0-.708-.708L8.5 6.793z"/>
        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zm3.915 10L3.102 4h10.796l-1.313 7zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
      </svg></h5>
      )}

      {/* Modale di conferma acquisto */}
      <Modal show={showPurchaseModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Acquisto Confermato</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Il tuo acquisto è stato completato con successo!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Cart;

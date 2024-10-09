import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { Container, Row, Col, Card, Button, Image, Modal, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './css/profile.css';

const UserProfile = () => {
  const { token, isAuthenticated } = useAuthContext();
  const [userData, setUserData] = useState(null);
  const [userProducts, setUserProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    profileImage: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      fetchUserData();
      fetchUserProducts();
    }
  }, [isAuthenticated, token]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching user data: ${errorData.message}`);
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorData.message}`);
      }

      const data = await response.json();
      setUserData(data);
      setUpdatedUser(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error.message);
    }
  };

  const fetchUserProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products/productsUser', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error fetching user products: ${errorData.message}`);
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorData.message}`);
      }

      const data = await response.json();
      setUserProducts(data);
    } catch (error) {
      console.error('Failed to fetch user products:', error.message);
    }
  };

  // Funzione per gestire l'aggiornamento del profilo
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', updatedUser.name);
    formData.append('surname', updatedUser.surname);
    formData.append('email', updatedUser.email);
    if (updatedUser.password) {
      formData.append('password', updatedUser.password);
    }
    if (updatedUser.profileImage) {
      formData.append('profileImage', updatedUser.profileImage);
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUserData(updatedData);
        setShowEditModal(false);
      } else {
        const errorData = await response.json();
        console.error(`Error updating profile: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Failed to update profile:', error.message);
    }
  };

  // Funzione per gestire l'eliminazione del prodotto
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Rimuovi il prodotto dal profilo
        setUserProducts(prevProducts => prevProducts.filter(product => product._id !== productId));
      } else {
        console.error('Failed to delete product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Funzione per gestire la navigazione alla pagina di modifica del prodotto
  const handleEditProduct = (productId) => {
    navigate(`/products/edit/${productId}`);
  };

  // Funzione per gestire la navigazione alla pagina di aggiunta di un nuovo prodotto
  const handleAddProduct = () => {
    navigate('/products/add'); 
  };

  return (
    <Container className="mt-5">
      {userData ? (
        <>
          {/* Sezione Immagine Profilo e Dati Utente */}
          <Row className='m-body'>
            <Col md={4} className="text-center">
              <Image
                src={userData.profileImage || 'https://via.placeholder.com/150'}
                roundedCircle
                style={{ width: '150px', height: '150px' }}
              />
            </Col>
            <Col md={8}>
              <h3 className='text-center-user'>{userData.name} {userData.surname}</h3>
              <p className='text-center-user'>Email: {userData.email}</p>
              <Button className='btn btn-outline-warning mb-3' variant="dark" onClick={() => setShowEditModal(true)}>
                Modifica Profilo
              </Button>
            </Col>
          </Row>
         

          {/* Bottone Aggiungi Prodotto */}
          <Row className="mt-4">
            <Col>
              <div className="d-flex justify-content-end">
                <Button className='btn btn-outline-success mt-5' variant="light" onClick={handleAddProduct}>
                  Aggiungi Prodotto
                </Button>
              </div>
            </Col>
          </Row>

          {/* Sezione Prodotti Utente */}
          <Row className="mt-4">
            <Col>
              <h2 className='text-center mb-5'>I Miei Prodotti</h2>
              <Row>
                {userProducts.length > 0 ? (
                  userProducts.map(product => (
                    <Col md={4} key={product._id} className="mb-4">
                        <Card className='border-3 rounded-0 '>
                          <Card.Img
                            variant="top"
                            src={product.image}
                            alt={product.name}
                          />
                          <Card.Body>
                            <Card.Title><u>Nome prodotto:</u> {product.name}</Card.Title>
                            <Card.Text><u>Categoria:</u> {product.category}</Card.Text>
                            <Card.Text><u>Descrizione:</u></Card.Text>
                            <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                            <Card.Text><u>Prezzo: €</u> {product.price}</Card.Text>

                            {/* Pulsanti Modifica ed Elimina */}
                            <div className='d-flex justify-content-between'>
                            <Button
                              variant="warning"
                              onClick={(e) => { e.stopPropagation(); handleEditProduct(product._id); }}
                              className="me-2">
                              Modifica
                            </Button>
                            <Button
                              variant="danger"
                              onClick={(e) => { e.stopPropagation(); handleDeleteProduct(product._id); }}>
                              Elimina
                            </Button>
                            </div>
                          </Card.Body>
                        </Card>
                    </Col>
                  ))
                ) : (
                  <p>Nessun ci sono Prodotti!</p>
                )}
              </Row>
            </Col>
          </Row>

          {/* Modale per modificare il profilo */}
          <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Modifica Profilo</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleUpdateProfile}>
                <Form.Group controlId="formName">
                  <Form.Label className='mx-2'><strong>Nome</strong></Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.name}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formSurname">
                  <Form.Label className='mt-3 mx-2'><strong>Cognome</strong></Form.Label>
                  <Form.Control
                    type="text"
                    value={updatedUser.surname}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, surname: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label className='mt-3 mx-2'><strong>Email</strong></Form.Label>
                  <Form.Control
                    type="email"
                    value={updatedUser.email}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label className='mt-3 mx-2'><strong>Password (lascia vuoto per non cambiare)</strong></Form.Label>
                  <Form.Control
                    type="password"
                    value={updatedUser.password}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, password: e.target.value })}
                  />
                </Form.Group>
                <Form.Group controlId="formProfileImage">
                  <Form.Label className='mt-3 mx-2'><strong>Immagine Profilo</strong></Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setUpdatedUser({ ...updatedUser, profileImage: e.target.files[0] })}
                  />
                </Form.Group>
                <Button className='btn btn-outline-warning mt-3' variant='dark' type="submit">
                  Salva Modifiche
                </Button>
              </Form>
            </Modal.Body>
          </Modal>
        </>
      ) : (
        <p>Loading profile...</p>
      )}
    </Container>
  );
};

export default UserProfile;

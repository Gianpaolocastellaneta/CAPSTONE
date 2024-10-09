import React, { useEffect, useState} from 'react';
import { useParams, useNavigate  } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Modal, Spinner } from 'react-bootstrap';
import { useAuthContext } from '../../context/AuthContext';
import './productdetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { token, user } = useAuthContext();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCartModal, setShowCartModal] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const productResponse = await fetch(`http://localhost:5000/api/products/${id}`);
        const productData = await productResponse.json();
        setProduct(productData);

        const commentsResponse = await fetch(`http://localhost:5000/api/comments/${id}`);
        const commentsData = await commentsResponse.json();
        setComments(commentsData.map(comment => ({ ...comment, userId: comment.user._id })));
      } catch (error) {
        console.error('Errore nel caricamento del prodotto o dei commenti:', error);
      }
    };

    fetchProductDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      setShowLoginModal(true); // Mostra il modale se non si è loggati
      return;
    }

    setIsAddingToCart(true);

    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiunta al carrello');
      }

      setShowCartModal(true); // Mostra il modale di conferma
    } catch (error) {
      alert('Errore durante l\'aggiunta al carrello: ' + error.message);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('Accedi per recensire un prodotto');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:5000/api/comments/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiunta del commento');
      }

      const newComment = await response.json();
      setComments([...comments, { ...newComment.comment, userId: user._id }]);
      setCommentContent('');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (commentId, content) => {
    setEditCommentId(commentId);
    setEditContent(content);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${editCommentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) {
        throw new Error('Errore nell\'aggiornamento del commento');
      }

      const updatedComment = await response.json();
      setComments(comments.map(c => c._id === editCommentId ? { ...c, content: updatedComment.content } : c));
      setShowEditModal(false);
      setEditCommentId(null);
      setEditContent('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteClick = (commentId) => {
    setCommentToDelete(commentId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/comments/${commentToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Errore nell\'eliminazione del commento');
      }

      setComments(comments.filter(comment => comment._id !== commentToDelete));
      setShowDeleteModal(false);
      setCommentToDelete(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCommentToDelete(null);
  };

  if (!product) {
    return <div>Caricamento...</div>;
  }

  return (
    <div className="m-body">
      <Container className="mt-4">
        {/* Dettagli del prodotto */}
        <Row>
          <Col md={6} className="mb-4">
            <img src={product.image} alt={product.name} className="img-detail" />
          </Col>
          <Col md={6} className="mb-4">
            <Card className="p-4">
              <Card.Body>
                <Card.Title className="text-center fw-bolder mb-5">{product.name}</Card.Title>
                <div dangerouslySetInnerHTML={{ __html: product.description }}></div>
                <Card.Text className="mt-5 text-center">
                  <strong>Prezzo: €{product.price}</strong>
                </Card.Text>
                <Button className="btn btn-light w-100 mt-1" variant="dark" onClick={handleAddToCart} disabled={isAddingToCart}>
                  {isAddingToCart ? <Spinner animation="border" size="sm" /> : 'Aggiungi al Carrello'}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sezione recensioni */}
        <h3 className="text-center my-5">Recensioni</h3>
        {comments.length > 0 ? (
          comments.map(comment => (
            <Card key={comment._id} className="mb-3">
              <Card.Body className="d-flex align-items-center">
                <img src={comment.user.profileImage} alt={`${comment.user.name}'s profile`} className="profile-image-detail" />
                <div className="ms-3">
                  <Card.Title>{comment.user ? comment.user.name : 'Utente sconosciuto'}</Card.Title>
                  <Card.Text>{comment.content}</Card.Text>
                </div>
                {user && comment.userId === user._id && (
                  <div className="ms-auto">
                    <Button className='btn btn-outline-warning' variant='light' onClick={() => handleEditClick(comment._id, comment.content)}>
                      Modifica
                    </Button>
                    <Button className='btn btn-outline-danger ml-2' variant="light" onClick={() => handleDeleteClick(comment._id)}>
                      Elimina
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>Nessuna recensione.</p>
        )}

        {/* Modale per modificare il commento */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Modifica Recensione</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="editComment">
                <Form.Control as="textarea" rows={3} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
              </Form.Group>
              {error && <p className="text-danger">{error}</p>}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Chiudi</Button>
            <Button variant="warning" onClick={handleEditSubmit}>Salva modifiche</Button>
          </Modal.Footer>
        </Modal>

        {/* Modale per confermare eliminazione */}
        <Modal show={showDeleteModal} onHide={cancelDelete}>
          <Modal.Header closeButton>
            <Modal.Title>Conferma Eliminazione</Modal.Title>
          </Modal.Header>
          <Modal.Body>Sei sicuro di voler eliminare questa recensione?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={cancelDelete}>Chiudi</Button>
            <Button variant="danger" onClick={confirmDelete}>Elimina</Button>
          </Modal.Footer>
        </Modal>

        {/* Modale per confermare aggiunta al carrello */}
        <Modal show={showCartModal} onHide={() => setShowCartModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Prodotto Aggiunto al Carrello!</Modal.Title>
          </Modal.Header>
          <Modal.Footer>
            <Button className='btn btn-outline-dark' variant="light" onClick={() => setShowCartModal(false)}>Chiudi</Button>
          </Modal.Footer>
        </Modal>

        {/* Modale per avvisare l'utente di effettuare il login */}
        <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Devi essere loggato</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Per aggiungere prodotti al carrello, devi prima effettuare l'accesso.
          </Modal.Body>
          <Modal.Footer>
            {/* Pulsante Accedi che reindirizza alla pagina di login */}
            <Button className='btn btn-outline-success' variant="light" onClick={() => navigate('/login')}>
              Accedi
            </Button>
           
            <Button variant="secondary" onClick={() => setShowLoginModal(false)}>
              Chiudi
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Form per aggiungere recensioni */}
        <Form className='mt-4' onSubmit={handleCommentSubmit}>
          <Form.Group controlId="commentContent">
            <Form.Control placeholder='Scrivi una recensione sul prodotto...' as="textarea" rows={3} value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
          </Form.Group>
          {error && <p className="text-danger">{error}</p>}
          <Button className='btn btn-outline-dark mt-2' variant="light" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Invia Recensione'}
          </Button>
        </Form>
      </Container>
    </div>
  );
};

export default ProductDetail;

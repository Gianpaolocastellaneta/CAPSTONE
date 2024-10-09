import React, { useState, useEffect } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Container, Modal, Spinner } from 'react-bootstrap';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/editproduct.css';

const EditProduct = () => {
  const { token } = useAuthContext();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
  });
  const [editorState, setEditorState] = useState(EditorState.createEmpty()); // Stato dell'editor
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Stato per il modale
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const fetchProductData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.message}`);
      }

      const data = await response.json();
      
      // Converte la descrizione HTML esistente in contenuto Draft.js
      const contentBlock = htmlToDraft(data.description);
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorContent = EditorState.createWithContent(contentState);

      setProductData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        image: data.image,
      });

      setEditorState(editorContent);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleEditorChange = (state) => {
    setEditorState(state);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Avvia lo spinner

    // Converti il contenuto Draft.js in HTML
    const descriptionHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', descriptionHtml);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error: ${response.status} - ${errorData.message}`);
      }

      setIsSubmitting(false); // Ferma lo spinner
      setShowModal(true); // Mostra il modale di conferma
    } catch (error) {
      setIsSubmitting(false); // Ferma lo spinner in caso di errore
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    setProductData({
      ...productData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCloseModal = () => {
    setShowModal(false); // Chiudi il modale
    navigate('/profile'); // Reindirizza alla pagina profilo
  };

  if (loading) {
    return <p>Caricamento prodotto...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Container className="mt-5">
      <h2 className='m-body text-center mb-5'>Modifica Prodotto</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Nome</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="description" className="mb-3">
          <Form.Label>Descrizione</Form.Label>
          {/* Editor Draft.js */}
          <Editor
            editorState={editorState}
            wrapperClassName="demo-wrapper"
            editorClassName="demo-editor"
            onEditorStateChange={handleEditorChange}
          />
        </Form.Group>

        <Form.Group controlId="price" className="mb-3">
          <Form.Label>Prezzo</Form.Label>
          <Form.Control
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="category" className="mb-3">
          <Form.Label>Categoria</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={productData.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group controlId="image" className="mb-3">
          <Form.Label>Immagine</Form.Label>
          <Form.Control
            type="file"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Button variant="warning" type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner animation="border" size="sm" /> Aggiornamento...
            </>
          ) : (
            'Aggiorna Prodotto'
          )}
        </Button>
      </Form>

      {/* Modale di conferma */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Prodotto aggiornato con successo!</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button variant="warning" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default EditProduct;

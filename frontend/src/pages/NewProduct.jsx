import React, { useState } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import { Modal, Button, Spinner } from 'react-bootstrap';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './css/newproduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState(EditorState.createEmpty()); 
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [showModal, setShowModal] = useState(false); 

  const { token } = useAuthContext();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);  // Mostra lo spinner

    const formData = new FormData();
    formData.append('name', name);

    const descriptionHtml = draftToHtml(convertToRaw(description.getCurrentContent()));
    formData.append('description', descriptionHtml);

    formData.append('category', category);
    formData.append('price', price);
    if (image) {
      formData.append('image', image);
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'aggiunta del prodotto.');
      }

      const data = await response.json();
      setLoading(false);  // Nascondi lo spinner
      setShowModal(true);  // Mostra il modale alla fine
    } catch (err) {
      setLoading(false);  // Nascondi lo spinner in caso di errore
      setError(err.message);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/profile');
  };

  return (
    <div className="container mt-5">
      <h2 className='m-body text-center mb-5'>Aggiungi Prodotto</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label className='mb-2 mx-2'><strong>Nome Prodotto</strong></label>
          <input
            type="text"
            placeholder='Inserisci il nome del prodotto'
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className='mx-2'><strong>Descrizione Prodotto</strong></label>
          <Editor
            editorState={description}
            wrapperClassName="demo-wrapper"
            placeholder='Inserisci la descrizione del prodotto'
            editorClassName="demo-editor"
            onEditorStateChange={(editorState) => setDescription(editorState)}
          />
          <hr></hr>
        </div>
        
        <div className="form-group">
          <label className='mx-2'><strong>Categoria</strong></label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Seleziona una categoria</option>
            <option value="Box">Box</option>
            <option value="Drogheria">Drogheria</option>
            <option value="Frantoio">Frantoio</option>
            <option value="Panificio">Panificio</option>
            <option value="Pastificio">Pastificio</option>
            <option value="Cantina">Cantina</option>
          </select>
        </div>

        <div className="form-group">
          <label className='mx-2'><strong>Prezzo</strong></label>
          <input
            type="number"
            className="form-control"
            placeholder='Inserisci il prezzo del prodotto'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label className='mx-2'><strong>Immagine del Prodotto</strong></label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        
        {/* Bottone con spinner */}
        <button type="submit" className="btn btn-success" disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" /> Caricamento...
            </>
          ) : (
            'Aggiungi Prodotto'
          )}
        </button>
      </form>

      {/* Modale di conferma */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Prodotto aggiunto con successo!</Modal.Title>
        </Modal.Header>
        
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddProduct;

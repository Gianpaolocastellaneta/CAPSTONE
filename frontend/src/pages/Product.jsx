import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './css/product.css';
import hero from '../assets/hero.png';
import box from '../assets/category/box.jpg';
import drogheria from '../assets/category/drogheria.png';
import frantoio from '../assets/category/frantoio.png';
import panificio from '../assets/category/panificio.png';
import cantina from '../assets/category/cantina.jpg';
import pastificio from '../assets/category/pastificio.png';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null); // Stato per la categoria selezionata

  // Categorie e immagini
  const categories = [
    { name: 'Box', image: box },
    { name: 'Frantoio', image: frantoio },
    { name: 'Panificio', image: panificio },
    { name: 'Pastificio', image: pastificio },
    { name: 'Drogheria', image: drogheria },
    { name: 'Cantina', image: cantina },
  ];

  const handleNavClick = () => {
    window.scrollTo(0,0); // Scorre in cima alla pagina
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (!response.ok) {
          throw new Error('Errore nel recupero dei prodotti');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Errore durante il recupero dei prodotti:', error);
      }
    };

    fetchProducts();
  }, []);

  // Funzione per gestire il clic su una categoria
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  // Filtra i prodotti in base alla categoria selezionata
  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category.toLowerCase() === selectedCategory.toLowerCase())
    : products;

  // Funzione per raggruppare i prodotti per categoria, mostrando solo i primi 4
  const groupProductsByCategory = () => {
    return categories.map((category) => ({
      category: category.name,
      products: products
        .filter((product) => product.category.toLowerCase() === category.name.toLowerCase())
        .slice(0, 4)
    }));
  };

  const groupedProducts = groupProductsByCategory();

  return (
    <>
      {/* Hero section */}
      <div className="hero-section">
        <img src={hero} alt="Hero" className="hero-image img-fluid" />
        <div className="hero-content">
          <h1 className="animate__animated animate__fadeInUpBig">Tutti i Prodotti</h1>
          <p className="animate__animated animate__fadeInUpBig animate__delay-1s">
            Esplora i nostri prodotti unici!
          </p>
        </div>
      </div>

      <Container className="mt-5">
        {/* Sezione delle categorie */}
        {!selectedCategory && (
          <>
            <Row className='mb-5'>
              <h3 className='text-center mb-5'><strong>Espolora le Categorie</strong></h3>
              {categories.map((category) => (
                <Col xs={6} md={4} lg={4} key={category.name} className="d-flex justify-content-center">
                  <Card
                    className="category-card border-0 rounded-0"
                    onClick={() => {handleCategoryClick(category.name); handleNavClick();}}
                  >
                    <Card.Img variant="top" className="rounded-0" src={category.image} alt={category.name} />
                    <Card.Body className="rounded-0">
                      <Card.Title>{category.name}</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
              <hr className='hr-product mb-5'></hr>
            {/* Tutti i prodotti suddivisi per categoria */}
            {groupedProducts.map((group) => (
              <div key={group.category} className="mb-5">
                <h2 className=" text-center mb-0"><strong>{group.category}</strong></h2>
                 <div className="d-flex justify-content-end align-items-center">
                
                <h5 className=" btn btn-outline-dark rounded-0 mb-0" onClick={() => {handleCategoryClick(group.category);handleNavClick();} } style={{ cursor: 'pointer' }}>
                  vedi tutti
                </h5>
                </div>
                <Row>
                  {group.products.length > 0 ? (
                    group.products.map((product) => (
                      <Col xs={6} md={4} lg={3} key={product._id} className="mb-4 d-flex justify-content-center">
                        <Card className="product-card card-product border-0">
                          <Card.Img variant="top" src={product.image} alt={product.name} className="card-img-top" />
                          <Card.Body>
                            <Card.Title className="text-center mb-2">{product.name}</Card.Title>
                            <Card.Text className="text-center">€ {product.price}</Card.Text>
                            <Link to={`/product/${product._id}`} className="btn-cart btn btn-outline-dark w-100" onClick={() => {handleNavClick();} }>
                              VISUALIZZA PRODOTTO
                            </Link>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))
                  ) : (
                    <p className="text-center">Nessun prodotto disponibile per questa categoria.</p>
                  )}
                </Row>
              </div>
            ))}
          </>
        )}

        {/* Visualizzazione prodotti filtrati per categoria */}
        {selectedCategory && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <h2><strong>Prodotti : {selectedCategory}</strong></h2>
              <Button className="btn-dark" onClick={() => setSelectedCategory(null)}>
                Torna alle categorie
              </Button>
            </div>
            <Row>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Col xs={6} md={4} lg={3} key={product._id} className="mb-4 d-flex justify-content-center">
                    <Card className="product-card card-product border-0">
                      <Card.Img variant="top" src={product.image} alt={product.name} className="card-img-top" />
                      <Card.Body>
                        <Card.Title className="text-center mb-2">{product.name}</Card.Title>
                        <Card.Text className="text-center">€ {product.price}</Card.Text>
                        <Link to={`/product/${product._id}`} className="btn-cart btn btn-outline-dark w-100">
                          VISUALIZZA PRODOTTO
                        </Link>
                      </Card.Body>
                    </Card>
                  </Col>
                ))
              ) : (
                <p className="text-center">Nessun prodotto trovato per questa categoria.</p>
              )}
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Products;

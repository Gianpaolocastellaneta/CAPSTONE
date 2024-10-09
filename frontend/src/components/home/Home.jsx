import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Carousel } from 'react-bootstrap';
import 'animate.css';
import ImageDescription from './home.jpg';
import './home.css';
import './home.mp4';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const location = useLocation();

  const handleNavClick = () => {
    window.scrollTo(0, 0); // Scorre in cima alla pagina
  };

  // Funzione per mescolare un array e selezionare i primi 'n' elementi
  const getRandomProducts = (productsArray, count) => {
    const shuffled = [...productsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  // Funzione per ottenere il termine di ricerca dall'URL
  const getSearchTerm = () => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  };

  // Chiamata API per ottenere i prodotti
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        const data = await response.json();
        
        // Mantieni tutti i prodotti nel state
        setProducts(data);
        
        // Se non c'è un termine di ricerca, mostra 8 prodotti random
        const randomProducts = getRandomProducts(data, 8);
        setFilteredProducts(randomProducts);
      } catch (error) {
        console.error('Errore nel caricamento dei prodotti:', error);
      }
    };
  
    fetchProducts();
  }, []);
  
// Filtrare i prodotti in base al termine di ricerca
useEffect(() => {
  const searchTerm = getSearchTerm().toLowerCase();
  
  if (searchTerm) {
    // Filtra i prodotti sulla base del termine di ricerca
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredProducts(filtered);
  } else {
    // Se non c'è termine di ricerca, mostra 8 prodotti random
    const randomProducts = getRandomProducts(products, 8);
    setFilteredProducts(randomProducts);
  }
}, [location.search, products]);


  const searchTerm = getSearchTerm();

  const imageRef = useRef(null);
  const textRef = useRef(null);
  const aboutImageRef = useRef(null);
  const aboutTextRef = useRef(null); 

  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === imageRef.current) {
              imageRef.current.classList.add('animate__slideInLeft');
            }
            if (entry.target === textRef.current) {
              textRef.current.classList.add('animate__slideInRight');
            }
            if (entry.target === aboutImageRef.current) {
              aboutImageRef.current.classList.add('animate__fadeInRight');
            }
            if (entry.target === aboutTextRef.current) {
              aboutTextRef.current.classList.add('animate__fadeInLeft');
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imageRef.current) observer.observe(imageRef.current);
    if (textRef.current) observer.observe(textRef.current);
    if (aboutImageRef.current) observer.observe(aboutImageRef.current);
    if (aboutTextRef.current) observer.observe(aboutTextRef.current);

    return () => {
      if (imageRef.current) observer.unobserve(imageRef.current);
      if (textRef.current) observer.unobserve(textRef.current);
      if (aboutImageRef.current) observer.unobserve(aboutImageRef.current);
      if (aboutTextRef.current) observer.unobserve(aboutTextRef.current);
    };
  }, []);

  // Funzione per le 5 stelle gialle
  const FiveStars = () => (
    <div className="stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="star">&#9733;</span>
      ))}
    </div>
  );

  return (
    <div>
      {!searchTerm && (
         <div className="hero-section">
         {/* Video di sfondo */}
         <video
           src={require('./home.mp4')}
           alt="Hero"
           autoPlay
           loop
           muted
           playsInline
           className="hero-video"
         />
   
         {/* Frase animata sopra il video */}
         <div className="hero-content">
           <h1 className="animate__animated animate__fadeInUpBig">Prodotti tradizionali Pugliesi</h1>
           <p className="animate__animated animate__fadeInUpBig animate__delay-1s">
           Qualità, genuinità e artigianalità locale
           </p>
         </div>
       </div>
      )}

      {/* Prodotti */}
      <Container className="mt-product">
        <Row>
          {filteredProducts.map((product) => (
            <Col xs={6} md={6} lg={3} key={product._id} className="mb-4 d-flex justify-content-center">
              <Card className="product-card card-home">
                <Card.Img
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                />
                <Card.Body>
                  <Card.Title className="text-center mb-2">{product.name}</Card.Title>
                  <Card.Text className="text-center">€ {product.price}</Card.Text>
                  <Link to={`/product/${product._id}`} className="btn-cart btn btn-outline-dark w-100">
                    VISUALIZZA PRODOTTO
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="d-flex justify-content-center mb-3">
    <Link to={`/products`} onClick={() => handleNavClick() } className="btn-cart btn btn-dark w-lg-25 px-5">
      VEDI TUTTI I PRODOTTI
    </Link>
  </div>
      </Container>

          
       {/* Sezione con immagine e testo animati */}
  {!searchTerm && (
    <Container fluid className="mt-5 py-5 section-image-text">
      <Row className="align-items-center">
        <Col xs={12} md={6}>
          {/* Immagine che scorre da sinistra */}
          <img
            ref={imageRef}
            src={ImageDescription}
            alt="Image Description"
            className="img-fluid animate__animated"
          />
        </Col>
        <Col xs={12} md={6}>
          {/* Testo che scorre da destra */}
          <div ref={textRef} className="animate__animated">
            <h2 className="text-center">Scopri la Tradizione</h2>
            <p className="text-center">
              I prodotti Pugliesi offrono il meglio della tradizione culinaria locale,
              garantendo qualità, genuinità e sapori autentici. Scopri la nostra selezione
              e porta la Puglia sulla tua tavola.
            </p>
          </div>
        </Col>
      </Row>
    </Container>

    

    
  )}
  {/* Sezione Recensioni */}
  {!searchTerm && (
  <Container fluid className="mt-5 py-5 reviews-section">
            <Row className="justify-content-center mb-4">
              <Col xs={12} className="text-center">
                <h2>Recensioni</h2>
              </Col>
            </Row>

            <Row className="justify-content-center">
              <Col xs={12} md={8}>
                <Carousel interval={5000} controls={false} indicators={false} pause={false}>
                  {/* Prima recensione */}
                  <Carousel.Item>
                    <div className="text-center">
                      <FiveStars />
                      <p className="review-text mt-3">
                        Prodotti eccellenti! Il sapore autentico della Puglia sulla mia tavola.
                      </p>
                      <div className="reviewer-info mt-3">
                        <img
                          src={require('./user1.jpg')}
                          alt="Francesco Cirillo"
                          className="reviewer-img rounded-circle"
                        />
                        <h5 className="mt-3 reviewer-name">Francesco Cirillo</h5>
                      </div>
                    </div>
                  </Carousel.Item>

                  {/* Seconda recensione */}
                  <Carousel.Item>
                    <div className="text-center">
                      <FiveStars />
                      <p className="review-text mt-3">
                        Servizio impeccabile e prodotti di altissima qualità. Consigliatissimi!
                      </p>
                      <div className="reviewer-info mt-3">
                        <img
                          src={require('./user2.jpg')}
                          alt="Maria Chiello"
                          className="reviewer-img rounded-circle"
                        />
                        <h5 className="mt-3 reviewer-name">Maria Chiello</h5>
                      </div>
                    </div>
                  </Carousel.Item>

                  {/* Terza recensione */}
                  <Carousel.Item>
                    <div className="text-center">
                      <FiveStars />
                      <p className="review-text mt-3">
                        Sono davvero soddisfatto della qualità e dell'artigianalità di questi prodotti.
                      </p>
                      <div className="reviewer-info mt-3">
                        <img
                          src={require('./user3.jpg')}
                          alt="Alessandro Ragusa"
                          className="reviewer-img rounded-circle"
                        />
                        <h5 className="mt-3 reviewer-name">Alessandro Ragusa</h5>
                      </div>
                    </div>
                  </Carousel.Item>
                </Carousel>
              </Col>
            </Row>
          </Container>
          )}

          {/* Sezione Chi Siamo */}
      <Container fluid className="mt-5 py-5 about-section">
        <Row className="align-items-center">
          <Col xs={12} md={6} className="bio animate__animated" ref={aboutTextRef}>
            <h3 className="text-center">Chi Siamo</h3>
            <p className="text-center">
            Il nostro marketplace è nato con l'obiettivo di portare i sapori autentici della Puglia direttamente 
            nelle case di tutti, offrendo una piattaforma che permette ai piccoli produttori locali di vendere 
            le loro specialità fatte in casa. 
            </p>
            <p className="text-center">
            Attraverso il nostro sito, mettiamo in contatto produttori artigianali pugliesi e amanti del buon cibo, offrendo
            non solo una selezione curata di prodotti genuini, come pane, taralli, olio e altre specialità, ma anche
            un'esperienza che valorizza le storie, la cultura e l'autenticità di ogni singolo articolo.
            </p>
          </Col>
          <Col xs={12} md={6} className="video-container animate__animated" ref={aboutImageRef}>
            <video
              src={require('./about.mp4')}
              alt="about"
              autoPlay
              loop
              muted
              playsInline
              className="company-video"
            />
          </Col>
        </Row>
      </Container>
        
  
    </div>
  );
};

export default Home;


import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      
      <div className="footer">
        <Container>
          <Row>
            {/* Colonna Azienda */}
            <Col xs={12} md={4} className="footer-column">
              <h5>Azienda</h5>
              <ul>
                <li>Chi Siamo</li>
                <li>Lavora con Noi</li>
              </ul>
            </Col>

            {/* Colonna Politiche */}
            <Col xs={12} md={4} className="footer-column">
              <h5>Politiche</h5>
              <ul>
                <li>Termini e Condizioni</li>
                <li>Informativa Spedizioni</li>
                <li>Politica di Rimborso</li>
                <li>Politica sulla Privacy e Cookie</li>
              </ul>
            </Col>

            {/* Colonna social */}
            <Col xs={12} md={4} className="footer-column">
              <h5>Seguici</h5>
              <div className="social-icons">
                <i className="fab fa-facebook"></i>
                <i className="fab fa-instagram"></i>
                <i className="fab fa-twitter"></i>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Seconda parte del footer con sfondo nero */}
      <div className="footer-bottom">
        <Container>
          <Row>
            <Col>
              <p>&copy; 2024 Puglia Mia Srl. Tutti i diritti riservati.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;

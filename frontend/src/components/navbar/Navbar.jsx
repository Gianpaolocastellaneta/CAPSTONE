import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Navbar, Nav, Button, Form, FormControl } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import './navbar.css';

const NavigationBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expanded, setExpanded] = useState(false); // Stato per gestire il toggle
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthContext();

  const handleNavClick = () => {
    window.scrollTo(0, 0); // Scorre in cima alla pagina
    setExpanded(false); // Chiude il menu su dispositivi mobili
  };
  

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?search=${searchTerm}`);
    setExpanded(false);
    setSearchTerm(''); 
     // Chiude il toggle dopo la ricerca
  };

  const handleLogout = () => {
    logout();
    setExpanded(false); // Chiude il toggle dopo il logout
    navigate('/'); // Reindirizza l'utente alla home page
  };

  // Funzione per gestire l'espansione/chiusura del menu di navigazione
  const handleToggle = () => {
    setExpanded(!expanded); // Inverte lo stato del toggle
  };

  // Funzione per chiudere il menu dopo un click su un link
  const handleLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar expand="lg" expanded={expanded} className="bg-navbar shadow-sm flex-column pt-0 fixed-top">
      <div className="container d-flex flex-column align-items-center">
       
        <div className="navbar-logo-toggle-container d-flex justify-content-between align-items-center ">
          {/* Logo a sinistra su schermi piccoli */}
          <Navbar.Brand as={Link} to="/" onClick={() => { handleNavClick(); handleLinkClick(); }} className="d-lg-none py-0">
            <img src={logo} alt="Logo" className="logo" />
          </Navbar.Brand>

          {/* Logo centrato su schermi grandi */}
          <Navbar.Brand as={Link} to="/" onClick={() => { handleNavClick(); handleLinkClick(); }} className="d-none d-lg-flex justify-content-center pt-0">
            <img src={logo} alt="Logo" className="logo" />
          </Navbar.Brand>

          {/* Toggle a destra per mobile */}
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="order-2" onClick={handleToggle} />
        </div>

        {/* Parte Inferiore: NavBar con link */}
        <Navbar.Collapse id="basic-navbar-nav" className="w-100">
          <div className="navbar-lower d-flex justify-content-between align-items-center w-100">
            {/* Link a sinistra */}
            <div className="d-flex">
              <Nav className="mr-lg-auto">
              <Nav.Link as={Link} to="/" onClick={() => { handleNavClick(); handleLinkClick(); }}>Home</Nav.Link>
              <Nav.Link as={Link} to="/products" onClick={() => { handleNavClick(); handleLinkClick(); }}>Prodotti</Nav.Link>
              </Nav>
            </div>

            {/* Form di ricerca dentro il toggle su mobile */}
            <div className="navbar-center mx-auto d-lg-flex d-none"> {/* Mostrato solo su schermi grandi */}
              <Form inline={true} className="d-flex mx-auto" onSubmit={handleSearch}>
                <FormControl
                  type="text"
                  placeholder="Cerca prodotto..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" variant='light' className="btn btn-outline-dark rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
                </Button>
              </Form>
            </div>

            {/* Link a destra */}
            <div className="d-flex">
              <Nav className="ml-lg-auto">
                {!isAuthenticated ? (
                  <>
                    <Nav.Link as={Link} to="/login" onClick={() => { handleNavClick(); handleLinkClick(); }}>Accedi</Nav.Link>
                    <Nav.Link as={Link} to="/register" onClick={() => { handleNavClick(); handleLinkClick(); }}>Registrati</Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/profile" onClick={() => { handleNavClick(); handleLinkClick(); }}>Profilo</Nav.Link>
                    <Nav.Link variant="light" onClick={handleLogout}>Logout</Nav.Link>
                    <Nav.Link as={Link} to="/cart" onClick={() => { handleNavClick(); handleLinkClick(); }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cart4" viewBox="0 0 16 16">
  <path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5M3.14 5l.5 2H5V5zM6 5v2h2V5zm3 0v2h2V5zm3 0v2h1.36l.5-2zm1.11 3H12v2h.61zM11 8H9v2h2zM8 8H6v2h2zM5 8H3.89l.5 2H5zm0 5a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0m9-1a1 1 0 1 0 0 2 1 1 0 0 0 0-2m-2 1a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
</svg>
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </div>
          </div>

          {/* Form di ricerca dentro il toggle su schermi piccoli */}
          <div className="d-lg-none mt-3"> {/* Mostrato solo su schermi piccoli */}
            <Form inline={true} className="d-flex mx-auto" onSubmit={handleSearch}>
              <FormControl
                type="text"
                placeholder="Cerca prodotto..."
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button type="submit" variant='light' className="btn btn-outline-dark rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
                </Button>
            </Form>
          </div>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavigationBar;

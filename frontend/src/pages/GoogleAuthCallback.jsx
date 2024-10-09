import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prende il token dalla query string
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      // Salva il token nel localStorage
      localStorage.setItem('token', token);

      navigate('/login');
    } else {
    
      navigate('/');
    }
  }, [navigate]);

  return (
    <div>
      <h2>Accesso in corso...</h2>
    </div>
  );
};

export default GoogleAuthCallback;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para lobby na página inicial
    navigate('/lobby');
  }, [navigate]);

  return null;
};

export default Index;

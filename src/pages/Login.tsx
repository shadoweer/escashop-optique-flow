
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  }, [user, navigate]);

  return null;
};

export default Login;

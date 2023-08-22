import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();
  const deleteCookie = (name) => {
    document.cookie = name + '=; Max-Age=-99999999;';
  };

  useEffect(() => {
    deleteCookie('accessToken');
    deleteCookie('refreshToken');

    navigate('/login', { replace: true });
  }, [navigate]);

  return <div>Logging out...</div>;
}

export default Logout;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';




export default function ProtectedRoute({ children }) {

  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const userEmail = cookies.userEmail;
  const authToken = cookies.authToken;

  useEffect(() => {
    if (!authToken) {
      navigate('/login', { replace: true });
    }
  }, [navigate, authToken]);

  return children;
}
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginContext } from '../../context/LoginContext';
import { ACCESS_TOKEN } from '../../constants';

function Logout() {
  const navigate = useNavigate();
  const {token, setToken, user} = useContext(LoginContext);

  useEffect(() => {

    setTimeout(() => {
      console.log("Redirecting to login...");

      // Usuwanie tokenu z localStorage
      localStorage.removeItem(ACCESS_TOKEN);
      console.log("Token removed from localStorage.");

      setToken(null);
      console.log("Token set to null in context.");

      navigate("/login");
    }, 3500);

  }, [setToken, navigate]);

  return (
    <div>
      <h1>You are now logged out!</h1>
      <p>Redirecting to the login page...</p>
    </div>
  );
}

export default Logout;

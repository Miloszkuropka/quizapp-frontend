import { useContext, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../api/requests.component';
import { ENDPOINTS } from '../../api/urls.component';
import { ACCESS_TOKEN, REFRESH_TOKEN,IS_SUPERUSER  } from "../../constants";
import { LoginContext } from '../../context/LoginContext';
import "./Login.component.css"

function Login() {
    const navigate = useNavigate()
    const [komunikat, setKomunikat] = useState("<pusty>")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const {setToken, setUser, setSupervisor} = useContext(LoginContext);

    const ustawKomunikat = (nowy) => {
      setKomunikat(nowy)
      console.log(nowy)
    }

    const onSubmit = async (e) => {
      e.preventDefault(); //dezaktywuje odswiezanie formularza po kliknieciu w submit
        console.log("Username " + username + " password " + password)
  
        const body = {
          username: username,
          password: password
        }
        
        const onSuccess = (response, data) => {
          console.log("Response data:", data); 
          if (data.access) {
              localStorage.setItem(ACCESS_TOKEN, data.access); 
              localStorage.setItem(REFRESH_TOKEN, data.refresh); 
              localStorage.setItem(IS_SUPERUSER, data.is_superuser)
              setToken(data.access); // Ustaw token w stanie
              setSupervisor({
                is_superuser: data.is_superuser
              });
              console.log("czy tu jest dobry supervisor? " + data.is_superuser) ///działa
              toast.success('Successfully logged in!');
              navigate("/");
          } else {
              toast.error("No access token found in the response.");
          }
      };

        const onFail = (response) => {
          toast.error("Login failed!")
          toast.error("Error code: " + response.status)
          console.log("Login failed. Status:", response.status)
          console.log("Username:", username)
          console.log("Password:", password)

        }

        await post(ENDPOINTS.Login, body, onSuccess, onFail, null)
    }

    const handleForgotPassword = () => {
      navigate("/forgot");
    };

    return (
      <div className="center-container">
        <form className="user-form" onSubmit={onSubmit}>
          <h1>Hello again!</h1>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              onInput={e => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              onInput={e => setPassword(e.target.value)}
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn-primary login-btn">Log in</button>
            <button 
              type="button" 
              className="btn-primary forgot-password-btn" 
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
        </div>
        </form>
      </div>
    );
  }

export default Login;
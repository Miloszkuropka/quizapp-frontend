import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { post1 } from "../../api/requests.component";
import {ENDPOINTS} from "../../api/urls.component"
import "./Register.component.css"
import toast, { ReactHotToast } from 'react-hot-toast';



function Register() {
    const navigate = useNavigate()
    const [first_name, setFirstname] = useState("")
    const [last_name, setLastname] = useState("")
    const [username, setUsername] = useState("")
    const [password1, setPassword1] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")

    const validateForm = () => {
      if (!first_name.trim()) {
        toast.error("First name is required!");
        return false;
      }
      if (!last_name.trim()) {
        toast.error("Last name is required!");
        return false;
      }
      if (!username.trim()) {
        toast.error("Username is required!");
        return false;
      }
      if (password1.length < 8) {
        toast.error("Password must be at least 8 characters!");
        return false;
      }
      if (password1 !== password2) {
        toast.error("Passwords do not match!");
        return false;
      }
      if (!/^\S+@\S+\.\S+$/.test(email)) {
        toast.error("Invalid email format!");
        return false;
      }
      return true;
    };
  
    const onSubmit = async (e) => {
      e.preventDefault(); //dezaktywuje odswiezanie formularza po kliknieciu w submit
  
        if (!validateForm()) {
          return; 
        }
        
        const onSuccess = (response, data) => {
          toast("Please check your email for the verification link.");
          navigate("/login")
        }

        const onFail = (response) => {
          toast.error("Register failed!")
        }

        const body = {
          first_name : first_name,
          last_name : last_name,
          username: username,
          password: password1,
          email: email
        }
       await post1(ENDPOINTS.Register, body, onSuccess, onFail)
    }

    return (
      <div class="center-container">
        <form class="register-form" onSubmit={onSubmit} >
          <h1>Register</h1>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">First name</label>
                <input type="text" className="form-control" id="username" onInput={e => setFirstname(e.target.value)}></input>
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Last name</label>
                <input type="text" className="form-control" id="username" onInput={e => setLastname(e.target.value)}></input>
              </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">User name</label>
                <input type="text" className="form-control" id="username" onInput={e => setUsername(e.target.value)}></input>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" onInput={e => setPassword1(e.target.value)}></input>
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password confirmation</label>
                <input type="password" className="form-control" id="password" onInput={e => setPassword2(e.target.value)}></input>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Gmail</label>
                <input type="email" className="form-control" id="email" onInput={e => setEmail(e.target.value)}></input>
              </div>
            <button className="btn btn-success" type="submit">Register</button>
        </form>
      </div>
    );
}

export default Register;
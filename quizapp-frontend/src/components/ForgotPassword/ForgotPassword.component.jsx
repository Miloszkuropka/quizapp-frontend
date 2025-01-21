import React, { useState } from 'react';
import './ForgotPassword.component.css';
import { post1 } from '../../api/requests.component';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { ENDPOINTS } from '../../api/urls.component';


function ForgotPassword() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")

    const handleEmail = async (e) => {
        e.preventDefault();

        const emaildetail = { email };

        const onSuccess = (response, data) => {
            toast.success('Please, check your email to change password');
            navigate('/login')
        };

        const onFail = (response) => {
            toast.error('There is no such user with this email address');
        };

        await post1(ENDPOINTS.ForgotPassword, emaildetail, onSuccess, onFail);
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h1>Reset Password</h1>
                <p>Enter your email address, and we'll send you a link to reset your password.</p>
                <form onSubmit={handleEmail}>
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control" 
                            id="email" 
                            placeholder="Enter your email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn btn-primary submit-btn">
                        Send Reset Link
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword
import React, { useState } from 'react';
import './ResetPassword.component.css';
import { post1 } from '../../api/requests.component';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ENDPOINTS } from '../../api/urls.component';

function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const queryParams = new URLSearchParams(location.search);
    const uid = queryParams.get('uid');
    const token = queryParams.get('token');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (!uid || !token) {
            toast.error('Invalid reset link. Please try again.');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }

        const payload = {
            uid,
            token,
            new_password: newPassword,
        };

        const onSuccess = (response, data) => {
            toast.success('Password reset successful! You can now log in.');
            navigate('/login');
        };

        const onFail = (response) => {
            if (response.error) {
                toast.error(response.error);
            } else {
                toast.error('Failed to reset password. Please try again.');
            }
        };

        await post1(ENDPOINTS.ResetPassword, payload, onSuccess, onFail);
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h1>Reset Your Password</h1>
                <p>Enter your new password below.</p>
                <form onSubmit={handlePasswordReset}>
                    <div className="form-group">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="newPassword"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary submit-btn">
                        Reset Password
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
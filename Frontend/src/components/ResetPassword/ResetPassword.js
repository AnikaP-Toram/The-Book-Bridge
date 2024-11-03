import React, { useState } from 'react';
import axios from 'axios';
import './ResetPassword.css';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false); // Track token validation

  const history = useNavigate();

  const handleResetRequest = async (e) => {
    e.preventDefault();
    try 
    {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/request-reset`, { email });
      if (response.status === 200) 
      {
        setSuccess(response.data.message);
        setError('');
        setIsEmailValid(true);
      }
    } 
    catch (err) 
    {
      if (err.response && err.response.status === 404) 
      {
        setError(err.response.data.message);
        setSuccess(''); // Clear any existing success
      }
    }
  }

  const handleTokenValidation = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/reset-password/${token}`, {password});
      
      if (response.status === 200) {
        
      }
    } catch (err) {
      if (err.response.status === 400) {
        setIsEmailValid(false);
        setIsTokenValid(true);
        setSuccess('Token validated. Please enter your new password.');
        setError('');
      }
      else {
        setError(err.response?.data?.message || 'An error occurred.');
        setSuccess('');
        setIsTokenValid(false); 
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/reset-password/${token}`, { password });
      if (response.status === 200) {
        setSuccess('Password reset successful! Redirecting to log in...');
        setError('');
        setTimeout(() => {
          history('/login'); // Redirect to dashboard after signup
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      setSuccess('');
    }
  };

  const closePopup = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className='reset-password-main-container'>
      <h2 className='main-heading'>Reset Password</h2>
      <div className='signup-form'>
        {!isEmailValid && (
          <form onSubmit={handleResetRequest}>
            <input
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}

        {isEmailValid &&(
          <form onSubmit={handleTokenValidation}>
            <input
              type='text'
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter Token"
              required
            />
            <button type="submit">Validate Token</button>
          </form>
        )}

        {/* Password Reset Form (Visible if token is valid) */}
        {isTokenValid && (
          <form onSubmit={handleResetPassword}>
            <input
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter New Password"
              required
            />
            <button type="submit">Reset Password</button>
          </form>
        )}
      </div>

      {/* Popup Notification */}
      {error && <div className="popup-message error">{error}<button className="close-popup" onClick={closePopup}>✖</button></div>}
      {success && <div className="popup-message">{success}<button className="close-popup" onClick={closePopup}>✖</button></div>}
    </div>
  );
};

export default ResetPassword;

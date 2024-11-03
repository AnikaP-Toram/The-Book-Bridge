// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useAuth } from '../Auth/AuthContext';
import { useNavigate } from 'react-router-dom'; 

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}`/login``, { email, password });
      if (response.status === 200) {
        localStorage.setItem('userId', response.data.user_id);
        localStorage.setItem('token', response.data.access_token);
        login();
        setSuccess('Login successful! Redirecting to dashboard...');
        setError('');
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
        setSuccess('');
      }
    }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    window.location.href = '/reset-password';
  };

  const closePopup = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className='login-main-container'>
      <h2 className='main-heading'>Login</h2>

      {/* Popup Notification */}
      {error && <div className="popup-message error">{error}<button className="close-popup" onClick={closePopup}>✖</button></div>}
      {success && <div className="popup-message">{success}<button className="close-popup" onClick={closePopup}>✖</button></div>}

      <div className='signup-form'>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Forgot Password? <a href="/reset-password" onClick={handlePassword} style={{ color: '#007bff', textDecoration: 'underline' }}>Reset Password</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import './SignUp.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for routing

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const history = useNavigate(); // Initialize history for routing

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.post(`${apiUrl}/signup`, { email, password });
      if (response.status === 201) {
        setSuccess('Signup successful! Please Login...');
        setError('');
        setTimeout(() => {
          history('/login'); 
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
        setSuccess('');
      }
    }
  };

  const closePopup = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className='signup-main-container'>
      <h2 className='main-heading'>Registration</h2>

      {/* Popup Notification */}
      {error && <div className="popup-message error">{error}<button className="close-popup" onClick={closePopup}>✖</button></div>}
      {success && <div className="popup-message">{success}<button className="close-popup" onClick={closePopup}>✖</button></div>}

      <div className='signup-form'>
        <form onSubmit={handleSignup}>
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
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already a member? <a href="/login" style={{ color: '#007bff', textDecoration: 'underline' }}>Click Here To Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;

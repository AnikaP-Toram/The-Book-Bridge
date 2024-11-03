import React, { useState } from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const handleLogOff = () => {
    setIsLoggedIn(false);
    logout();
    navigate('/home');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  }

  return (
      <div className='dashboard-main-container'>
        <header className='header'>
        <div className='your-books-logo' onClick={navigateToDashboard}>The Book Bridge</div>
        <button type="submit" onClick={handleLogOff}>Log Off</button>
      </header>
        <h2>Dashboard</h2>
        <div className='tile-container'>
          <div className='tile add-tile' onClick={() => navigate('/your-books')}>
            <h3>Your Books</h3>
          </div>
          <div className='tile search-tile' onClick={() => navigate('/search')}>
            <h3>Search for Books</h3>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;

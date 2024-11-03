import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './YourBooks.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const YourBooks = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [books, setBooks] = useState([]);

  useEffect(() => {
    handleListBook();
  }, []);

  const handleListBook = async () => {
    try {
      const user_id = localStorage.getItem('userId');
      const jwt_token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.get(`${apiUrl}/books/${user_id}`, {
        headers: {
          Authorization: `Bearer ${jwt_token}`
        }
      });
      if (response.status === 200) {
        setBooks(response.data);
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
        setSuccess('');
      }
    }
  };

  const handleLogOff = () => {
    setIsLoggedIn(false);
    logout();
    navigate('/home');
  };

  const handleAddBook = () => {
    navigate('/add-book');
  };

  const navigateToDashboard = () => {
    navigate('/dashboard');
  }

  const handleEditBook = (book) => {
    navigate('/edit-book', { state: { book } }); // Pass book object as state
  };

  const handleDeleteBook = async (bookId) => {
    try {
      const jwt_token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL;
      const response = await axios.delete(`${apiUrl}/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${jwt_token}`
        }
      });
      if (response.status === 204) {
        setSuccess('Book deleted successfully!');
        handleListBook(); // Refresh the book list
        setSuccess('');
      }
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError(err.response.data.message);
      }
    }
  };

  const closePopup = () => {
    setError('');
    setSuccess('');
  };

  return (
    <div className='your-books-main-container'>
      <header className='your-books-header'>
        <div className='your-books-logo' onClick={navigateToDashboard}>The Book Bridge</div>
        <button onClick={handleLogOff}>Log Off</button>
      </header>
      {error && <div className="your-books-popup-message error">{error}</div>}
      {success && <div className="your-books-popup-message">{success}</div>}

      <h2>Your Books</h2>
      <div className='your-books-column-main'>
        <div className='your-books-content'>
          <div className='your-books-tile-container'>
            {books.length > 0 ? (
              books.map((book) => (
                <div key={book.id} className="your-books-book-tile">
                  <h3>{book.title}</h3>
                  <p><strong>Author:</strong> {book.author}</p>
                  <p><strong>Genre:</strong> {book.genre}</p>
                  <p><strong>Condition:</strong> {book.condition}</p>
                  <p><strong>Available:</strong> {book.available ? 'Yes' : 'No'}</p>
                  <div className='your-books-button-group'>
                    <button onClick={() => handleEditBook(book)}>Edit</button>
                    <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
                  </div>
                </div>
              ))
            ) : (
              <p>No books available</p>
            )}
          </div>
        </div>
        <div className='your-books-column-side'>
          <button type='submit' onClick={handleAddBook}>Add a Book</button>
        </div>
      </div>
    </div>
  );
}

export default YourBooks;

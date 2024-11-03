import React, { useState } from 'react';
import axios from 'axios';
import './AddBook.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const AddBook = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [genre, setGenre] = useState('');
    const [condition, setCondition] = useState('');
    const [available, setAvailable] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const history = useNavigate();

    const handleLogOff = () => {
        setIsLoggedIn(false);
        logout();
        navigate('/home');
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const user_id = localStorage.getItem('userId');
            const jwt_token = localStorage.getItem('token');
            const response = await axios.post(
                `${apiUrl}/books`,
                { title, author, genre, condition, available, user_id },
                {
                  headers: {
                    Authorization: `Bearer ${jwt_token}`
                  }
                }
              );
            if (response.status === 201) {
                setSuccess('Book Added!');
                setError('');
                setTimeout(() => {
                    history('/your-books');
                }, 2000);
            }
        } catch (err) {
            if (err.response && err.response.status === 400) {
                setError(err.response.data.message);
                setSuccess('');
            }
        }
    };

    const navigateToDashboard = () => {
        navigate('/dashboard');
      }

    const closePopup = () => {
        setError('');
        setSuccess('');
    };

    return (
        <div className='main-container'>
            <header className='header'>
            <div className='your-books-logo' onClick={navigateToDashboard}>The Book Bridge</div>
                <button onClick={handleLogOff}>Log Off</button>
            </header>
            <h2>Add Your Book</h2>
            {/* Popup Notification */}
            {error && <div className="popup-message error">{error}</div>}
            {success && <div className="popup-message">{success}</div>}

            <div className='signup-form'>
                <form onSubmit={handleAddBook}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Book Title"
                        required
                    />
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Author"
                        required
                    />
                    <input
                        type="text"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="Genre of Book"
                        required
                    />
                    <input
                        type="text"
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                        placeholder="Condition of Book"
                        required
                    />
                    <input
                        type="text"
                        value={available}
                        onChange={(e) => setAvailable(e.target.value)}
                        placeholder="Availability (Yes or No)"
                        required
                    />
                    <button type="submit">Add</button>
                </form>
            </div>
        </div>
    );
}

export default AddBook;
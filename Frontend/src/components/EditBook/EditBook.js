import React, { useState } from 'react';
import axios from 'axios';
import './EditBook.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';
import { useLocation } from 'react-router-dom';

const EditBook = () => {

    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const location = useLocation();
    const { book } = location.state;
    const [title, setTitle] = useState(book.title);
    const [author, setAuthor] = useState(book.author);
    const [genre, setGenre] = useState(book.genre);
    const [condition, setCondition] = useState(book.condition);
    const [available, setAvailable] = useState(book.available);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const history = useNavigate();

    const handleLogOff = () => {
        setIsLoggedIn(false);
        logout();
        navigate('/home');
    };

    const closePopup = () => {
        setError('');
        setSuccess('');
    };

    const handleEditBook = async (e) => {
        e.preventDefault();
        try {
            const apiUrl = process.env.REACT_APP_API_URL;
            const bookId = book.id;
            const jwt_token = localStorage.getItem('token');
            const response = await axios.put(
                `${apiUrl}/books/${bookId}`,
                { title, author, genre, condition, available },
                {
                    headers: {
                        Authorization: `Bearer ${jwt_token}`
                    }
                }
            );
            if (response.status === 200) {
                setSuccess('Book Updated!');
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
    }

    const navigateToDashboard = () => {
        navigate('/dashboard');
      }

    return (
        <div className='main-container'>
            <header className='header'>
            <div className='your-books-logo' onClick={navigateToDashboard}>The Book Bridge</div>
                <button onClick={handleLogOff}>Log Off</button>
            </header>
            <h2>Edit Your Book</h2>
            {/* Popup Notification */}
            {error && <div className="popup-message error">{error}</div>}
            {success && <div className="popup-message">{success}</div>}

            <div className='signup-form'>
                <form onSubmit={handleEditBook}>
                    <input
                        type="text"
                        // value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Book Title"
                        defaultValue={book.title}
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="Author"
                        defaultValue={book.author}
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setGenre(e.target.value)}
                        placeholder="Genre of Book"
                        defaultValue={book.genre}
                        required
                    />
                    <input
                        type="text"
                        onChange={(e) => setCondition(e.target.value)}
                        placeholder="Condition of Book"
                        defaultValue={book.condition}
                        required
                    />
                    {
                        book.available === true ? (
                            <input
                                type="text"
                                onChange={(e) => setAvailable(e.target.value)}
                                placeholder="Availability (Yes or No)"
                                defaultValue="Yes"
                                required
                            />
                        ) : (
                            <input
                                type="text"
                                onChange={(e) => setAvailable(e.target.value)}
                                placeholder="Availability (Yes or No)"
                                defaultValue="No"
                                required
                            />
                        )
                    }
                    <button type="submit">Update Book Details</button>
                </form>
            </div>
        </div>
    );
}

export default EditBook;
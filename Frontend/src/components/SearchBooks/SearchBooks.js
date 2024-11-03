import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBooks.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthContext';

const SearchBooks = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('All');
    const [expandedBookId, setExpandedBookId] = useState(null);

    useEffect(() => {
        handleListBook();
    }, []);

    const handleListBook = async () => {
        try {
            const user_id = localStorage.getItem('userId');
            const jwt_token = localStorage.getItem('token');
            const userIdInt = parseInt(user_id, 10);
            const apiUrl = process.env.REACT_APP_API_URL;
            const response = await axios.get(`${apiUrl}/books`, {
                headers: {
                  Authorization: `Bearer ${jwt_token}`
                }
              });
            if (response.status === 200) {
                const otherBooks = response.data.filter(book => book.user_id !== userIdInt);
                setBooks(otherBooks);
                setFilteredBooks(otherBooks); // Initialize filtered books to match books initially
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

    const navigateToDashboard = () => {
        navigate('/dashboard');
      }

    const closePopup = () => {
        setError('');
        setSuccess('');
    };

    const handleSearch = () => {
        const filtered = books.filter((book) => {
            const matchesSearchTerm = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                book.author.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesGenre = genreFilter ? book.genre === genreFilter : true;
            const matchesAvailability = availabilityFilter === 'All' || (availabilityFilter === 'Yes' && book.available) || (availabilityFilter === 'No' && !book.available);

            return matchesSearchTerm && matchesGenre && matchesAvailability;
        });

        setFilteredBooks(filtered);
        setExpandedBookId(null); // Collapse any expanded book on new search
    };

    const toggleBookDetails = (bookId) => {
        setExpandedBookId(expandedBookId === bookId ? null : bookId);
    };

    return (
        <div className='main-container'>
            <header className='header'>
            <div className='your-books-logo' onClick={navigateToDashboard}>The Book Bridge</div>
                <button onClick={handleLogOff}>Log Off</button>
            </header>
            {error && <div className="popup-message error">{error}<button className="close-popup" onClick={closePopup}>✖</button></div>}
            {success && <div className="popup-message">{success}<button className="close-popup" onClick={closePopup}>✖</button></div>}

            <h2>Search for Books</h2>
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Search by title or author"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
                    <option value="">All Genres</option>
                    <option value="Fiction">Fiction</option>
                    <option value="Non-Fiction">Non-Fiction</option>
                    <option value="Science">Science</option>
                    <option value="History">History</option>
                    {/* Add more genres as needed */}
                </select>
                <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                    <option value="All">All Availability</option>
                    <option value="Yes">Available</option>
                    <option value="No">Not Available</option>
                </select>
                <button onClick={handleSearch}>Search</button>
            </div>

            <div className='content'>
                <div className='book-results'>
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
                            <div key={book.id} className="book-tile" onClick={() => toggleBookDetails(book.id)}>
                                <h3>{book.title}</h3>
                                <p><strong>Author:</strong> {book.author}</p>

                                {/* Show additional details only if this book is expanded */}
                                {expandedBookId === book.id && (
                                    <div className="book-details">
                                        <p><strong>Genre:</strong> {book.genre}</p>
                                        <p><strong>Condition:</strong> {book.condition}</p>
                                        <p><strong>Available:</strong> {book.available ? 'Yes' : 'No'}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>No books found matching your criteria</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchBooks;

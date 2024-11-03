import React, { useState } from 'react';
import './Home.css';

const Home = () => {

    const redirectSignUp = async (e) => {
        e.preventDefault();
        window.location.href = '/signup';
    }

    const redirectLogin = async (e) => {
        e.preventDefault();
        window.location.href = '/login';
    }

    return (
        <div className='home-main-container'>
            <h2 className='home-main-heading'>The Book Bridge</h2>
            <p>Welcome to Book Bridge, where your books find new stories to tell. Join our community of passionate readers and exchange your favorite reads with fellow book lovers. From timeless classics to modern must-reads, our platform connects you with the perfect matches for your literary cravings. Dive into a world where every book has a second chapter, and let's turn the page together. 📚✨</p>
            <div className='signup-form'>
                <form>
                    <button type="submit" onClick={redirectSignUp}>Register Now!</button>
                    <button type="submit" onClick={redirectLogin}v>Already a Member? Login Here!</button>
                </form>
            </div>
        </div>
    );
};

export default Home;
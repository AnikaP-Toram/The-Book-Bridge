// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/Auth/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Home from './components/Home/Home';
import Signup from './components/SignUp/SignUp';
import Login from './components/Login/Login';
import ResetPassword from './components/ResetPassword/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';
import YourBooks from './components/YourBooks/YourBooks';
import AddBook from './components/AddBook/AddBook';
import EditBook from './components/EditBook/EditBook';
import SearchBooks from './components/SearchBooks/SearchBooks';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path='*' element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
          <Route path="/your-books" element={<ProtectedRoute><YourBooks /></ProtectedRoute>}/>
          <Route path="/add-book" element={<ProtectedRoute><AddBook /></ProtectedRoute>}/>
          <Route path="/edit-book" element={<ProtectedRoute><EditBook /></ProtectedRoute>}/>
          <Route path="/search" element={<ProtectedRoute><SearchBooks /></ProtectedRoute>}/>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

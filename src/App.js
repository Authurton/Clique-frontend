import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar';
import Home from './components/Home';
import UserRegister from './components/UserRegister';
import AdminDashboard from './components/AdminDashboard';
import GroupChat from './components/GroupChat';
import Login from './components/Login';
import axiosInstance from './axiosInstance';
import { getCsrfToken } from './csrf';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const csrfToken =  getCsrfToken();
  const baseURL = 'http://localhost:8000';

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
        await axios.post(`${baseURL}/api/users/logout/`);
        setIsAuthenticated(false);
    } catch (error) {
        console.error('Error logging out:', error);
    }
};

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axiosInstance.get('/api/users/current_user/', {
          headers: {
            'X-CSRFToken': csrfToken,
          },
        });
        if (response.data.id) {
          setCurrentUser(response.data);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  return (
    <Router>
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister onRegister={handleLogin} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<AdminDashboard currentUser={currentUser} />} />
            <Route path="/groups" element={<GroupChat />} />
            <Route path="/group-chat/:groupId" element={<GroupChat />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
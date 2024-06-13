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

  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      setIsAuthenticated(true);
      setCurrentUser(userData);
    }
  }, []);

  const handleLogin = async () => {
    setIsAuthenticated(true);
  
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

  const handleLogout = async () => {
    try {
      const csrfToken = await getCsrfToken();
  
      const response = await axiosInstance.post('/api/users/logout/', null, {
        headers: {
          'X-CSRFToken': csrfToken,
        },
      });
  
      setIsAuthenticated(false);
      setCurrentUser(null);
      localStorage.removeItem('userData');
      localStorage.removeItem('currentUser');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateUserGroups = (newGroups) => {
    setCurrentUser(prevUser => ({ ...prevUser, groups: newGroups }));
  };

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
        {isAuthenticated ? ( 
          <>
            <Route path="/dashboard" element={<AdminDashboard currentUser={currentUser} updateUserGroups={updateUserGroups} />} />
            <Route path="/groups" element={<GroupChat />} />
            <Route path="/group-chat/:groupId" element={<GroupChat userId={currentUser?.id} userName={currentUser?.name}  />} />
          </>
        ) : (
          <Route path="*" element={<Home />} /> 
        )}
      </Routes>
    </Router>
  );
};

export default App;
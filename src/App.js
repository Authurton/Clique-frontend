import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import UserRegister from './components/UserRegister';
import AdminDashboard from './components/AdminDashboard';
import GroupChat from './components/GroupChat';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<UserRegister onRegister={handleLogin} />} />
        {isAuthenticated && (
          <>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/groups" element={<GroupChat />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
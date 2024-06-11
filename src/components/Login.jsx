import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../axiosInstance';
import { getCsrfToken } from '../csrf';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const csrfToken = await getCsrfToken();
  
    try {
    
      const response = await axiosInstance.post('/api/users/login/', {
        username,
        password,
    }, {
        headers: {
            'X-CSRFToken': csrfToken,
        }
    });
  
    if (response.data.id) {
      const userData = {
        id: response.data.id,
        name: response.data.name,
      };
      const currentUser = response.data.name;
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      
      onLogin();
      navigate('/');
    } else {
    console.error(response.data.error);
    }
    } catch (error) {
        alert('Check your details and try to login again')
        console.error('Error during login:', error);
        }
    };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
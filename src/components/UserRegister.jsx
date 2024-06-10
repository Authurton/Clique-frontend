import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/UserReg.css';

const UserRegistration = ({onRegister}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const navigate = useNavigate();
  const baseURL = 'http://localhost:8000';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const interestsArray = interests.split(',').map(interest => interest.trim());
    const userData = {
      name,
      password,
      interests: interestsArray.length === 1 && interestsArray[0] === '' ? [] : interestsArray
    };

    try {
      await axios.post(`${baseURL}/api/users/`, userData);
      alert('User registered successfully!');
      onRegister();
      navigate('/dashboard'); 
    } catch (error) {
      console.error('Error registering user:', error.response.data);
      alert('Failed to register user.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Interests:</label>
        <input
          type="text"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          required
        />
        <small>Comma separated values</small>
      </div>
      <button type="submit">Register</button>
    </form>
  );
};

export default UserRegistration;

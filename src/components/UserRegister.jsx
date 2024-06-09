import React, { useState } from 'react';
import axios from 'axios';
import '../css/UserReg.css';

const UserRegistration = ({onRegister}) => {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const baseURL = 'http://localhost:8000';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const interestsArray = interests.split(',').map(interest => interest.trim());
    const userData = {
      name,
      interests: interestsArray.length === 1 && interestsArray[0] === '' ? [] : interestsArray
    };
    console.log(userData, 'user data');

    try {
      await axios.post(`${baseURL}/api/users/`, userData);
      alert('User registered successfully!');
      onRegister();
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

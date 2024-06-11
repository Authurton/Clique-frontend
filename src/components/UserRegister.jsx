import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import { getCsrfToken } from '../csrf';
import '../css/UserReg.css';

const UserRegistration = ({onRegister}) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const csrfToken = await getCsrfToken();

    const interestsArray = interests.split(',').map(interest => interest.trim());
    const userData = {
      name,
      password,
      interests: interestsArray.length === 1 && interestsArray[0] === '' ? [] : interestsArray
    };

    try {
      const registrationResponse = await axiosInstance.post('/api/users/', userData, {
        headers: {
          'X-CSRFToken': csrfToken,
        }
      });

      if (registrationResponse.status === 201) {
        const loginResponse = await axiosInstance.post('/api/users/login/', {
          username: userData.name, 
          password: userData.password,
        }, {
          headers: {
            'X-CSRFToken': csrfToken,
          }
        });

        if (loginResponse.data.id) {
          const registeredUser = {
            id: loginResponse.data.id,
            name: loginResponse.data.name,
          };

          localStorage.setItem('userData', JSON.stringify(registeredUser));
          onRegister();
          navigate('/dashboard', { state: { user: registeredUser } });
        } else {
          console.error(loginResponse.data.error);
          alert('Failed to log in after registration.');
        }
      } else {
        console.error('Registration failed:', registrationResponse.data);
        alert('Failed to register user.');
      }
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

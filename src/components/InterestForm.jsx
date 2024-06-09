import React, { useState } from 'react';
import axios from 'axios';

const InterestForm = () => {
  const [interests, setInterests] = useState('');
  const baseURL = 'http://localhost:8000';

  const handleSubmit = async (event) => {
    event.preventDefault();
    const interestData = { interests: interests.split(',').map(interest => interest.trim()) };
    try {
      await axios.post(`${baseURL}/api/interests/`, interestData);
      alert('Interests submitted successfully!');
    } catch (error) {
      console.error('Error submitting interests:', error);
      alert('Failed to submit interests.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Interests:</label>
        <input type="text" value={interests} onChange={(e) => setInterests(e.target.value)} required />
        <small>Comma separated values</small>
      </div>
      <button type="submit">Submit Interests</button>
    </form>
  );
};

export default InterestForm;

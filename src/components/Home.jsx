import React from 'react';
import '../css/Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="card">
        <h1>Welcome to Clique of 10</h1>
        <p>
          This is the homepage of our application. Here, you can find information
          about our services and what we offer.
        </p>
      </div>
      <div className="card">
        <h2>About Us</h2>
        <p>
          We are a company that specializes in providing high-quality products and
          services to our customers. Our mission is to ensure customer
          satisfaction and deliver exceptional value.
        </p>
      </div>
      <div className="card">
        <h2>Our Services</h2>
        <p>
          To learn more about our services or to get started, please visit the
          corresponding pages in the navigation menu.
        </p>
      </div>
    </div>
  );
};

export default Home;
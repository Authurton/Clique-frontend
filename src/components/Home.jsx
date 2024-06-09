import React from 'react';
import '../css/Home.css';

const Home = () => {
  return (
    <div>
      <h1>Welcome to My App</h1>
      <p>
        This is the homepage of our application. Here, you can find information
        about our services and what we offer.
      </p>
      <h2>About Us</h2>
      <p>
        We are a company that specializes in providing high-quality products and
        services to our customers. Our mission is to ensure customer
        satisfaction and deliver exceptional value.
      </p>
      <h2>Our Services</h2>
      <ul>
        <li>Service 1</li>
        <li>Service 2</li>
        <li>Service 3</li>
      </ul>
      <p>
        To learn more about our services or to get started, please visit the
        corresponding pages in the navigation menu.
      </p>
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar = ({ isAuthenticated }) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!isAuthenticated && (
          <li>
            <Link to="/register">Register</Link>
          </li>
        )}
        {isAuthenticated && (
          <>
            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/groups">Groups</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  // Create a CSS file for styling

const Home = () => (
  <div className="home-container">
    <div className="header">
      <h1>InterviewPrep</h1>
      <h2>Find partners to prepare for your interviews.</h2>
    </div>
    <div className="buttons">
      <Link to="/register">
        <button className="register-button">Create account</button>
      </Link>
      <Link to="/login">
        <button className="login-button">Login</button>
      </Link>
    </div>
  </div>
);

export default Home;

import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>Welcome to InterviewPrep</h1>
    <nav>
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/chatbot">Chatbot</Link>
    </nav>
  </div>
);

export default Home;

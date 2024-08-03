import React, { useState } from 'react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

const Chatbot = () => {
  const [role, setRole] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      setError('Please select a role');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/chatBot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: rolePrompts[role], userMessage }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.reply);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'An error occurred');
      }
    } catch (err) {
      setError('An error occurred');
    }
  };

  const rolePrompts = {
    "Investment Banking": "You are an interviewer for an Investment Banking position. Ask me questions relevant to this role.",
    "Management Consulting": "You are an interviewer for a Management Consulting position. Ask me questions relevant to this role.",
    "Software Engineering": "You are an interviewer for a Software Engineering position. Ask me questions relevant to this role.",
    "Research Roles": "You are an interviewer for a Research role. Ask me questions relevant to this role."
  };

  return (
    <motion.div
      className="container mt-5 p-4 rounded shadow-sm"
      style={{ backgroundColor: 'white' }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-center mb-4">Practice Interview with AI</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Role:</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="">Select Role</option>
            <option value="Investment Banking">Investment Banking</option>
            <option value="Management Consulting">Management Consulting</option>
            <option value="Software Engineering">Software Engineering</option>
            <option value="Research Roles">Research Roles</option>
          </select>
        </div>
        <div className="form-group">
          <label>Your Message:</label>
          <textarea
            className="form-control"
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary btn-block">Send</button>
      </form>
      {response && (
        <motion.div
          className="mt-4 alert alert-success"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Response:</h3>
          <p>{response}</p>
        </motion.div>
      )}
      {error && (
        <motion.div
          className="mt-4 alert alert-danger"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h3>Error:</h3>
          <p>{error}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Chatbot;

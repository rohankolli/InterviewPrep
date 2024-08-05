import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:5000/login', {  // URL of the Flask backend
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (response.ok) {
      navigate('/dashboard'); 
    } else {
      alert('Login failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.loginBox}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.inputContainer}>
            <label style={styles.label}>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>Login</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#000', // Black background
    color: '#fff', // White text
  },
  loginBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Slightly transparent dark background
    padding: '40px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    textAlign: 'left',
    color: '#fff', // White text
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#333', // Dark input background
    color: '#fff', // White text
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#1da1f2', // Blue button background
    color: '#fff', // White text
    cursor: 'pointer',
    fontSize: '16px',
  },
};

export default Login;

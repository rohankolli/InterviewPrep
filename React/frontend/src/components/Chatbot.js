import React, { useState } from 'react';

const Chatbot = () => {
  const [prompt, setPrompt] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:5000/chatBot', {  // Update with your Flask backend URL
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, userMessage }),
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

  return (
    <div>
      <h2>Chat with the Bot</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Prompt:</label>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Your Message:</label>
          <textarea
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send</button>
      </form>
      {response && <div><h3>Response:</h3><p>{response}</p></div>}
      {error && <div><h3>Error:</h3><p>{error}</p></div>}
    </div>
  );
};

export default Chatbot;

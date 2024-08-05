import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [position, setPosition] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState(null); // Add state for userId
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/dashboard');
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      } else {
        throw new Error('Failed to fetch posts');
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/profile/1'); // Adjust the endpoint as needed
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setUserId(data.id); // Set the userId from fetched data
      } else {
        throw new Error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchUserProfile();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body, position }),
      });

      if (response.ok) {
        setTitle('');
        setBody('');
        setPosition('');
        fetchPosts();
      } else {
        throw new Error('Failed to post');
      }
    } catch (error) {
      console.error('Error posting:', error);
      alert('Post failed');
    }
  };

  return (
    <div className="container mt-4" style={styles.container}>
      <div className="row">
        <div className="col-md-3">
          <div className="card mb-3" style={styles.card}>
            <div className="card-body text-center">
              <img
                src="https://via.placeholder.com/150"
                className="rounded-circle mb-3"
                alt="User Profile Picture"
              />
              <h5 className="card-title" style={styles.cardTitle}>
                {username}
              </h5>
              <Link to={`/profile/${userId}`} className="btn btn-outline-primary btn-sm">
                View Profile
              </Link>
              <br />
              <br />
              <Link to="/chatbot" className="btn btn-primary btn-sm">
                Chatbot
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3" style={styles.card}>
            <div className="card-body">
              <h5 className="card-title" style={styles.cardTitle}>
                Start a post
              </h5>
              <form onSubmit={handlePostSubmit}>
                <div className="form-group">
                  <label style={styles.label}>Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <div className="form-group">
                  <label style={styles.label}>Body:</label>
                  <textarea
                    className="form-control"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows="3"
                    required
                    style={styles.input}
                  />
                </div>
                <div className="form-group">
                  <label style={styles.label}>Position:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                    style={styles.input}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Post
                </button>
              </form>
            </div>
          </div>
          <div className="mt-4">
            <h3 style={styles.label}>Posts</h3>
            {posts.map((post) => (
              <div className="card mb-3" key={post.id} style={styles.postCard}>
                <div className="card-body">
                  <h5 className="card-title" style={styles.cardTitle}>{post.title}</h5>
                  <p className="card-text" style={styles.cardText}>{post.body}</p>
                  <p className="card-text" style={styles.cardText}>
                    <small className="text-muted" style={styles.cardText}>Position: {post.position}</small>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-md-3">
          {/* Additional content can go here */}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#fff',
  },
  card: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: 'none',
  },
  cardTitle: {
    color: '#fff',
  },
  cardText: {
    color: '#fff',
  },
  label: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#2e2e2e',
    color: '#fff',
    border: 'none',
  },
  postCard: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    border: 'none',
  },
};

export default Dashboard;

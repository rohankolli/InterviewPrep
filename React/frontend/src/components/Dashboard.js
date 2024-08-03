import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
 // Make sure to create this file for styling

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [position, setPosition] = useState('');
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

  useEffect(() => {
    fetchPosts();
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
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <div className="card mb-3">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/150" className="rounded-circle mb-3" alt="User Profile Picture" />
              <h5 className="card-title">User Name</h5>
              <Link to="/profile/1" className="btn btn-outline-primary btn-sm">View Profile</Link>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Start a post</h5>
              <form onSubmit={handlePostSubmit}>
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Body:</label>
                  <textarea
                    className="form-control"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">Post</button>
              </form>
            </div>
          </div>
          <div className="mt-4">
            <h3>Posts</h3>
            {posts.map((post) => (
              <div className="card mb-3" key={post.id}>
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text">{post.body}</p>
                  <p className="card-text"><small className="text-muted">Position: {post.position}</small></p>
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

export default Dashboard;

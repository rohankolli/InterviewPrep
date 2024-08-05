// Profile.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profile/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          setLoading(false);
        } else {
          throw new Error('Failed to fetch user profile');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mt-4" style={styles.container}>
      <div className="card mb-3" style={styles.card}>
        <div className="card-body text-center">
          <img
            src="https://via.placeholder.com/150"
            className="rounded-circle mb-3"
            alt="User Profile Picture"
          />
          <h5 className="card-title" style={styles.cardTitle}>
            {userData.username}
          </h5>
          <p className="card-text" style={styles.cardText}>
            Email: {userData.email}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#121212',
    color: '#fff',
    border: 'none',
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
};

export default Profile;

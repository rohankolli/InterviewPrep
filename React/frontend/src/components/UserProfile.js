import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function UserProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`/profile/${id}`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, [id]);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.profileBox}>
        <div style={styles.navbar}>
          <a href="/dashboard" style={styles.navItem}>Dashboard</a>
          <a href={`/edit-profile/${id}`} style={styles.navItem}>Edit Profile</a>
          <a href={`/edit-password/${id}`} style={styles.navItem}>Edit Password</a>
          <a href="/logout" style={styles.navItem}>User Logout</a>
        </div>
        <div style={styles.profileContent}>
          <div style={styles.profileImageContainer}>
            <img src="path-to-profile-image.png" alt="Profile" style={styles.profileImage} />
          </div>
          <h2 style={styles.profileName}>{profile.name}</h2>
          <p style={styles.profileUsername}>@{profile.username} <span style={styles.editIcon}>✎</span></p>
          <div style={styles.profileDetails}>
            <div style={styles.profileDetail}>
              <span style={styles.label}>Username:</span>
              <span style={styles.value}>{profile.username}</span>
              <span style={styles.editIcon}>✎</span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{profile.email}</span>
              <span style={styles.editIcon}>✎</span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.label}>Address:</span>
              <span style={styles.value}>{profile.address}</span>
              <span style={styles.editIcon}>✎</span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.label}>Nickname:</span>
              <span style={styles.value}>{profile.nickname}</span>
              <span style={styles.editIcon}>✎</span>
            </div>
            <div style={styles.profileDetail}>
              <span style={styles.label}>DOB:</span>
              <span style={styles.value}>{profile.dob}</span>
              <span style={styles.editIcon}>✎</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f8f8',
  },
  profileBox: {
    width: '60%',
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '20px',
    borderBottom: '1px solid #ddd',
  },
  navItem: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold',
  },
  profileContent: {
    padding: '40px',
    textAlign: 'center',
  },
  profileImageContainer: {
    marginBottom: '20px',
  },
  profileImage: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
  },
  profileName: {
    margin: '10px 0',
  },
  profileUsername: {
    margin: '10px 0',
    color: '#888',
  },
  editIcon: {
    marginLeft: '10px',
    color: '#888',
    cursor: 'pointer',
  },
  profileDetails: {
    marginTop: '30px',
    textAlign: 'left',
  },
  profileDetail: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
    marginLeft: '20px',
  },
};

export default UserProfile;

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
    <div>
      <h1>{profile.username}'s Profile</h1>
      <p>Email: {profile.email}</p>
      <p>Address: {profile.address}</p>
      <p>Nickname: {profile.nickname}</p>
      <p>DOB: {profile.dob}</p>
    </div>
  );
}

export default UserProfile;

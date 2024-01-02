// src/ProfileTest.jsx
//Display user profile based on its ID (its hardcoded)
import React, { useState, useEffect } from 'react';

const ProfileTest = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Replace {auth0Id} with an actual Auth0 ID
    fetch('http://localhost:5000/api/profile/google-oauth2|112837234637687663966')
      .then(response => response.json())
      .then(data => setProfile(data))
      .catch(error => console.error('Error:', error));
  }, []);
  


  return (
    <div>
      <h2>User Profile</h2>
      {profile ? (
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfileTest;

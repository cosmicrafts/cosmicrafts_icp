// src/components/UserProfile.jsx
import React from 'react';

const UserProfile = ({ user, source }) => {
  // Handle the case where user data is not yet available
  if (!user) {
    return <div>Loading user profile...</div>;
  }

  return (
    <div>
      <h2>{source}: {user.name}</h2>
      <p>{source}: {user.email}</p>
      <h1>{source}: {user.username}</h1>
      {user.picture && <img src={user.picture} alt={user.name} />}
    </div>
  );
};

export default UserProfile;

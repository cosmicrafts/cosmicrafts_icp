// src/components/UserProfile.jsx
import React from 'react';

const UserProfile = ({ user, source }) => {
  return (
    <div>
      <h2>{source}: {user.name}</h2>
      <p>{source}: {user.email}</p>
      {user.picture && <img src={user.picture} alt={user.name} />}
    </div>
  );
};

export default UserProfile;
// src/components/NewUserForm.jsx
import React, { useState } from 'react';

const NewUserForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Choose a username"
      />
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewUserForm;

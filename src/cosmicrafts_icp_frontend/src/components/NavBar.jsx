// src/components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createUser, fetchUserData } from '../api/api';
import UserProfile from './UserProfile';
import NewUserForm from './NewUserForm';

const NavBar = ({ setCanisterUserData }) => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [canisterUser, setCanisterUser] = useState(null);
  const [showUsernameForm, setShowUsernameForm] = useState(false);

  useEffect(() => {
    const handleUserData = async () => {
      if (isAuthenticated && user) {
        let fetchedUser = await fetchUserData(user.sub);
  
        if (!fetchedUser || fetchedUser.length === 0) {
          setShowUsernameForm(true);
        } else {
          setCanisterUser(fetchedUser[0]);
          setCanisterUserData(fetchedUser[0]); // Set canister user data in App component
        }
      }
    };

    handleUserData();
  }, [isAuthenticated, user, setCanisterUserData]);

  const handleNewUserSubmit = async (username) => {
    // ... existing code ...
    try {
      const newUser = { ...user, username };
      await createUser(newUser);
      setShowUsernameForm(false);
      setCanisterUser(newUser);
      setCanisterUserData(newUser); // Update canister user data in App component
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  };

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
      {isAuthenticated && (
        <>
          <UserProfile user={user} source="Auth0" />
          {canisterUser && <UserProfile user={canisterUser} source="Canister" />}
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
          {showUsernameForm && <NewUserForm onSubmit={handleNewUserSubmit} />}
        </>
      )}
    </div>
  );
};

export default NavBar;

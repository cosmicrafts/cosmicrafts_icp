import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createUser } from '../api/api';

const NavBar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  
  useEffect(() => {
    // Call createUser when the user is authenticated
    if (isAuthenticated && user) {
      createUser(user);

      // Log user data to the console
      console.log('User Data:', user);
    }
  }, [isAuthenticated, user]);

  return (
    <div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )}
      {isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        </div>
      )}
    </div>
  );
};

export default NavBar;

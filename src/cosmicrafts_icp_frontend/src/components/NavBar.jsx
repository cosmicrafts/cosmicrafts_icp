// src/components/NavBar.jsx
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { createUser, fetchUserData } from '../api/api';
import UserProfile from './UserProfile';

const NavBar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [canisterUser, setCanisterUser] = useState(null);

  useEffect(() => {
    const handleUserData = async () => {


      if (isAuthenticated && user) {
        let fetchedUser = await fetchUserData(user.sub);


        if (fetchedUser === null) {
          await createUser(user);
          fetchedUser = await fetchUserData(user.sub);
        }


        if (fetchedUser && fetchedUser.length > 0) {
          setCanisterUser(fetchedUser[0]);
        }
      }
    };

    handleUserData();
  }, [isAuthenticated, user]);

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
        </>
      )}
    </div>
  );
};

export default NavBar;

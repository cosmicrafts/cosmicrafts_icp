// src/cosmicrafts_icp_frontend/src/components/NavBar.jsx

import React from 'react';
import { inject, observer } from 'mobx-react';
import { useAuth0 } from '@auth0/auth0-react';
import UserProfile from './UserProfile';
import NewUserForm from './NewUserForm';

const NavBar = inject("userStore")(observer(({ userStore }) => {
  const { loginWithRedirect, logout, user } = useAuth0();

  React.useEffect(() => {
    if (user) {
      userStore.authenticateUser(user);
    }
  }, [user, userStore]);

  const { isAuthenticated, userData, showUsernameForm, handleNewUserSubmit, isLoading } = userStore;
  
  return (
    <div>
      {isLoading ? (
        <p>Loading user profile...</p>
      ) : (
        <>
          {!isAuthenticated ? (
             <>
             <button onClick={() => loginWithRedirect()}>Log In with Auth0</button>
             <button onClick={() => userStore.loginWithPlug()}>Login with Plug</button>
             <button onClick={() => userStore.loginWithStoic()}>Login with Stoic</button>
             <button onClick={() => userStore.loginWithInternetIdentity()}>Log In with Internet Identity</button>
           </>
          ) : (
            <>
              <UserProfile user={userData} source={userData ? "Canister" : "Auth0"} />
              <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
              {showUsernameForm && <NewUserForm onSubmit={(username) => handleNewUserSubmit(username)} />}
            </>
          )}
        </>
      )}
    </div>
  );
}));

export default NavBar;

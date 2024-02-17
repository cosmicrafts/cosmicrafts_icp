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
    <div className="navbar">
      {isLoading ? (
        <p className="loading-message">Loading user profile...</p>
      ) : (
        <>
          {!isAuthenticated ? (
             <>
             <button className="login-button" onClick={() => loginWithRedirect()}>Log In with Auth0</button>
             <button className="login-button" onClick={() => userStore.loginWithPlug()}>Login with Plug</button>
             <button className="login-button" onClick={() => userStore.loginWithStoic()}>Login with Stoic</button>
             <button className="login-button" onClick={() => userStore.loginWithAstroX()}>Login with AstroX</button>
             <button className="login-button" onClick={() => userStore.loginWithInternetIdentity()}>Log In with Internet Identity</button>
             <button className="login-button" onClick={() => userStore.loginWithMetaMask()}>Login with MetaMask</button>
             <button className="login-button" onClick={() => userStore.loginWithNFID()}>Login with NFID</button>
           </>
          ) : (
            <>
              <div className="user-profile">
                <UserProfile user={userData} source={userData ? "Canister" : "Auth0"} />
              </div>
              <button className="logout-button" onClick={() => logout({ returnTo: window.location.href })}>Log Out</button>
              {showUsernameForm && <div className="new-user-form"><NewUserForm onSubmit={(username) => handleNewUserSubmit(username)} /></div>}
            </>
          )}
        </>
      )}
    </div>
  );
}));

export default NavBar;

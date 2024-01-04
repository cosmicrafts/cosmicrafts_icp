import React, { useState, useEffect } from 'react';
import './App.css';
import NavBar from './components/NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import Notification from './components/Notification';

const App = () => {
  const [notification, setNotification] = useState(null);
  const { isAuthenticated } = useAuth0();
  const [canisterUserData, setCanisterUserData] = useState(null);

  // Call this function to show a notification
  const showNotification = (message, type) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 5000); // Hide after 3 seconds
  };

  // Example: Show a success notification after login
  useEffect(() => {
    if (isAuthenticated) {
      showNotification('Login Successful!', 'success');
    }
    if (isAuthenticated && canisterUserData) {
      const welcomeMessage = `Welcome ${canisterUserData.username || 'User'}!`;
      showNotification(welcomeMessage, 'success');
    }
  }, [isAuthenticated, canisterUserData]);

  return (
    <div>
      <NavBar setCanisterUserData={setCanisterUserData} />
      {notification && <Notification message={notification.message} type={notification.type} />}
      {/* Rest of your app */}
    </div>
  );
};

export default App;

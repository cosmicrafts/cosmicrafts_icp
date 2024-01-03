// src/App.jsx
import React, { useState } from 'react';
import './App.css'
import NavBar from './components/NavBar';
import { useAuth0 } from '@auth0/auth0-react';
import Notification from './components/Notification';
import useWebSocketConnection from './components/icwebsockets'

const App = () => {
  const [notification, setNotification] = useState(null);
  const { isAuthenticated } = useAuth0();
  useWebSocketConnection(); 

  // Call this function to show a notification
  const showNotification = (message, type) => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3000); // Hide after 3 seconds
  };
   // Example: Show a success notification after login
   React.useEffect(() => {
    if (isAuthenticated) {
        showNotification('Login Successful!', 'success');
    }
}, [isAuthenticated]);

return (
    <div>
      <NavBar />
        {notification && <Notification message={notification.message} type={notification.type} />}
        {/* Rest of your app */}
    </div>
);
};

export default App
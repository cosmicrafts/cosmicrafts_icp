// App.jsx
import React from 'react';
import { Provider } from 'mobx-react';
import NavBar from './components/NavBar';
import './App.css';
import Notification from './components/Notification';
import userStore from './stores/UserStore';       // Import UserStore
import notificationStore from './stores/NotificationStore'; // Import NotificationStore

const App = () => {
  return (
    <Provider userStore={userStore} notificationStore={notificationStore}>
      <NavBar />
      {/* The rest of your app goes here */}
    </Provider>
  );
};

export default App;

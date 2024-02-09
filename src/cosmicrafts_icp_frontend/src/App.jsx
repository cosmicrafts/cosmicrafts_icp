// src/cosmicrafts_icp_frontend/src/App.jsx

import React from 'react';
import { Provider, observer } from 'mobx-react';
import NavBar from './components/NavBar';
import Notification from './components/Notification';
import userStore from './stores/UserStore';
import notificationStore from './stores/NotificationStore';
import './App.css';

const App = observer(() => { // Use observer to make the component reactive
  return (
    <Provider userStore={userStore} notificationStore={notificationStore}>
      <NavBar />
      {/* Render notifications */}
      {notificationStore.notifications.map((notif, index) => (
        <Notification key={index} message={notif.message} type={notif.type} />
      ))}
      {/* The rest of your app goes here */}
    </Provider>
  );
});

export default App;

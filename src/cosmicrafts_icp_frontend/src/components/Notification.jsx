// src/components/Notification.jsx

import React from 'react';
import '../styles/Notification.css'; // Assume you have some basic CSS for styling

const Notification = ({ message, type }) => {
    return (
        <div className={`notification ${type}`}>
            {message}
        </div>
    );
};

export default Notification;

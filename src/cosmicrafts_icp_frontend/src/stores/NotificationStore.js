// src/stores/NotificationStore.js
import { makeAutoObservable } from 'mobx';

class NotificationStore {
  notifications = [];

  constructor() {
    makeAutoObservable(this);
  }

  // Enhanced to include autoDismiss and duration parameters
  showNotification(message, type, autoDismiss = true, duration = 5000) {
    let textMessage = message;
    const id = Date.now(); // Unique ID for each notification
    const notification = { id, message: textMessage, type, autoDismiss, duration };
    this.notifications.push(notification);

    if (typeof message !== 'string') {
      textMessage = message.message || JSON.stringify(message);
    }
    
    // Auto-remove for dismissible notifications
    if (autoDismiss) {
      setTimeout(() => this.removeNotification(id), duration);
    }
  }

  removeNotification(id) {
    this.notifications = this.notifications.filter(notif => notif.id !== id);
  }
}

export default new NotificationStore();
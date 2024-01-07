// src/stores/NotificationStore.js

import { makeAutoObservable } from 'mobx';

class NotificationStore {
  notifications = [];

  constructor() {
    makeAutoObservable(this);
  }

  showNotification(message, type) {
    const notification = { message, type };
    this.addNotification(notification);
    setTimeout(() => this.removeNotification(notification), 5000); // Adjust the time as needed
  }

  addNotification(notification) {
    this.notifications.push(notification);
  }

  removeNotification(notification) {
    this.notifications = this.notifications.filter(notif => notif !== notification);
  }
}

export default new NotificationStore();

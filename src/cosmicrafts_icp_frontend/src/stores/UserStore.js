// src/stores/UserStore.js

import { makeAutoObservable, runInAction } from 'mobx';
import { createUser, fetchUserData } from '../api/api';

class UserStore {
  isAuthenticated = false;
  userData = null;
  showUsernameForm = false;
  

  constructor() {
    makeAutoObservable(this);
  }

  authenticateUser = async (auth0User) => {
    console.log("Authenticating user...");
    await this.checkAndFetchUser(auth0User);
    runInAction(() => {
      console.log("User authenticated");
      this.isAuthenticated = true;
    });
  }

  checkAndFetchUser = async (auth0User) => {
    console.log("Checking user existence in canister...");
    const fetchedUser = await fetchUserData(auth0User.sub);
    runInAction(() => {
      if (fetchedUser && fetchedUser.length > 0) {
        console.log("User exists in canister. Displaying user data.");
        this.setUserData(fetchedUser[0]);
      } else {
        console.log("User does not exist in canister. Prompting for username creation.");
        this.showUsernameForm = true;
        this.userData = auth0User;
      }
    });
  }

  handleNewUserSubmit = async (username) => {
    console.log("Creating new user in canister...");
    try {
      const newUser = { ...this.userData, username };
      await createUser(newUser);
      runInAction(() => {
        console.log("New user created in canister. Updating user data.");
        this.setUserData(newUser);
        this.showUsernameForm = false;
      });
    } catch (error) {
      console.error('Error in creating user:', error);
    }
  }

  setUserData = (data) => {
    this.userData = data;
  }
}

export default new UserStore();
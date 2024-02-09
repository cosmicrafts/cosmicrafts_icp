// src/stores/UserStore.js
import { makeAutoObservable, runInAction } from 'mobx';
import { createUser, fetchUserData } from '../api/api';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import NotificationStore from './NotificationStore';

class UserStore {
  isAuthenticated = false;
  userData = null;
  showUsernameForm = false;
  isLoading = false;
  userPrincipal = null;
  errorMessage = "";

  constructor() {
    makeAutoObservable(this);
  }

  async authenticateUser(auth0User) {
    console.log("Authenticating user...");
    await this.checkAndFetchUser(auth0User);
    runInAction(() => {
      console.log("auth0 user authenticated");
      this.isAuthenticated = true;
    });
  }

  async checkAndFetchUser(auth0User) {
    console.log("Checking user existence in canister...");

    // Directly hash the sub
    const hashBuffer = await this.hashSubDirectly(auth0User.sub);
    const hashHex = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
    console.log(`Directly Hashed Sub: ${hashHex}`);

    const identity = await this.createIdentityFromHash(hashBuffer);
    console.log(`Generated Identity: ${identity.getPrincipal().toString()}`);

    this.userPrincipal = identity.getPrincipal();
    const fetchedUser = await fetchUserData(this.userPrincipal.toString());

    runInAction(() => {
      if (fetchedUser && fetchedUser.length > 0) {
        console.log("User exists in canister. Displaying user data.");
        this.setUserData(fetchedUser[0]);
        NotificationStore.showNotification("Welcome back! User data fetched successfully.", "success");
      } else {
        console.log("User does not exist in canister. Prompting for username creation.");
        this.showUsernameForm = true;
        this.userData = { ...auth0User, sub: this.userPrincipal };
        NotificationStore.showNotification("You're new here! Let's set up your username.", "info");
      }
    });
  }

  async hashSubDirectly(sub) {
    const encoder = new TextEncoder();
    const encodedSub = encoder.encode(sub);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedSub);
    console.log('Hashing sub directly...');
    return hashBuffer;
  }

  async createIdentityFromHash(hashBuffer) {
    const seed = new Uint8Array(hashBuffer.slice(0, 32));
    console.log('Generating key pair from hash...');
    const keyPair = nacl.sign.keyPair.fromSeed(seed);
    const privateKey = keyPair.secretKey.slice(0, 32);
    const publicKey = keyPair.publicKey;
    
    // Correctly log the private key and public key
    console.log(`Private Key: ${Array.from(privateKey).map(b => b.toString(16).padStart(2, '0')).join('')}`);
    console.log(`Public Key: ${Array.from(publicKey).map(b => b.toString(16).padStart(2, '0')).join('')}`);

    const identity = Ed25519KeyIdentity.fromKeyPair(privateKey, publicKey);
    console.log(`Generated Identity: ${identity.getPrincipal().toString()}`);
    return identity;
}

handleNewUserSubmit = async (username) => {
  console.log("Creating new user in canister...");
  this.isLoading = true;
  // Reset error message before attempting to create a new user
  this.errorMessage = "";
  try {
    const newUser = { ...this.userData, username, id: this.userPrincipal };
    await createUser(newUser);
    runInAction(() => {
      console.log("New user created in canister. Updating user data.");
      this.setUserData(newUser);
      this.showUsernameForm = false;
      this.isAuthenticated = true;
      this.isLoading = false;
      NotificationStore.showNotification("User created successfully! Welcome aboard.", "success");
    });
  } catch (error) {
    console.error('Error in creating user:', error);
    runInAction(() => {
      this.isLoading = false; // Reset loading state
      NotificationStore.showNotification(error.message, 'error');
      this.errorMessage = error.message; 
    });
  }
}

  setUserData(data) {
    this.userData = data;
  }
}

export default new UserStore();

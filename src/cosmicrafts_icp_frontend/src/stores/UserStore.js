// src/stores/UserStore.js
import { makeAutoObservable, runInAction } from 'mobx';
import { createUser, fetchUserData, icrc1_balance_of, icrc7_balance_of, transferIcrc1 } from '../api/api';
import { Ed25519KeyIdentity } from '@dfinity/identity';
import nacl from 'tweetnacl';
import NotificationStore from './NotificationStore';
import PlugAuthService from '../services/PlugAuthService';
import { Principal } from '@dfinity/principal';
import InternetIdentityService from '../services/InternetIdentityService';
import StoicService from '../services/StoicService';
import AstroXService from '../services/AstroXService';
import MetaMaskService from '../services/MetaMaskService';
import NFIDService from '../services/NFIDService';
import { fromHexString, toHexString, getAccountId } from '../utils/account';
import WebSocketService from '../services/WebSocketService';
import { AuthClient } from "@dfinity/auth-client";


class UserStore {
  isAuthenticated = false;
  userData = null;
  showUsernameForm = false;
  isLoading = false;
  userPrincipal = null;
  errorMessage = "";
  icrc1Balance = 0;
  userNfts = [];

  constructor() {
    makeAutoObservable(this);
    this.initializeWebSocket();
}

  initializeWebSocket() {
    this.webSocket = new WebSocket('ws://localhost:8080/Data');
    this.webSocket.onopen = () => console.log('WebSocket connection established.');
    this.webSocket.onmessage = (message) => console.log('Message received:', message.data);
    this.webSocket.onclose = () => console.log('WebSocket connection closed.');
    this.webSocket.onerror = (error) => console.error('WebSocket error:', error);
}

sendMessageToUnity(message) {
    if (this.webSocket && this.webSocket.readyState === WebSocket.OPEN) {
        this.webSocket.send(JSON.stringify(message));
    } else {
        console.log("WebSocket is not connected. Attempting to reconnect...");
        this.initializeWebSocket();
    }
}

  async authenticateUser(auth0User) {
    console.log("Authenticating user...");
    await this.checkAndFetchUser(auth0User);
    runInAction(() => {
      console.log("User Authenticated");
      this.isAuthenticated = true;
    });
  }

  async checkAndFetchUser(userIdentifier) {
    console.log("Checking user existence in canister...");
  
    let identifier;
    let isWalletPrincipal = false;
  
    // Determine if the input is from Auth0 or a wallet (e.g., Plug)
    if (typeof userIdentifier === 'object' && userIdentifier.sub) {
      // Auth0 user
      identifier = userIdentifier.sub;
    } else {
      // Wallet user
      identifier = userIdentifier;
      isWalletPrincipal = true;
    }
  
    let principalId;
    if (isWalletPrincipal) {
      // For wallet principals, use it directly
      this.userPrincipal = identifier;
      principalId = Principal.fromText(identifier); // Ensure it's a valid principal
    } else {
      // For Auth0, hash the identifier to generate keys and a principal
      const hashBuffer = await this.hashSubDirectly(identifier);
      const identity = await this.createIdentityFromHash(hashBuffer);
      this.userPrincipal = identity.getPrincipal().toString();
      principalId = identity.getPrincipal();
    }
  
    const fetchedUser = await fetchUserData(this.userPrincipal);
    runInAction(() => {
      if (!fetchedUser || fetchedUser.length === 0) {
        this.showUsernameForm = true;
        this.userData = { identifier, sub: this.userPrincipal };
        NotificationStore.showNotification("You're new here! Let's set up your username.", "info");
      } else {
        this.setUserData(fetchedUser[0]);
        NotificationStore.showNotification("Welcome back!", "success");
      }
      this.isLoading = false;
      this.isAuthenticated = !!fetchedUser;
    });
  }
  

  async hashSubDirectly(sub) {
   // console.log(`Hashing sub directly: ${sub}`);
    const encoder = new TextEncoder();
    const encodedSub = encoder.encode(sub);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', encodedSub);
   // console.log('Hashing completed.');
    return hashBuffer;
  }

  async createIdentityFromHash(hashBuffer) {
    const seed = new Uint8Array(hashBuffer.slice(0, 32));
   // console.log('Generating key pair from hash...');
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

async loginWithPlug() {
  this.isLoading = true;
  try {
    const principalId = await PlugAuthService.login();
    await this.checkAndFetchUser(principalId); // Directly pass principalId
  } catch (error) {
    runInAction(() => {
      this.isLoading = false;
      this.errorMessage = error.message;
      NotificationStore.showNotification(error.message, 'error');
    });
  }
}

async loginWithStoic() {
  this.isLoading = true;
  try {
    const principalId = await StoicService.login();
    await this.checkAndFetchUser(principalId); // Directly pass principalId
  } catch (error) {
    runInAction(() => {
      this.isLoading = false;
      this.errorMessage = error.message;
      NotificationStore.showNotification(error.message, 'error');
    });
  }
}

async loginWithAstroX() {
  this.isLoading = true;
  try {
    const principalId = await AstroXService.login();
    await this.checkAndFetchUser(principalId); // Directly pass principalId
  } catch (error) {
    runInAction(() => {
      this.isLoading = false;
      this.errorMessage = error.message;
      NotificationStore.showNotification(error.message, 'error');
    });
  }
}

async loginWithMetaMask() {
  this.isLoading = true;
  try {
      const uniqueMessage = "Sign this message to log in with your Ethereum wallet";
      const signature = await MetaMaskService.signMessage(uniqueMessage);
      // Hash the signature to use as a unique identifier
      const hashBuffer = await this.hashSubDirectly(signature);
      const identity = await this.createIdentityFromHash(hashBuffer);
      this.userPrincipal = identity.getPrincipal().toString();
      await this.checkAndFetchUser(this.userPrincipal);
  } catch (error) {
      runInAction(() => {
          this.isLoading = false;
          this.errorMessage = error.message;
          NotificationStore.showNotification(error.message, 'error');
      });
  }
}


async loginWithInternetIdentity() {
  this.isLoading = true;
  try {
    await InternetIdentityService.initAuthClient();
    const principalId = await InternetIdentityService.login();
    await this.checkAndFetchUser(principalId);
  } catch (error) {
    runInAction(() => {
      this.isLoading = false;
      this.errorMessage = error.message || 'Failed to login with Internet Identity';
      NotificationStore.showNotification(this.errorMessage, 'error');
    });
  }
}

async loginWithNFID() {
  this.isLoading = true;
  try {
      const principalId = await NFIDService.login();
      // After successful login, fetch user data and send a message to Unity
      await this.checkAndFetchUser(principalId);
      this.sendMessageToUnity({
          type: 'LOGIN_SUCCESS',
          payload: { principalId }
      });
  } catch (error) {
      runInAction(() => {
          this.isLoading = false;
          this.errorMessage = error.message;
          NotificationStore.showNotification(error.message, 'error');
      });
  }
}

async logout() {
  await InternetIdentityService.logout();
  runInAction(() => {
    this.isAuthenticated = false;
    this.userData = null;
  });

  this.webSocketService.sendMessage({
    type: 'LOGOUT',
    payload: {}
});
}

handleNewUserSubmit = async (username) => {
  console.log("Creating new user in canister...");
  this.isLoading = true;
  this.errorMessage = "";
  try {
    // Ensure `id` is a Principal object
    const principalId = Principal.fromText(this.userPrincipal);
    const newUser = { ...this.userData, username, id: principalId };
    
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
      this.isLoading = false;
      NotificationStore.showNotification(error.message, 'error');
      this.errorMessage = error.message; 
    });
  }
}

async fetchIcrc1Balance() {
  console.log("Fetching ICRC1 balance for Principal:", this.userPrincipal);

  try {
    const subAccountHex = getAccountId(Principal.fromText(this.userPrincipal), 0);
    const balance = await icrc1_balance_of(this.userPrincipal, subAccountHex);
    console.log(`ICRC1 balance for Principal ${this.userPrincipal} is:`, balance);

    runInAction(() => {
      this.icrc1Balance = balance;
    });
  } catch (error) {
    console.error('Error checking ICRC1 balance:', error);
  }
}


async fetchUserNfts() {
  console.log("Fetching user NFTs...");

  try {
    const balanceResult = await icrc7_balance_of(this.userPrincipal);
    if (balanceResult.success) {
      console.log(`ICRC7 balance for Principal ${this.userPrincipal} is:`, balanceResult.balance);
      runInAction(() => {
        // Assuming balance is the number of NFTs
        this.userNfts = Array.from({ length: parseInt(balanceResult.balance, 10) }, (_, i) => `NFT #${i + 1}`);
      });
    } else {
      console.error('Error checking ICRC7 balance:', balanceResult.error);
      runInAction(() => {
        this.userNfts = `Error: ${balanceResult.error}`;
      });
    }
  } catch (error) {
    console.error('Error checking ICRC7 balance:', error);
    runInAction(() => {
      this.userNfts = `Error: ${error.message}`;
    });
  }
}

async transferTokens(toPrincipalStr, amount) {
  this.isLoading = true;
  try {
    // Define transfer arguments with the necessary adjustments
    const transferArgs = {
      from: {
        owner: Principal.fromText(this.userPrincipal),
        subaccount: [], // Correctly specify null for no subaccount
      },
      to: {
        owner: Principal.fromText(toPrincipalStr),
        subaccount: [], // Similarly for the recipient
      },
      amount: Number(amount), // Convert amount to number
      fee: [], // Leave fee as an empty array if not applicable
      memo: [], // Optional memo can be left empty
      created_at_time: [], // Leave created_at_time empty if not setting a specific timestamp
    };

    // Call the transfer function with the correctly prepared transferArgs
    const result = await transferIcrc1(transferArgs);

    if (result.success) {
      // Refresh the user's balance and notify of success
      await this.fetchIcrc1Balance();
      NotificationStore.showNotification("Transfer successful!", "success");
    } else {
      // Handle failure scenario
      throw new Error(result.error);
    }
  } catch (error) {
    // Log and notify of any errors encountered
    console.error('Error during token transfer:', error);
    NotificationStore.showNotification(`Transfer failed: ${error.message}`, 'error');
  } finally {
    this.isLoading = false;
  }
}


  setUserData(data) {
    this.userData = data;
  }
}


export default new UserStore();

// src/api.js
if (typeof global === "undefined") {
    window.global = window;
  }

import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backendIdlFactory } from './cosmicrafts_icp_backend.did.js';
import { canisterId } from './canister_ids.js';
import { Principal } from '@dfinity/principal';

// Setup the actor to interact with the backend canister
const agent = new HttpAgent({ host: 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io' });
const backendActor = Actor.createActor(backendIdlFactory, {
  agent,
  canisterId: canisterId.backend,
});

// Function to create a new user in the canister
export const createUser = async (user) => {
  try {
    console.log('Creating user with data:', user);
    const result = await backendActor.create_user(user);
    console.log('Result from create_user:', result);
    
    if (result.hasOwnProperty('Error')) {
      throw new Error(result.Error); 
    }

    console.log('User created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Function to fetch user data from the canister
export const fetchUserData = async (userId) => {
  try {
    const principalId = Principal.fromText(userId);
    const userData = await backendActor.get_user(principalId);
    console.log('Fetched User Data from canister:', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
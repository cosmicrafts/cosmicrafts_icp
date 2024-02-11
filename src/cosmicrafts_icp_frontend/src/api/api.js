// src/api.js
if (typeof global === "undefined") {
  window.global = window;
}
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backendIdlFactory } from './cosmicrafts_icp_backend.did.js';
import { idlFactory as icrc1IdlFactory } from './icrc1.did.js';
import { idlFactory as icrc7IdlFactory } from './icrc7.did.js';
import { idlFactory as cosmicraftsIdlFactory } from './cosmicrafts.did.js';
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
    console.log('User Data from Canister:', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error fetching User Data:', error);
    return null;
  }
};

// Initialize agents and actors for new canisters
const icrc1Agent = new HttpAgent({ host: 'https://ic0.app' }); // Adjust host as needed
const icrc7Agent = new HttpAgent({ host: 'https://ic0.app' }); // Adjust host as needed
const cosmicraftsAgent = new HttpAgent({ host: 'https://ic0.app' }); // Adjust host as needed


const icrc1Actor = Actor.createActor(icrc1IdlFactory, {
  agent: icrc1Agent,
  canisterId: canisterId.icrc1,
});

const icrc7Actor = Actor.createActor(icrc7IdlFactory, {
  agent: icrc7Agent,
  canisterId: canisterId.icrc7,
});

const cosmicraftsActor = Actor.createActor(cosmicraftsIdlFactory, {
  agent: cosmicraftsAgent,
  canisterId: canisterId.cosmicrafts,
});

// Balance  Format
const formatBalance = (balance) => {
  const balanceString = balance.toString();
  const integerPart = balanceString.slice(0, -6).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decimalPart = balanceString.slice(-6).padStart(5, '0').slice(0, 2);
  return `${integerPart}.${decimalPart}`;
};

// Function to check ICRC1 balance
export const icrc1_balance_of = async (principal) => {
  try {
    const ownerPrincipal = Principal.fromText(principal);
    const account = { owner: ownerPrincipal, subaccount: [] };
    const balance = await icrc1Actor.icrc1_balance_of(account);
    const formattedBalance = formatBalance(balance);
    return formattedBalance;
  } catch (error) {
    console.error('Error checking ICRC1 balance:', error);
    throw error;
  }
};

// Function to retrieve NFTs owned by a user
export const icrc7_balance_of = async (principal) => {
  try {
    const ownerPrincipal = Principal.fromText(principal);
    const account = { owner: ownerPrincipal, subaccount: [] };
    const result = await icrc7Actor.icrc7_balance_of(account);

    if ('Ok' in result) {
      return { success: true, balance: result.Ok.toString() };
    } else if ('Err' in result) {
      return { success: false, error: result.Err };
    } else {
      throw new Error('Unexpected result format from icrc7_balance_of');
    }
  } catch (error) {
    throw error;
  }
};

export const transferIcrc1 = async (fromAccount, toAccount, amount) => {
  console.log(`transferIcrc1 called with fromAccount: 
  ${JSON.stringify(fromAccount)}, 
  toAccount: ${JSON.stringify(toAccount)}, 
  amount: ${amount}`);

  const transferArgs = {
    from: fromAccount,
    to: toAccount,
    amount: amount,
    fee: [],
    memo: [],
    created_at_time: [],
  };
  console.log(`Structured transferArgs: ${JSON.stringify(transferArgs)}`);

  try {
    const result = await icrc1Actor.icrc1_transfer(transferArgs);
    if ('Ok' in result) {
      console.log('Transfer successful:', result.Ok);
      return { success: true, transactionIndex: result.Ok };
    } else {
      console.error('Transfer failed:', result.Err);
      return { success: false, error: result.Err };
    }
  } catch (error) {
    console.error('Error performing ICRC1 transfer:', error);
    throw error;
  }
};


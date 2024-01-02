// src/api.js
import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as backendIdlFactory } from './cosmicrafts_icp_backend.did.js';
import { canisterId } from './canister_ids.js';

const agent = new HttpAgent({ host: 'https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io' });
const backendActor = Actor.createActor(backendIdlFactory, {
  agent,
  canisterId: canisterId.backend, // Use the string directly
});

export const createUser = async (user) => {
  try {
    await backendActor.create_user({
      id: user.sub,
      name: user.name,
      email: user.email,
      picture: user.picture,
    });
    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

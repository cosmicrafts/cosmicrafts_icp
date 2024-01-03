// src/cosmicrafts_icp_frontend/src/declarations/cosmicrafts_icp_backend/index.js

import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./cosmicrafts_icp_backend.did.js";

export { idlFactory } from "./cosmicrafts_icp_backend.did.js";

export const canisterId = 'br74h-zyaaa-aaaap-qb54a-cai'; // Mainnet canister ID

export const createActor = (options = {}) => {
  const agent = new HttpAgent({
    host: "https://ic0.app", // Mainnet host
    ...options.agentOptions
  });

  // No need to fetch the root key for mainnet

  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

export const cosmicrafts_icp_backend = createActor();

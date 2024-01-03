// src/main.jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';


import IcWebSocket, { generateRandomIdentity, createWsConfig } from "ic-websocket-js";
import { cosmicrafts_icp_backend } from "./declarations/cosmicrafts_icp_backend";

const gatewayUrl = "wss://gateway.icws.io";
const icUrl = "https://ic0.app";
const backendCanisterId = 'br74h-zyaaa-aaaap-qb54a-cai';

const wsConfig = createWsConfig({
  canisterId: backendCanisterId,
  canisterActor: cosmicrafts_icp_backend,
  identity: generateRandomIdentity(),
  networkUrl: icUrl,
});

const ws = new IcWebSocket(gatewayUrl, undefined, wsConfig);

ws.onopen = () => {
  console.log("Connected to the canister");
};

ws.onmessage = async (event) => {
  console.log("Received message:", event.data);

  const messageToSend = {
    text: event.data.text + "-pong",
    timestamp: Date.now() // Adding the timestamp field here
  };
  ws.send(messageToSend);
};


ws.onclose = () => {
  console.log("Disconnected from the canister");
};

ws.onerror = (error) => {
  console.log("Error:", error);
};




ws.onclose = () => {
  console.log("Disconnected from the canister");
};

ws.onerror = (error) => {
  console.log("Error:", error);
};

const root = createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Auth0Provider
      domain="worldofunreal.us.auth0.com"
      clientId="MbSEvChfyejH8nkY9q8i8rTemyJWtnv3"
      authorizationParams={{ redirect_uri: window.location.origin }}
      onRedirectCallback={appState => {
        window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
      }}
      onError={(error) => console.error('Auth0 Error:', error)}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>
);

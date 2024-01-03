// src/cosmicrafts_icp_frontend/src/components/icwebsockets.jsx

import { useEffect } from 'react';
import IcWebSocket, { generateRandomIdentity, createWsConfig } from 'ic-websocket-js';
import { cosmicrafts_icp_backend } from '../declarations/cosmicrafts_icp_backend';

const useWebSocketConnection = () => {
  useEffect(() => {
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
        timestamp: Date.now()
      };
      ws.send(messageToSend);

      // Log the sent message
      console.log("Sent message:", messageToSend);
    };

    ws.onclose = () => {
      console.log("Disconnected from the canister");
    };

    ws.onerror = (error) => {
      console.log("Error:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Additional logic can be added here if needed
};

export default useWebSocketConnection;

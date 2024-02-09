// src/services/PlugAuthService.js

class PlugAuthService {
  async login() {
    try {
      // Ensure the Plug Wallet extension is available
      if (!window.ic || !window.ic.plug) {
        throw new Error("Plug Wallet extension is not installed or not enabled.");
      }

      // Request connection to the Plug Wallet
      await window.ic.plug.requestConnect();

      // Ensure the connection is established
      const isConnected = await window.ic.plug.isConnected();
      if (!isConnected) {
        throw new Error("Could not connect to Plug Wallet.");
      }

      // Get the user's principal ID directly from the Plug Wallet
      const principalId = await window.ic.plug.agent.getPrincipal();

      // Convert the Principal to a string and return it
      return principalId.toString();
    } catch (error) {
      console.error('Plug Wallet login error:', error);
      throw error;
    }
  }
}

export default new PlugAuthService();

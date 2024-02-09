// src/services/StoicService.js
import { StoicIdentity } from 'ic-stoic-identity';

class StoicService {
  async login() {
    try {
      const identity = await StoicIdentity.load();
      if (!identity) {
        const newIdentity = await StoicIdentity.connect();
        return newIdentity.getPrincipal().toString();
      }
      return identity.getPrincipal().toString();
    } catch (error) {
      console.error('Stoic Wallet login error:', error);
      throw error;
    }
  }

  async logout() {
    StoicIdentity.disconnect();
  }
}

export default new StoicService();

// src/services/InternetIdentityService.js
import { AuthClient } from "@dfinity/auth-client";

class InternetIdentityService {
  async initAuthClient() {
    this.authClient = await AuthClient.create();
  }

  async isAuthenticated() {
    return this.authClient.isAuthenticated();
  }

  async login() {
    // Ensure the AuthClient is initialized
    if (!this.authClient) {
      await this.initAuthClient();
    }

    return new Promise((resolve, reject) => {
      this.authClient.login({
        identityProvider: 'https://identity.ic0.app/', // URL of the Internet Identity provider
        onSuccess: async () => {
          const identity = this.authClient.getIdentity();
          const principalId = identity.getPrincipal().toString();
          resolve(principalId);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  }

  async logout() {
    if (this.authClient) {
      this.authClient.logout();
    }
  }
}

export default new InternetIdentityService();

// src/services/NFIDService.js
import { AuthClient } from "@dfinity/auth-client";
import { MyStorage } from "./MyStorage";

class NFIDService {
    static async login() {
        const storage = new MyStorage(); // Assuming MyStorage is your custom storage solution
        const APPLICATION_NAME = "COSMICRAFTS";
        const APPLICATION_LOGO_URL = "https://cosmicrafts.com/wp-content/uploads/2023/09/cosmisrafts-242x300.png";
        const NFID_AUTH_URL = `https://nfid.one/authenticate/?applicationName=${APPLICATION_NAME}&applicationLogo=${APPLICATION_LOGO_URL}#authorize`;
        
        const authClient = await AuthClient.create({ storage: storage, keyType: 'Ed25519', });

        return new Promise((resolve, reject) => {
            authClient.login({
                identityProvider: NFID_AUTH_URL,
                windowOpenerFeatures: `left=${window.screen.width / 2 - 525 / 2}, top=${window.screen.height / 2 - 705 / 2}, toolbar=0, location=0, menubar=0, width=525, height=705`,
                onSuccess: () => {
                    const identity = authClient.getIdentity();
                    const principalId = identity.getPrincipal().toString();
                    resolve(principalId);
                },
                onError: reject,
            });
        });
    }
}

export default NFIDService;

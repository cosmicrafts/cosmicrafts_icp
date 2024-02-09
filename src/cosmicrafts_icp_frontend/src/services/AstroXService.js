class AstroXService {
      constructor() {
        // Set your root URL here
        this.rootUrl = window.location.origin;
        this.loginUri = 'https://63k2f-nyaaa-aaaah-aakla-cai.raw.ic0.app/login';
        // You might need additional parameters like client_id or scope depending on AstroX.me's requirements
      }
    
      // Redirects the user to the AstroX.me login page
      login() {
        window.location.href = `${this.loginUri}?redirect_uri=${encodeURIComponent(this.rootUrl)}`;
        // Redirect to the root URL of your website
      }
    
      // Handles the callback from AstroX.me
      // This function should be called from the component that handles the redirect URI.
      handleCallback() {
        // Extract the token or principal ID from the URL, depending on how AstroX.me passes back the authentication result.
        const urlParams = new URLSearchParams(window.location.search);
        const principalId = urlParams.get('principal'); // This is hypothetical; the actual parameter name may vary.
    
        if (principalId) {
          // Proceed with using the principalId in your application
          return principalId;
        } else {
          // Handle error or absence of principalId
          throw new Error("AstroX.me authentication failed or was cancelled.");
        }
      }
    
      // Assuming AstroX.me requires a logout process
      logout() {
        // Implement logout if AstroX.me provides a method for it, or clear local session data as necessary
      }
    }
    
    export default new AstroXService();
    
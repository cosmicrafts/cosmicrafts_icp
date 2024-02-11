// src/components/UserProfile.jsx
import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import userStore from '../stores/UserStore';
import notificationStore from '../stores/NotificationStore';

export const storesContext = React.createContext({
  userStore,
});

export const useStores = () => React.useContext(storesContext);

const UserProfile = observer(({ user, source }) => {
  const { userStore } = useStores(); 

  const [toPrincipal, setToPrincipal] = React.useState('');
  const [amount, setAmount] = React.useState('');

  const handleTransfer = async (e) => {
    e.preventDefault();
    const numericAmount = Number(amount);
    await userStore.transferTokens(toPrincipal, numericAmount);
  };

  const copyPrincipalToClipboard = () => {
    navigator.clipboard.writeText(userStore.userPrincipal);
    notificationStore.showNotification("Principal copied to clipboard", "success");
  };

  useEffect(() => {
    if (user && userStore.userPrincipal) {
      userStore.fetchIcrc1Balance();
      userStore.fetchUserNfts();
    }
  }, [user, userStore]);

  return (
    <div>
      <h1>{source}: {user.username}</h1>
        <div>
        <strong>Principal:</strong> {userStore.userPrincipal}
        <button onClick={copyPrincipalToClipboard}>Copy</button>
        </div>
      {user.picture && <img src={user.picture} alt={user.name} />}
      <div>
        <strong>ICRC1 Balance:</strong> {userStore.icrc1Balance || 'Fetching...'}
          <form onSubmit={handleTransfer}>
          <input
            type="text"
            value={toPrincipal}
            onChange={(e) => setToPrincipal(e.target.value)}
            placeholder="Recipient Principal"
            required
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            required
          />
          <button type="submit">Transfer Tokens</button>
        </form>
      </div>
      <div>
        <strong>Your NFTs:</strong>
        {userStore.userNfts && userStore.userNfts.length > 0 ? (
          <ul>
            {userStore.userNfts.map((nft, index) => (
              <li key={index}>NFT ID: {nft}</li>
            ))}
          </ul>
        ) : 'Fetching...'}
      </div>
    </div>
  );
});

export default UserProfile;

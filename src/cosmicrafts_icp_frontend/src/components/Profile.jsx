//  src/components/Profile.jsx (not used yet)

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {
    const { user } = useAuth0();
    
    return (
        <div>
            <h2>User Metadata</h2>
            {user && (
                <pre>{JSON.stringify(user['https://yournamespace/metadata'], null, 2)}</pre>
            )}
        </div>
    );
};

export default Profile;

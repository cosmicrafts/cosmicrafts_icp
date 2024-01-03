// src/cosmicrafts_icp_frontend/src/api/cosmicrafts_icp_backend.did.js

export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Text;
  const User = IDL.Record({
    'id' : UserId,
    'name' : IDL.Text,
    'email' : IDL.Text,
    'picture' : IDL.Text,
  });
  return IDL.Service({
    'create_user' : IDL.Func([User], [], []),
    'get_user' : IDL.Func([UserId], [IDL.Opt(User)], []),
    'update_user' : IDL.Func([User], [], []),
  });
};
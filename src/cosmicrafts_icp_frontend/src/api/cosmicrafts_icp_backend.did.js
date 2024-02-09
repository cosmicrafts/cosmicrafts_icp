// src/cosmicrafts_icp_frontend/src/declarations/cosmicrafts_icp_backend/cosmicrafts_icp_backend.did.js
export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const User = IDL.Record({ 'id': UserId, 'username': IDL.Text });
  const OperationResult = IDL.Variant({ 'Success': IDL.Null, 'Error': IDL.Text });
  
  return IDL.Service({
    'create_user': IDL.Func([User], [OperationResult], []),
    'get_user': IDL.Func([UserId], [IDL.Opt(User)], ['query']),
    'update_user': IDL.Func([UserId, IDL.Text], [OperationResult], []),
    'delete_user': IDL.Func([UserId], [OperationResult], []),
    'get_all_users': IDL.Func([], [IDL.Vec(User)], ['query']),
    'delete_all_users': IDL.Func([], [OperationResult], []),
  });
};

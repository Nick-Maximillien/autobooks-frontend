export const idlFactory = ({ IDL }) => {
  const BorrowRequest = IDL.Record({ 'amount' : IDL.Nat });
  const StableToken = IDL.Record({
    'total_supply' : IDL.Nat,
    'balances' : IDL.Vec(IDL.Record({ 'key' : IDL.Text, 'value' : IDL.Nat })),
  });
  const UserAccount = IDL.Record({
    'risk_advice' : IDL.Opt(IDL.Text),
    'deposited' : IDL.Nat,
    'username' : IDL.Opt(IDL.Text),
    'collateral' : IDL.Nat,
    'borrowed' : IDL.Nat,
    'credit_score' : IDL.Nat,
  });
  return IDL.Service({
    'borrow' : IDL.Func([IDL.Text, BorrowRequest], [IDL.Bool], []),
    'deposit' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'deposit_collateral' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'get_balance' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'get_stable_token' : IDL.Func([], [StableToken], []),
    'get_user_account' : IDL.Func([IDL.Text], [IDL.Opt(UserAccount)], []),
    'repay' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
    'set_ai_proxy' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'signup' : IDL.Func([IDL.Text, IDL.Text], [IDL.Bool], []),
    'withdraw_collateral' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Bool], []),
  });
};
export const init = ({ IDL }) => { return []; };

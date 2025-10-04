import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface BorrowRequest { 'amount' : bigint }
export interface RiskRequest {
  'volatility' : bigint,
  'collateral' : bigint,
  'borrowed' : bigint,
  'deposits' : bigint,
  'credit_score' : bigint,
}
export interface RiskResponse { 'advice' : string, 'risk_score' : number }
export interface StableToken {
  'total_supply' : bigint,
  'balances' : Array<{ 'key' : string, 'value' : bigint }>,
}
export interface UserAccount {
  'risk_advice' : [] | [string],
  'deposited' : bigint,
  'username' : [] | [string],
  'collateral' : bigint,
  'borrowed' : bigint,
  'credit_score' : bigint,
}
export interface _SERVICE {
  'borrow' : ActorMethod<[string, BorrowRequest], boolean>,
  'deposit' : ActorMethod<[string, bigint], boolean>,
  'deposit_collateral' : ActorMethod<[string, bigint], boolean>,
  'get_balance' : ActorMethod<[string], bigint>,
  'get_stable_token' : ActorMethod<[], StableToken>,
  'get_user_account' : ActorMethod<[string], [] | [UserAccount]>,
  'repay' : ActorMethod<[string, bigint], boolean>,
  'set_ai_proxy' : ActorMethod<[Principal], boolean>,
  'signup' : ActorMethod<[string, string], boolean>,
  'withdraw_collateral' : ActorMethod<[string, bigint], boolean>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];

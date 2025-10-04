// app/api/defi/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Actor, HttpAgent, ActorMethod } from '@dfinity/agent';
import { idlFactory } from '../../../../src/ic/defi_pool_backend';
import { Principal } from '@dfinity/principal';

// ------------------- Local TypeScript types -------------------
export interface BorrowRequest { amount: bigint; }

export interface StableToken {
  total_supply: bigint;
  balances: Array<{ key: string; value: bigint }>;
}

export interface UserAccount {
  username?: [string];
  deposited: bigint;
  collateral: bigint;
  borrowed: bigint;
  credit_score: bigint;
  risk_advice?: [string];
}

export type DefiAction =
  | 'get_user_account'
  | 'signup'
  | 'deposit'
  | 'deposit_collateral'
  | 'withdraw_collateral'
  | 'borrow'
  | 'repay'
  | 'get_total_supply';

interface ApiRequestBody {
  action: DefiAction;
  user?: string;
  username?: string;
  amount?: number;
}

// Partial _SERVICE interface for the actor
export interface DefiService {
  signup: ActorMethod<[string, string], boolean>;
  deposit: ActorMethod<[string, bigint], boolean>;
  deposit_collateral: ActorMethod<[string, bigint], boolean>;
  withdraw_collateral: ActorMethod<[string, bigint], boolean>;
  borrow: ActorMethod<[string, BorrowRequest], boolean>;
  repay: ActorMethod<[string, bigint], boolean>;
  get_user_account: ActorMethod<[string], [] | [UserAccount]>;
  get_balance: ActorMethod<[string], bigint>;
  get_stable_token: ActorMethod<[], StableToken>;
}

// -------------------- Canister Setup --------------------
const DEFICANISTER_ID = process.env.NEXT_PUBLIC_DEFI_CANISTER_ID;
if (!DEFICANISTER_ID) throw new Error('Missing DEFICANISTER_ID env variable');

const agent = new HttpAgent({ host: process.env.NEXT_PUBLIC_IC_HOST || 'http://localhost:4943' });
if (process.env.NODE_ENV !== 'production') {
  await agent.fetchRootKey();
}

const defiActor = Actor.createActor<DefiService>(idlFactory, {
  agent,
  canisterId: Principal.fromText(DEFICANISTER_ID),
});

// -------------------- Helper --------------------
function serializeBigInt(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (Array.isArray(obj)) return obj.map(serializeBigInt);
  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, serializeBigInt(v)])
    );
  }
  return obj;
}

// -------------------- API Route --------------------
export async function POST(req: NextRequest) {
  try {
    const body: ApiRequestBody = await req.json();
    const { action, user, username, amount } = body;
    if (!action) return NextResponse.json({ success: false }, { status: 400 });

    let success = false;

    switch (action) {
      case 'get_user_account': {
        if (!user) throw new Error('Missing user');
        const accountOpt = await defiActor.get_user_account(user);
        const account: UserAccount | undefined = accountOpt.length ? accountOpt[0] : undefined;
        return NextResponse.json(serializeBigInt({ success: true, account }));
      }

      case 'signup': {
        if (!user || !username) throw new Error('Missing user or username');
        let actorResult: any;
        try { actorResult = await defiActor.signup(user, username); } 
        catch (err) { 
          console.error('Canister signup error:', err);
          return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
        }

        success = Array.isArray(actorResult) ? Boolean(actorResult[0]) : Boolean(actorResult);
        if (!success) return NextResponse.json({ success: false, reason: 'already_exists' });

        break; // fallthrough to fetch full state below
      }

      case 'deposit':
        if (!user || amount === undefined) throw new Error('Missing user or amount');
        success = await defiActor.deposit(user, BigInt(amount));
        break;
      case 'deposit_collateral':
        if (!user || amount === undefined) throw new Error('Missing user or amount');
        success = await defiActor.deposit_collateral(user, BigInt(amount));
        break;
      case 'withdraw_collateral':
        if (!user || amount === undefined) throw new Error('Missing user or amount');
        success = await defiActor.withdraw_collateral(user, BigInt(amount));
        break;
      case 'borrow':
        if (!user || amount === undefined) throw new Error('Missing user or amount');
        success = await defiActor.borrow(user, { amount: BigInt(amount) });
        break;
      case 'repay':
        if (!user || amount === undefined) throw new Error('Missing user or amount');
        success = await defiActor.repay(user, BigInt(amount));
        break;
      case 'get_total_supply': {
        const stableToken = await defiActor.get_stable_token();
        return NextResponse.json(serializeBigInt({
          success: true,
          totalSupply: stableToken.total_supply,
          balances: stableToken.balances.map(b => ({ user: b.key, balance: b.value })),
        }));
      }
      default:
        return NextResponse.json({ success: false, reason: 'invalid_action' }, { status: 400 });
    }

    // -------------------- Fetch updated state --------------------
    if (user) {
      const accountOpt = await defiActor.get_user_account(user);
      const account: UserAccount | undefined = accountOpt.length ? accountOpt[0] : undefined;
      const advice = account?.risk_advice?.[0] ?? '';
      const usernameVal = account?.username?.[0] ?? '';
      let balance = BigInt(0);
      try { balance = await defiActor.get_balance(user); } catch {}

      let totalSupply = BigInt(0);
      let allBalances: { user: string; balance: bigint }[] = [];
      try {
        const stableToken = await defiActor.get_stable_token();
        totalSupply = stableToken.total_supply ?? BigInt(0);
        allBalances = stableToken.balances.map(b => ({ user: b.key, balance: b.value }));
      } catch {}

      return NextResponse.json(
        serializeBigInt({ success, username: usernameVal, advice, balance, account, totalSupply, balances: allBalances })
      );
    }

    return NextResponse.json({ success });
  } catch (err) {
    console.error('Error in /api/defi:', err);
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

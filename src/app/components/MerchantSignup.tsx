'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from 'context/AuthContext';
import { setTokensInLocalStorage } from '@utils/tokenUtils';

export default function MerchantSignup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { setTokens } = useAuth();
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/signup/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Signup failed');

      const access = data.access || data.token?.access;
      const refresh = data.refresh || data.token?.refresh;
      if (!access || !refresh) throw new Error('Invalid response from server');

      setTokensInLocalStorage(access, refresh);
      setTokens(access, refresh);
      localStorage.setItem('user', JSON.stringify({ username, email }));
      router.push('/merchant_dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Something went wrong');
      } else {
        setError('An unexpected error occurred');
      }
    }
  };

  return (
    <div className="signupSection">
      <h1 className="signupHeading">Sign Up</h1>
      <form onSubmit={handleSignUp} className="signupForm">
        <input
          className="formInput"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          className="formInput"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="formInput"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="signupBtn">Sign Up</button>
        {error && <p className="errorText">{error}</p>}
      </form>
            <p className="signupRedirect">
              <Link className="links" href="/merchant_login">
                Login if you are already a Nia retailer
              </Link>
            </p>
    </div>
  );
}

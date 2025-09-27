'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useAuth } from 'context/AuthContext';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { setTokens } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_DJANGO_API_URL}/token/`, {
        username,
        password,
      });
      const { access, refresh } = res.data;
      setTokens(access, refresh);
      localStorage.setItem('user', JSON.stringify({ username }));
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Invalid credentials. Please try again.');
        console.error('Login failed:', err.message);
      } else {
        setError('An unknown error occurred.');
        console.error('Unknown login error:', err);
      }
    }
  };

  return (
    <div className="loginSection">
      <h1 className="loginHeading">Login</h1>
      <form onSubmit={handleSubmit} className="loginForm">
        <input
          className="formInput"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          className="formInput"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" className="loginBtn">Login</button>
        {error && <p className="errorText">{error}</p>}
      </form>
      <p className="signupRedirect">
        Don&apos;t have an account?{' '}
        <Link className="signupLink" href="/signup">
          Sign up
        </Link>
      </p>
    </div>
  );
}

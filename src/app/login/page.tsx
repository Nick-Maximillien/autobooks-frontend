'use client';

import { useState } from 'react';
import Link from 'next/link';
import LoginPage from 'app/components/Login';

export default function LoginToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLogin = () => setIsOpen(prev => !prev);

  return (
    <div className="loginToggleContainer">
      <h3 className="loginToggle" onClick={toggleLogin}>
        {isOpen ? 'Close Login' : 'Login'}{' '}
        <b className="create">as <strong>a Shopper</strong></b>
      </h3>
      {isOpen && (
        <div className="loginToggleCard">
          <LoginPage />
        </div>
      )}
      <p className="signupRedirect">
        <Link className="links" href="/signup">
                  Sign up if you are not an Agrosight farmer and try our farm AI{' '}
        </Link>
      </p>
      <p className="signupRedirect">
        <Link className="links" href="/">
          Home
        </Link>
      </p>
    </div>
  );
}

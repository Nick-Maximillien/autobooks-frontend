'use client';

import { useState } from 'react';
import Link from 'next/link';
import ShopperLoginPage from 'app/components/ShopperLogin';


export default function ShopperLoginToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLogin = () => setIsOpen(prev => !prev);

  return (
    <div className="loginToggleContainer">
      <h3 className="loginToggle" onClick={toggleLogin}>
        {isOpen ? 'Close Shopper' : 'Shopper'}{' '}
      </h3>
      {isOpen && (
        <div className="loginToggleCard">
          <ShopperLoginPage />
        </div>
      )}
      <p className="signupRedirect">
        <Link className="links" href="/shopper_signup">
                  Sign up if you are not already a Nia shopper and try our shopping AI{' '}
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

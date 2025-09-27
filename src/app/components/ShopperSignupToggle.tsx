'use client';

import { useState } from 'react';
import ShopperSignup from './ShopperSignup';

export default function ShopperSignupToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSignup = () => setIsOpen(prev => !prev);

  return (
    <div className="signupToggleContainer">
      <h3 className="loginToggle" onClick={toggleSignup}>
        {isOpen ? 'Close Signup' : 'Signup'}{' '}
        <b className="create">as a <strong>Shopper</strong></b>
      </h3>
      {isOpen && (
        <div className="signupToggleCard">
          <ShopperSignup />
        </div>
      )}
    </div>
  );
}

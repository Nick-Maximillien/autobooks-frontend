'use client';

import { useState } from 'react';
import ShopperSignupToggle from './ShopperSignupToggle';

export default function SignUpToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSignup = () => setIsOpen(prev => !prev);

  return (
    <div className="signupToggleContainer">
      <h3 className="loginToggle" onClick={toggleSignup}>
        {isOpen ? 'Close Signup' : 'Signup'}{' '}
        <b className="create">and create account</b>
      </h3>
      {isOpen && (
        <div className="signupToggleCard">
          <ShopperSignupToggle />
        </div>
      )}
    </div>
  );
}

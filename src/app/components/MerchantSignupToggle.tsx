'use client';

import { useState } from 'react';
import MerchantSignup from './MerchantSignup';

export default function MerchantSignUpToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSignup = () => setIsOpen(prev => !prev);

  return (
    <div className="signupToggleContainer">
      <h3 className="loginToggle" onClick={toggleSignup}>
        {isOpen ? 'Close Signup' : 'Signup'}{' '}
        <b className="create">as a <strong>Retailer</strong></b>
      </h3>
      {isOpen && (
        <div className="signupToggleCard">
          <MerchantSignup />
        </div>
      )}
    </div>
  );
}

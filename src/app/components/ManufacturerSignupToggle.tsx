'use client';

import { useState } from 'react';
import ManufacturerSignup from './ManufacturerSignup';

export default function ManufacturerSignUpToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSignup = () => setIsOpen(prev => !prev);

  return (
    <div className="signupToggleContainer">
      <h3 className="loginToggle" onClick={toggleSignup}>
        {isOpen ? 'Close Signup' : 'Signup'}{' '}
        <b className="create">as a <strong>Supplier</strong></b>
      </h3>
      {isOpen && (
        <div className="signupToggleCard">
          <ManufacturerSignup />
        </div>
      )}
    </div>
  );
}

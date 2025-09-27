'use client';

import { useState } from 'react';
import ShopperLoginPage from './ShopperLogin';

export default function LoginToggle() {
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
    </div>
  );
}

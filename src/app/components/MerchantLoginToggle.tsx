'use client';

import { useState } from 'react';
import MerchantLoginPage from './MerchantLogin';

export default function MerchantLoginToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLogin = () => setIsOpen(prev => !prev);

  return (
    <div className="loginToggleContainer">
      <h3 className="loginToggle" onClick={toggleLogin}>
        {isOpen ? 'Close Retailer' : 'Retailer'}{' '}
      </h3>
      {isOpen && (
        <div className="loginToggleCard">
          <MerchantLoginPage />
        </div>
      )}
    </div>
  );
}

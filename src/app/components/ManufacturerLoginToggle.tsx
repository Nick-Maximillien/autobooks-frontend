'use client';

import { useState } from 'react';
import ManufacturerLoginPage from './ManufacturerLogin';

export default function ManufacturerLoginToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLogin = () => setIsOpen(prev => !prev);

  return (
    <div className="loginToggleContainer">
      <h3 className="loginToggle" onClick={toggleLogin}>
        {isOpen ? 'Close Supplier' : 'Supplier'}{' '}
      </h3>
      {isOpen && (
        <div className="loginToggleCard">
          <ManufacturerLoginPage />
        </div>
      )}
    </div>
  );
}

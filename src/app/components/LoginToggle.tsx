'use client';

import { useState } from 'react';
import Login from './Login';

export default function LoginToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLogin = () => setIsOpen(prev => !prev);

  return (
    <div className="loginToggleContainer">
      <h3 className="loginToggle" onClick={toggleLogin}>
        {isOpen ? 'Close Login' : 'Login'}{' '}
        <b className="create">to <strong>Agrosight AI</strong></b>
      </h3>
      {isOpen && (
        <div className="loginToggleCard">
          <Login />
        </div>
      )}
    </div>
  );
}

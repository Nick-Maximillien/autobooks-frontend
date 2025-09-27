'use client';

import { useState } from 'react';
import SignUp from 'app/components/Signup';
import Link from 'next/link';

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
          <SignUp />
        </div>
      )}
      <p className="signupRedirect">
        <Link className="links" href="/">
          Home
        </Link>
      </p>
</div>
  );
}

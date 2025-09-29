'use client';

import { useState } from 'react';
import DiagnoseOnWhatsapp from './DiagnoseOnWhatsapp';
import Image from 'next/image';

export default function OnWhatsappToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSignup = () => setIsOpen(prev => !prev);

  return (
    <div className="signupToggleContainer">
      <h3 className="loginToggle" onClick={toggleSignup}>
        {isOpen ? 'Close AutoBooks AI' : 'Use AutoBooks AI'}{' '}
        <b className="create">on Whatsapp
        <figure className="whatsapp">
          <Image
            className="dropbtn whatsapplogo"
            src="/images/whatsapp.png"
            alt="Menu"
            width={30}
            height={30}
          />
        </figure>
        </b>
      </h3>
      {isOpen && (
        <div className="signupToggleCard">
          <DiagnoseOnWhatsapp />
        </div>
      )}
    </div>
  );
}

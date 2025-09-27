'use client';

import { useState } from 'react';
import Chat from './Chat';
import Image from 'next/image';

export default function ChatToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleLogin = () => setIsOpen(prev => !prev);

  return (
    <div className='chatToggle'>
    <div className="loginToggleContainer chatToggle">
    <figure className="chatIcon">
        <Image
        className="chatIcon"
        src="/images/bot.png"
        alt="Menu"
        width={70}
        height={70}
        />
    </figure>
      <h3 className="loginToggle" onClick={toggleLogin}>
        {isOpen ? 'Close Chat' : 'Chat'}{' '}
        <b className="create"> with<strong> Analyst</strong></b>
      </h3>
      {isOpen && (
        <div className="loginToggleCard">
          <Chat />
        </div>
      )}
    </div>
    </div>
  );
}

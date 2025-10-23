'use client';

import { useState } from 'react';
import DiagnoseOnWhatsapp from './DiagnoseOnWhatsapp';
import Image from 'next/image';

export default function OnWhatsappToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => setIsOpen(prev => !prev);

  return (
    <div className="whatsapp-toggle-container">
      <h3 className="whatsapp-toggle-button" onClick={togglePanel}>
        {isOpen ? 'Close AutoBooks AI' : 'Use AutoBooks AI'}{' '}
        <b className="whatsapp-toggle-subtitle">
          on WhatsApp
          <figure className="whatsapp-icon">
            <Image
              src="/images/whatsapp.png"
              alt="WhatsApp Logo"
              width={28}
              height={28}
              className="whatsapp-logo"
            />
          </figure>
        </b>
      </h3>

      {isOpen && (
        <div className="whatsapp-toggle-card">
          <DiagnoseOnWhatsapp />
        </div>
      )}

      <style jsx>{`
        .whatsapp-toggle-container {
          margin: 1.5rem auto;
          width: 100%;
          max-width: 600px;
          border-radius: 16px;
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
          background: #ffffff;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .whatsapp-toggle-button {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
          padding: 1rem 1.2rem;
          background: linear-gradient(90deg, #25d366, #128c7e);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: none;
          transition: background 0.3s ease;
        }

        .whatsapp-toggle-button:hover {
          background: linear-gradient(90deg, #20b857, #0d725f);
        }

        .whatsapp-toggle-subtitle {
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .whatsapp-icon {
          margin: 0;
          display: flex;
          align-items: center;
        }

        .whatsapp-logo {
          border-radius: 50%;
          background: white;
          padding: 3px;
        }

        .whatsapp-toggle-card {
          padding: 1.5rem;
          background: #f7fdf9;
          border-top: 1px solid #d3f0e1;
          animation: slideDown 0.4s ease forwards;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Chat from './Chat';
import Image from 'next/image';

export default function ChatToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen(prev => !prev);

  return (
    <>
      <div className="chat-toggle-container">
        {!isOpen && (
          <button className="chat-toggle-button" onClick={toggleChat}>
            <Image
              src="/images/bot.png"
              alt="Chat Icon"
              width={40}
              height={40}
              className="chat-icon"
            />
          </button>
        )}

        {isOpen && (
          <div className="chat-box">
            <div className="chat-header">
              <div className="chat-header-left">
                <Image
                  src="/images/bot.png"
                  alt="Bot"
                  width={30}
                  height={30}
                  className="chat-header-icon"
                />
                <span className="chat-header-title">Analyst Bot</span>
              </div>
              <button className="chat-close-btn" onClick={toggleChat}>
                ✕
              </button>
            </div>
            <div className="chat-body">
              <Chat />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .chat-toggle-container {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        /* Floating button */
        .chat-toggle-button {
          background: linear-gradient(135deg, #8a2be2, #00d4ff);
          border: none;
          border-radius: 50%;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .chat-toggle-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
        }

        .chat-icon {
          border-radius: 50%;
        }

        /* Chat box container */
        .chat-box {
          position: fixed;
          top: 90px;
          right: 20px;
          width: 320px;
          height: 450px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: fadeInUp 0.3s ease;
        }

        /* Header */
        .chat-header {
          background: linear-gradient(135deg, #8a2be2, #00d4ff);
          color: #fff;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .chat-header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-header-icon {
          border-radius: 50%;
        }

        .chat-header-title {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .chat-close-btn {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
        }

        /* Chat body */
        .chat-body {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          background: #f8f9fa;
        }

        /* Animations */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Responsive */
        @media (max-width: 480px) {
          .chat-box {
            width: 90%;
            right: 5%;
            height: 70vh;
          }
        }
      `}</style>
    </>
  );
}

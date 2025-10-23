'use client';

import { useState } from 'react';
import Chat from './Chat';
import Image from 'next/image';

export default function ChatToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button className="chat-fab" onClick={toggleChat}>
          <Image
            src="/images/bot.png"
            alt="Chat"
            width={28}
            height={28}
            className="chat-fab-icon"
          />
          <p className="chatz">Chat</p>
        </button>
      )}

      {/* Chat Box */}
      {isOpen && (
        <div className="chat-wrapper">
          <div className="chat-header">
            <div className="chat-header-info">
              <Image
                src="/images/bot.png"
                alt="Bot"
                width={28}
                height={28}
                className="chat-avatar"
              />
              <span>Analyst Bot</span>
            </div>
            <button className="chat-close" onClick={toggleChat}>
              ✕
            </button>
          </div>
          <div className="chat-body">
            <Chat />
          </div>
        </div>
      )}

      <style jsx>{`
        /* Floating Button */
        .chat-fab {
          position: fixed;
          top: 60px;
          right: 60px;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #8a2be2, #00d4ff);
          border: none;
          border-radius: 50%;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          z-index: 1000;
        }

        .chat-fab:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
        }

        .chat-fab-icon {
          border-radius: 50%;
        }
        .chatz {
        font-size: blod;
        padding-right: 5px;
        }

        /* Chat Wrapper */
        .chat-wrapper {
          position: fixed;
          top: 100px;
          right: 24px;
          width: 360px;
          height: 500px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: slideUp 0.3s ease;
          z-index: 1000;
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

        .chat-header-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .chat-avatar {
          border-radius: 50%;
        }

        .chat-close {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }

        .chat-close:hover {
          opacity: 0.8;
        }

        /* Body */
        .chat-body {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #f9fafc;
        }

        /* Animation */
        @keyframes slideUp {
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
          .chat-wrapper {
            width: 90%;
            right: 5%;
            height: 70vh;
            bottom: 90px;
          }

          .chat-fab {
            width: 55px;
            height: 55px;
          }
        }
      `}</style>
    </>
  );
}

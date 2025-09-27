"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const DiagnoseOnWhatsapp = () => {
  const [hasJoined, setHasJoined] = useState(false);

  const whatsappNumber = process.env.NEXT_PUBLIC_TWILIO_WHATSAPP_NUMBER || "";
  const strippedNumber = whatsappNumber.replace("whatsapp:+", "");

  const joinPhrase = "join reach-bread";
  const joinMessage = encodeURIComponent(joinPhrase);
  const diagnosisMessage = encodeURIComponent("Hello Agrosight, I want to diagnose my crop.");

  const joinLink = `https://api.whatsapp.com/send?phone=${strippedNumber}&text=${joinMessage}`;
  const diagnosisLink = `https://api.whatsapp.com/send?phone=${strippedNumber}&text=${diagnosisMessage}`;

  // fallback if joinedAt is more than 72 hours ago
  const getDiagnosisLink = () => {
    const joined = localStorage.getItem("agrosight_whatsapp_joined") === "true";
    const joinedAt = parseInt(localStorage.getItem("agrosight_joined_at") || "0", 10);
    const now = Date.now();
    const seventyTwoHours = 72 * 60 * 60 * 1000;

    if (joined && now - joinedAt <= seventyTwoHours) {
      return diagnosisLink;
    } else {
      return joinLink;
    }
  };

  useEffect(() => {
    const joined = localStorage.getItem("agrosight_whatsapp_joined") === "true";
    const joinedAt = parseInt(localStorage.getItem("agrosight_joined_at") || "0", 10);
    const now = Date.now();
    const seventyTwoHours = 72 * 60 * 60 * 1000;

    if (joined && now - joinedAt <= seventyTwoHours) {
      setHasJoined(true);
    } else {
      // Expired or never joined
      setHasJoined(false);
      localStorage.removeItem("agrosight_whatsapp_joined");
      localStorage.removeItem("agrosight_joined_at");
    }
  }, []);

  const markAsJoined = () => {
    setHasJoined(true);
    localStorage.setItem("agrosight_whatsapp_joined", "true");
    localStorage.setItem("agrosight_joined_at", Date.now().toString());
  };

  return (
    <div className="aboutContainer webContainer">
      <div className="dashboardGrid container whatsapp-card">
        <h2 className="whatsapp-heading">Diagnose via WhatsApp</h2>

        {!hasJoined ? (
          <div className="whatsapp-join">
            <p className="whatsapp-description">
              To start using Agrosight AI on WhatsApp, tap below to send this code:
            </p>

            <pre className="whatsapp-code">{joinPhrase}</pre>

            <a
              href={joinLink}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              Use WhatsApp
              <figure className="whatsapp">
                <Image
                  className="dropbtn whatsapplogo"
                  src="/images/whatsapp.png"
                  alt="Menu"
                  width={30}
                  height={30}
                />
              </figure>
            </a>

            <p className="whatsapp-note">
              After joining, send a photo of a sick plant or pest and we will help you understand the problem.
            </p>

            <button onClick={markAsJoined} className="whatsapp-already-joined">
              I’ve already joined
            </button>
          </div>
        ) : (
          <div className="whatsapp-diagnose">
            <p className="whatsapp-description">Ready to diagnose your crop?</p>
            <a
              href={getDiagnosisLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="whatsapp-button"
            >
              Diagnose on WhatsApp        
              <figure className="whatsapp">
                    <Image
                      className="dropbtn whatsapplogo"
                      src="/images/whatsapp.png"
                      alt="Menu"
                      width={30}
                      height={30}
                    />
              </figure>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnoseOnWhatsapp;

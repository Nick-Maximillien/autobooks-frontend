"use client";

import { useState } from "react";
import CreateProfile from "./CreateProfile";

export default function CreateProfileToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="loginbtn">
      {!isOpen ? (
        <h3
          onClick={() => setIsOpen(true)}
          style={{ cursor: "pointer", color: "#007bff" }}
        >
          ➕ Create Your Business Profile
        </h3>
      ) : (
        <>
          <h3
            onClick={() => setIsOpen(false)}
            style={{ cursor: "pointer", color: "crimson" }}
          >
            ❌ Cancel Profile Creation
          </h3>
          <CreateProfile />
        </>
      )}
    </div>
  );
}

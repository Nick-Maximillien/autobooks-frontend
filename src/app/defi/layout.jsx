"use client";

import { AuthProvider } from "../../context/DefiContext";

export default function DefiLayout({ children }) {
  return (
    <AuthProvider>
      <div className="container">{children}</div>
    </AuthProvider>
  );
}

"use client";

import React, { useState } from "react";
import { getTokensFromLocalStorage } from "@utils/tokenUtils";

export default function Uploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [ocrText, setOcrText] = useState<string | null>(null);
  // 👇 give invoiceData a safer type
  const [invoiceData, setInvoiceData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const { accessToken, refreshToken } = getTokensFromLocalStorage();
  const userRaw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
  let profileName: string | null = null;
  let email: string | null = null;
  let user_id: string | null = null;

  if (userRaw) {
    try {
      const user = JSON.parse(userRaw);
      profileName = user?.username || null;
      email = user?.email || null;
      user_id = user?.user_id || null;
    } catch (err) {
      console.error("Failed to parse localStorage.user:", err);
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    setLoading(true);
    setError(null);
    setOcrText(null);
    setInvoiceData(null);

    try {
      const formData = new FormData();
      formData.append("receipt", file);
      if (profileName) formData.append("profile_name", profileName);
      if (email) formData.append("email", email);
      if (user_id) formData.append("user_id", user_id);

      console.log(" Uploading to backend with file:", file.name);
      const apiBase = process.env.NEXT_PUBLIC_FASTAPI_API_URL || "http://localhost:8001";
      const res = await fetch(`${apiBase}/upload`, {
        method: "POST",
        body: formData,
        headers: {
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...(refreshToken && { "X-Refresh-Token": refreshToken }),
        },
      });

      console.log("Response status:", res.status, res.statusText);

      const rawText = await res.text(); // read as text first
      console.log(" Raw response body:", rawText);

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText} → ${rawText}`);
      }

      const data = JSON.parse(rawText); // try to parse
      setOcrText(data.ocr_text);
      setInvoiceData(data.invoice_data);
    } catch (err: unknown) {
      // 👇 replace `any` with `unknown` and then narrow
      if (err instanceof Error) {
        console.error(" Upload error details:", err);
        setError(err.message);
      } else {
        console.error(" Unknown upload error:", err);
        setError("Something went wrong (check console logs)");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-bold mb-4">📤 Upload Business Document</h1>

      <input
        type="file"
        accept="image/*,application/pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p className="mt-4 text-red-500">❌ {error}</p>}

      {ocrText && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <h2 className="font-semibold mb-2">📝 OCR Extracted Text</h2>
          <pre className="text-sm whitespace-pre-wrap">{ocrText}</pre>
        </div>
      )}

      {invoiceData && (
        <div className="mt-6 bg-gray-100 p-4 rounded">
          <h2 className="font-semibold mb-2">✅ Parsed Invoice Data</h2>
          <pre className="text-sm">{JSON.stringify(invoiceData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

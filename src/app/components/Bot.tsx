"use client";

import { useState } from "react";

export default function Chat() {
  const [query, setQuery] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState<string | null>(null);
  const [ocr_results, setOcrResults] = useState<any[] | null>(null);
  const [detections, setDetections] = useState<any | null>(null);

  // Candidate backend URLs
  const backendUrls = [
    "http://localhost:8001/shopper/",
    "http://127.0.0.1:8001/shopper/",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    const formData = new FormData();
    formData.append("query", query);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    setReply(null);
    setOcrResults(null);
    setDetections(null);

    let success = false;

    for (const url of backendUrls) {
      try {
        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data = await res.json();

        setReply(data.reply);
        setOcrResults(data.ocr_results);
        setDetections(data.detections);
        success = true;
        break; // stop after first success
      } catch (err) {
        console.warn(`Failed to reach backend at ${url}`, err);
      }
    }

    if (!success) {
      setReply("Error: Could not reach AI backend (both localhost & 127.0.0.1 failed).");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>🛒 Shopper AI</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          placeholder="Enter your query (e.g. find 'milk')"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "0.5rem" }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          style={{ marginBottom: "0.5rem" }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            padding: "0.5rem 1rem",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Analyzing..." : "Send"}
        </button>
      </form>

      {reply && (
        <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "1rem", marginTop: "1rem" }}>
          <p><strong>AI Reply:</strong></p>
          <p>{reply}</p>
        </div>
      )}

      {ocr_results && (
        <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "1rem", marginTop: "1rem" }}>
          <p><strong>OCR Results:</strong></p>
          <pre style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(ocr_results, null, 2)}
          </pre>
        </div>
      )}

      {detections && (
        <div style={{ border: "1px solid #ddd", borderRadius: "6px", padding: "1rem", marginTop: "1rem" }}>
          <p><strong>Detections:</strong></p>
          <pre style={{ fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(detections, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

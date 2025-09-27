"use client"

import React, { useState, useRef, useEffect } from "react";
import { getTokensFromLocalStorage } from "@utils/tokenUtils";

type ChatMessage = { role: "user" | "copilot"; text: string };

export default function Chat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { accessToken, refreshToken } = getTokensFromLocalStorage();

  // Load chat from local storage on first render
  useEffect(() => {
    const stored = localStorage.getItem("autobooks_chat_log");
    if (stored) {
      try {
        setChatLog(JSON.parse(stored));
      } catch {
        console.warn("Failed to parse stored chat log");
      }
    }
  }, []);

  // Persist chat whenever it changes
  useEffect(() => {
    localStorage.setItem("autobooks_chat_log", JSON.stringify(chatLog));
  }, [chatLog]);


  const handleSend = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      // Immediately add user message to UI
      const userMessage: ChatMessage = { role: "user", text: message };
      setChatLog((prev) => [...prev, userMessage]);

      const res = await fetch("http://localhost:8001/copilot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          ...(refreshToken && { "X-Refresh-Token": refreshToken }),
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        role: "copilot",
        text: data.reply || "Assistant did not respond",
      };
      setChatLog((prev) => [...prev, botMessage]);
      setMessage("");
    } catch (err) {
      console.error("Chat error:", err);
      setChatLog((prev) => [
        ...prev,
        { role: "copilot", text: "Could not contact Assistant" }
      ]);
    } finally {
      setLoading(false)
    }
  };

  // Autoscroll when messages or loading state change
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatLog, loading]);

  return (
    <div 
    className="chatContainer" style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                maxWidth: "600px",
                color: "white",
                padding: "1rem",
                borderRadius: "10px",
                background: "silver"}}>
      <h1 style={{ color: "black", padding: "10px", borderRadius: "10px"}}>Business Assistant</h1>

      {/* Chat container */}
      <div className="chatHistory" style={{
                maxHeight: "600px",
                overflow: "auto",
                padding: "10px",
                borderRadius: "10px",
                background: "#f9f9f9",
                color: "black",
                display: "flex",
                flexDirection: "column",
                gap: "8px",}}>
        {chatLog.map((line, i) => (
          <div
          key={i}
          style={{display: "flex", justifyContent: line.role === "user" ? "flex-end" : "flex-start",}}
          >
            <div
            style={{
                            background: line.role === "user" ? "#4f9cf7" : "#e5e5ea",
                            color: line.role === "user" ? "white" : "black",
                            padding: "10px 14px",
                            borderRadius: "20px",
                            maxWidth: "70%",
                            wordBreak: "break-word",
                            boxShadow: "0px 2px 4px rgba(0,0,0,0.2)",
                            borderTopLeftRadius: line.role === "copilot" ? "0px" : "20px",
                            borderTopRightRadius: line.role === "user" ? "0px" : "20px",
                            textAlign: "left",
                        }}
            >
              {line.text}
             </div>
            </div> 
        ))}

        {/* Typing indicator bubble */}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-600 text-sm rounded-bl-none shadow">
              <span className="inline-flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.15s]">.</span>
                <span className="animate-bounce [animation-delay:0.3s]">.</span>
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      {/* Input Section */}
      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask your Assistant..."
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          style={{ padding: "10px", borderRadius: "10px", border: "1px solid #ccc", width: "70%" }}
        />
        <button
        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow disabled:bg-dray-400"
        onClick={handleSend}
        disabled={loading}
        style={{ padding: "10px", borderRadius: "10px", border: "none", background: "#4f9cf7", color: "white", cursor: loading ? "not-allowed" : "pointer" }}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
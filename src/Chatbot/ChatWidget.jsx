import React, { useState, useRef, useEffect } from "react";
import "./ChatWidget.css";

// Generates a simple session id so chat history can be grouped/reloaded.
// In production you could use uuid package instead.
function getSessionId() {
  let id = localStorage.getItem("chat_session_id");
  if (!id) {
    id = "session_" + Date.now() + "_" + Math.random().toString(36).slice(2);
    localStorage.setItem("chat_session_id", id);
  }
  return id;
}

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api$/, "");

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hi! 👋 I'm your Tailor Assistant. Ask me about bookings, measurements, delivery, or payments." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const sessionId = useRef(getSessionId());
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessages = [...messages, { role: "user", text: trimmed }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/chatbot/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          message: trimmed,
          sessionId: sessionId.current,
          history: newMessages.slice(-8), // last few messages for context
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Connection error. Please check your internet and try again." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window">
          <div className="chat-header">
            <span>🧵 Tailor Assistant</span>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              ✕
            </button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble bot-bubble typing-indicator">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
            />
            <button onClick={sendMessage} disabled={!input.trim()}>
              Send
            </button>
          </div>
        </div>
      )}

      <div className="chat-toggle-row">
        {!isOpen && (
          <div className="chat-toggle-label" onClick={() => setIsOpen(true)}>
            Need help? Chat with us!
          </div>
        )}

        <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "💬"}
        </button>
      </div>
    </div>
  );
}

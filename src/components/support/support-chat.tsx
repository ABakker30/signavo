"use client";

import { useState } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function SupportChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Signavo assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setSending(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, something went wrong. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mt-6 sm:mt-8 rounded-xl border border-gray-200 bg-white">
      <div className="h-[60vh] sm:h-80 overflow-y-auto p-4 sm:p-6 space-y-3 sm:space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm ${
              msg.role === "assistant"
                ? "bg-gray-50 text-gray-600"
                : "bg-gray-900 text-white ml-4 sm:ml-8"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {sending && (
          <div className="rounded-lg bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-400">
            Thinking...
          </div>
        )}
      </div>
      <div className="border-t border-gray-200 p-3 sm:p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question..."
          className="flex-1 min-w-0 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={sending || !input.trim()}
          className="shrink-0 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

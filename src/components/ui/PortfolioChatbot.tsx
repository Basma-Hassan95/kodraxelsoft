"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X, Loader2, Shield } from "lucide-react";

type Turn = { role: "user" | "assistant"; content: string };

const WELCOME =
  "Hello! How can I help you today? What information would you like about the Kodraxelsoft website?";

export function PortfolioChatbot() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Turn[]>([
    { role: "assistant", content: WELCOME },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages, loading]);

  if (pathname?.startsWith("/admin")) return null;

  async function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text || loading) return;
    if (text.length > 500) {
      setError("Message too long (max 500 characters).");
      return;
    }

    setError(null);
    setInput("");

    const nextHistory = [...messages, { role: "user" as const, content: text }];
    setMessages(nextHistory);
    setLoading(true);

    try {
      const history = nextHistory
        .filter((m) => m.content !== WELCOME)
        .slice(0, -1)
        .slice(-8);

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      const data = (await res.json()) as {
        success?: boolean;
        reply?: string;
        message?: string;
      };

      if (!res.ok || !data.success || !data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              data.message ||
              "Sorry — chat is unavailable right now. Please use Contact.",
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply as string },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error. Please try again or use the Contact page.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void sendMessage(input);
    }
  }

  return (
    <div className="fixed bottom-[5.75rem] right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div
          className="w-[min(100vw-2rem,22rem)] h-[28rem] max-h-[min(70vh,28rem)] flex flex-col rounded-2xl border border-[#1C9994]/35 bg-slate-950/95 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl overflow-hidden"
          role="dialog"
          aria-label="Kodraxelsoft portfolio chatbot"
        >
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10 bg-[#226263]">
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-wide truncate">
                Kodraxelsoft Assistant
              </p>
              <p className="text-[11px] text-white/80 flex items-center gap-1">
                <Shield className="w-3 h-3" aria-hidden />
                Website support · secure
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={`${m.role}-${i}`}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-[#1C9994] text-white rounded-br-md"
                      : "bg-white/8 border border-white/10 text-slate-100 rounded-bl-md"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Thinking…
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-white/10 p-3 space-y-2">
            {error && (
              <p className="text-[11px] text-rose-300" role="alert">
                {error}
              </p>
            )}
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                rows={2}
                maxLength={500}
                placeholder="Type your message…"
                className="flex-1 resize-none rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#1C9994]/60 placeholder:text-slate-500"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => void sendMessage(input)}
                disabled={loading || !input.trim()}
                className="shrink-0 h-10 w-10 rounded-xl bg-[#226263] hover:bg-[#1C9994] disabled:opacity-40 disabled:hover:bg-[#226263] flex items-center justify-center transition-colors"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#226263] hover:bg-[#1C9994] text-white shadow-2xl shadow-[#1C9994]/30 hover:scale-110 active:scale-95 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1C9994]"
        aria-label={open ? "Close portfolio chat" : "Open portfolio chat"}
        aria-expanded={open}
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}

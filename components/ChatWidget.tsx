"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Bot, AlertCircle } from "lucide-react";
import profile from "@/data/profile.json";
import { useChatWidget } from "@/components/ChatWidgetContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

const QUICK_CHIPS = [
  "Skill utama?",
  "Project terakhir?",
  "Pengalaman kerja?",
];

function createId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatWidget() {
  const { open, setOpen } = useChatWidget();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: Message = { id: createId(), role: "user", content: trimmed };
    const historyForApi = [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const assistantId = createId();
    setMessages((prev) => [
      ...prev,
      userMessage,
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setInput("");
    setIsStreaming(true);

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      if (!res.ok) {
        let errorText = "Maaf, chatbot sedang mengalami gangguan. Coba lagi sebentar ya.";
        try {
          const data = await res.json();
          if (data?.error) errorText = data.error;
        } catch {
          // biarkan pesan default kalau body bukan JSON
        }
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: errorText, isError: true } : m
          )
        );
        return;
      }

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunkText = decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunkText } : m
          )
        );
      }
    } catch (error) {
      console.error("[ChatWidget] fetch error:", error);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Maaf, koneksi ke chatbot terputus. Cek koneksi internet kamu, atau hubungi saya langsung lewat email di halaman Contact.",
                isError: true,
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="glass flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl shadow-2xl shadow-black/40">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border bg-dark-surface/80 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-teal-primary/15">
                <Bot className="size-4 text-teal-primary" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-text-primary">Vanessa</span>
                <span className="text-[11px] text-text-muted">AI Assistant</span>
              </div>
            </div>
            <button
              aria-label="Tutup chat"
              onClick={() => setOpen(false)}
              className="text-text-muted transition-colors hover:text-text-primary"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="flex flex-col gap-3">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-dark-surface px-3 py-2 text-sm text-text-primary">
                  Halo! Saya Vanessa 👋 Tanyakan skill, pengalaman, atau project {profile.name.split(" ")[0]} yuk.
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => sendMessage(chip)}
                      className="rounded-full border border-teal-primary/50 px-3 py-1 text-xs text-teal-primary transition-colors hover:bg-teal-primary/10"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto rounded-tr-sm bg-teal-primary text-dark-base"
                    : m.isError
                    ? "rounded-tl-sm border border-red-500/40 bg-red-500/10 text-red-300"
                    : "rounded-tl-sm bg-dark-surface text-text-primary"
                }`}
              >
                {m.isError && (
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium">
                    <AlertCircle className="size-3.5" /> Error
                  </div>
                )}
                {m.content || (
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-text-muted" />
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-border bg-dark-surface/80 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pertanyaan..."
              disabled={isStreaming}
              className="flex-1 rounded-full border border-border bg-dark-base px-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-teal-primary focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isStreaming || !input.trim()}
              aria-label="Kirim"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-primary text-dark-base transition-transform hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Tutup chat dengan Vanessa" : "Buka chat dengan Vanessa"}
        className="glow-teal relative flex size-14 items-center justify-center rounded-full bg-teal-primary text-dark-base transition-transform hover:scale-105"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-teal-primary/60" />
        )}
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>
    </div>
  );
}

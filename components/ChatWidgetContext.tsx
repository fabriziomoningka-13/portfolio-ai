"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";

interface ChatWidgetContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ChatWidgetContext = createContext<ChatWidgetContextValue | null>(null);

export function ChatWidgetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <ChatWidgetContext.Provider value={{ open, setOpen }}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </ChatWidgetContext.Provider>
  );
}

export function useChatWidget() {
  const ctx = useContext(ChatWidgetContext);
  if (!ctx) {
    throw new Error("useChatWidget harus dipakai di dalam <ChatWidgetProvider>");
  }
  return ctx;
}

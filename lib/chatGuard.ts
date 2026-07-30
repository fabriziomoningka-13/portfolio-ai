import { NextRequest } from "next/server";
import type { ChatMessage } from "@/lib/chatProvider";

// ---------------------------------------------------------------------------
// Guardrail teknis bersama (sesuai Bagian 1.3 & 4.2 dokumen roadmap):
// - Rate limit per IP (in-memory, cukup untuk skala portfolio single-instance)
// - Batasi jumlah pesan riwayat & panjang tiap pesan yang dikirim ke API
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit
const RATE_LIMIT_MAX_REQUESTS = 20; // maksimal 20 pesan / 10 menit / IP
const requestLog = new Map<string, number[]>();

export function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX_REQUESTS;
}

const MAX_HISTORY_MESSAGES = 10; // hanya kirim 10 pesan terakhir (kontrol biaya token)
const MAX_MESSAGE_LENGTH = 1000; // karakter maksimal per pesan user

/** Ambil & bersihkan array `messages` dari body request. Return [] kalau tidak valid. */
export function extractMessages(body: unknown): ChatMessage[] {
  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages)) return [];

  return (rawMessages as ChatMessage[])
    .slice(-MAX_HISTORY_MESSAGES)
    .map(
      (m): ChatMessage => ({
        role: m?.role === "assistant" ? "assistant" : "user",
        content: String(m?.content ?? "").slice(0, MAX_MESSAGE_LENGTH),
      })
    )
    .filter((m) => m.content.trim().length > 0);
}

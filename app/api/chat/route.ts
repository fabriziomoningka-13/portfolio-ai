import { NextRequest, NextResponse } from "next/server";
import { anthropic, CHAT_MODEL } from "@/lib/claudeClient";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";

// Route ini butuh akses filesystem (baca system-prompt.md) & env var server,
// jadi jalankan di Node.js runtime, bukan Edge runtime.
export const runtime = "nodejs";

// ---------------------------------------------------------------------------
// Guardrail teknis (sesuai Bagian 1.3 & 4.2 dokumen roadmap):
// - Rate limit per IP (in-memory, cukup untuk skala portfolio single-instance)
// - Batasi jumlah pesan riwayat & panjang tiap pesan yang dikirim ke API
// - Fallback response kalau API key belum di-set / Claude API error
// ---------------------------------------------------------------------------

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit
const RATE_LIMIT_MAX_REQUESTS = 20; // maksimal 20 pesan / 10 menit / IP
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
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

interface IncomingMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "Kamu sudah mengirim cukup banyak pesan. Coba lagi dalam beberapa menit ya 🙏",
      },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error:
          "Chatbot sedang belum aktif (API key belum dikonfigurasi). Silakan hubungi saya langsung lewat email di halaman Contact.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Format request tidak valid." },
      { status: 400 }
    );
  }

  const rawMessages = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return NextResponse.json(
      { error: "Pesan tidak boleh kosong." },
      { status: 400 }
    );
  }

  const messages: IncomingMessage[] = (rawMessages as IncomingMessage[])
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m): IncomingMessage => ({
      role: m?.role === "assistant" ? "assistant" : "user",
      content: String(m?.content ?? "").slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((m) => m.content.trim().length > 0);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: "Pesan tidak boleh kosong." },
      { status: 400 }
    );
  }

  try {
    const system = buildSystemPrompt();

    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 512,
      system,
      messages,
    });

    const textBlock = response.content.find((block) => block.type === "text");

    const answer =
      (textBlock && "text" in textBlock ? textBlock.text.trim() : "") ||
      "Maaf, saya belum bisa menjawab pertanyaan itu sekarang. Coba tanya lagi dengan cara lain, ya.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[api/chat] Claude API error:", error);
    return NextResponse.json(
      {
        error:
          "Maaf, chatbot sedang mengalami gangguan koneksi ke AI. Coba lagi sebentar, atau hubungi saya langsung lewat email di halaman Contact.",
      },
      { status: 502 }
    );
  }
}

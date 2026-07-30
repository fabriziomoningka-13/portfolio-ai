import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Provider chatbot aktif. Diatur lewat env var CHAT_PROVIDER:
 * - "groq"      -> Groq API (GRATIS, model open-source Llama 3.3 70B). Dipakai
 *                  sementara untuk testing selama Claude API belum ada credit.
 * - "anthropic" -> Claude API (default final, sesuai tech stack di dokumen).
 *
 * PENTING: sebelum deploy final / demo ke recruiter, pastikan CHAT_PROVIDER
 * di .env.local (dan di Vercel Environment Variables) di-set ke "anthropic",
 * supaya klaim "menggunakan Claude API" di CV tetap akurat.
 */
const PROVIDER = (process.env.CHAT_PROVIDER || "anthropic").toLowerCase();

// --- Anthropic (Claude API) ---
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

// --- Groq (OpenAI-compatible, gratis) ---
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "not-configured",
  baseURL: "https://api.groq.com/openai/v1",
});
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/** Cek apakah provider yang sedang aktif sudah punya API key terisi. */
export function isProviderConfigured(): boolean {
  if (PROVIDER === "groq") return Boolean(process.env.GROQ_API_KEY);
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getActiveProviderName(): string {
  return PROVIDER;
}

/**
 * Kirim system prompt + riwayat pesan ke provider yang sedang aktif,
 * kembalikan jawaban dalam bentuk teks biasa.
 */
export async function generateChatReply(
  system: string,
  messages: ChatMessage[]
): Promise<string> {
  if (PROVIDER === "groq") {
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 512,
      messages: [{ role: "system", content: system }, ...messages],
    });
    return completion.choices[0]?.message?.content?.trim() || "";
  }

  // Default: Anthropic (Claude API)
  const response = await anthropic.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 512,
    system,
    messages,
  });
  const textBlock = response.content.find((b) => b.type === "text");
  return (textBlock && "text" in textBlock ? textBlock.text.trim() : "") || "";
}

/**
 * Versi streaming: menghasilkan jawaban secara bertahap (potongan teks demi
 * potongan) supaya UI bisa menampilkan efek "typing" real-time, bukan
 * menunggu jawaban lengkap dulu baru muncul.
 */
export async function* streamChatReply(
  system: string,
  messages: ChatMessage[]
): AsyncGenerator<string> {
  if (PROVIDER === "groq") {
    const stream = await groq.chat.completions.create({
      model: GROQ_MODEL,
      max_tokens: 512,
      messages: [{ role: "system", content: system }, ...messages],
      stream: true,
    });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
    return;
  }

  // Default: Anthropic (Claude API)
  const stream = anthropic.messages.stream({
    model: ANTHROPIC_MODEL,
    max_tokens: 512,
    system,
    messages,
  });
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield event.delta.text;
    }
  }
}

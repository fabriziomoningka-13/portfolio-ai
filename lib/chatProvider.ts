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
// Rotasi 3 akun: kalau key yang aktif kena rate limit/credit habis, otomatis
// pindah ke key berikutnya (1 -> 2 -> 3 -> 1 -> ...). Index "key terakhir yang
// berhasil" disimpan di memory supaya request berikutnya mulai dari situ,
// bukan selalu mulai dari key 1.
const GROQ_KEYS = [
  process.env.GROQ_API_KEY_1,
  process.env.GROQ_API_KEY_2,
  process.env.GROQ_API_KEY_3,
].filter((key): key is string => Boolean(key));

const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

let currentGroqKeyIndex = 0;

function getGroqClient(index: number): OpenAI {
  return new OpenAI({
    apiKey: GROQ_KEYS[index] || "not-configured",
    baseURL: GROQ_BASE_URL,
  });
}

/** Error yang menandakan key ini sudah tidak bisa dipakai sementara: rate
 * limit (429) atau credit/quota habis (biasanya juga 429, kadang 401/403
 * tergantung jenis error dari Groq). */
function isRotatableError(err: unknown): boolean {
  const status = (err as { status?: number })?.status;
  return status === 429 || status === 401 || status === 403;
}

/**
 * Jalankan `action` dengan client Groq, coba key demi key mulai dari
 * currentGroqKeyIndex. Kalau semua key gagal dengan error rotatable,
 * lempar error terakhir. Kalau berhasil, currentGroqKeyIndex diupdate
 * supaya request berikutnya mulai dari key yang baru saja berhasil ini.
 */
async function withGroqRotation<T>(
  action: (client: OpenAI) => Promise<T>
): Promise<T> {
  if (GROQ_KEYS.length === 0) {
    throw new Error("Tidak ada GROQ_API_KEY_1/2/3 yang terisi di environment variables.");
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < GROQ_KEYS.length; attempt++) {
    const index = (currentGroqKeyIndex + attempt) % GROQ_KEYS.length;
    try {
      const client = getGroqClient(index);
      const result = await action(client);
      currentGroqKeyIndex = index; // key ini berhasil, mulai dari sini lain kali
      return result;
    } catch (err) {
      lastError = err;
      if (!isRotatableError(err)) {
        // Error bukan soal limit/quota (misal network error, bad request) ->
        // gak ada gunanya coba key lain, langsung lempar.
        throw err;
      }
      console.warn(
        `[Groq] Key #${index + 1} kena limit/gagal, coba key berikutnya...`,
        (err as Error)?.message
      );
    }
  }

  throw lastError;
}

/** Cek apakah provider yang sedang aktif sudah punya API key terisi. */
export function isProviderConfigured(): boolean {
  if (PROVIDER === "groq") return GROQ_KEYS.length > 0;
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
    const completion = await withGroqRotation((client) =>
      client.chat.completions.create({
        model: GROQ_MODEL,
        max_tokens: 512,
        messages: [{ role: "system", content: system }, ...messages],
      })
    );
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
    // Rotasi hanya diterapkan pada saat MEMULAI stream (request awal ke
    // Groq). Kalau errornya baru muncul di tengah-tengah stream (jarang
    // terjadi), itu tidak dicoba ulang otomatis di sini.
    const stream = await withGroqRotation((client) =>
      client.chat.completions.create({
        model: GROQ_MODEL,
        max_tokens: 512,
        messages: [{ role: "system", content: system }, ...messages],
        stream: true,
      })
    );
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

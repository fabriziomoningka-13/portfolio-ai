import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  // Tidak throw di sini supaya build tetap jalan tanpa API key (misalnya di preview
  // deployment). Pengecekan runtime dilakukan di app/api/chat/route.ts sebelum
  // request benar-benar dikirim ke Claude API.
  console.warn(
    "[claudeClient] ANTHROPIC_API_KEY belum di-set. Chatbot tidak akan berfungsi sampai env var ini diisi."
  );
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Model yang dipakai chatbot. Default: Claude Haiku 4.5 — cepat & murah,
 * cocok untuk Q&A seputar profil/skill/project yang sifatnya lugas.
 * Bisa di-override lewat env var ANTHROPIC_MODEL kalau ingin kualitas
 * jawaban lebih tinggi (misal "claude-sonnet-5") dengan biaya lebih besar.
 */
export const CHAT_MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";

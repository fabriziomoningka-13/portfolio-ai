import { NextRequest, NextResponse } from "next/server";
import { generateChatReply, isProviderConfigured } from "@/lib/chatProvider";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";
import { getClientIp, isRateLimited, extractMessages } from "@/lib/chatGuard";

// Route ini butuh akses filesystem (baca system-prompt.md) & env var server,
// jadi jalankan di Node.js runtime, bukan Edge runtime.
export const runtime = "nodejs";

/**
 * Endpoint non-streaming: mengembalikan jawaban lengkap sekaligus dalam JSON.
 * Cocok untuk testing manual (curl/Postman/Invoke-RestMethod) & integrasi lain.
 * Untuk widget chat di UI, lihat /api/chat/stream (efek typing real-time).
 */
export async function POST(req: NextRequest) {
  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error:
          "Kamu sudah mengirim cukup banyak pesan. Coba lagi dalam beberapa menit ya 🙏",
      },
      { status: 429 }
    );
  }

  if (!isProviderConfigured()) {
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

  const messages = extractMessages(body);
  if (messages.length === 0) {
    return NextResponse.json(
      { error: "Pesan tidak boleh kosong." },
      { status: 400 }
    );
  }

  try {
    const system = buildSystemPrompt();
    const answerText = await generateChatReply(system, messages);

    const answer =
      answerText.trim() ||
      "Maaf, saya belum bisa menjawab pertanyaan itu sekarang. Coba tanya lagi dengan cara lain, ya.";

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("[api/chat] Chat provider error:", error);
    return NextResponse.json(
      {
        error:
          "Maaf, chatbot sedang mengalami gangguan koneksi ke AI. Coba lagi sebentar, atau hubungi saya langsung lewat email di halaman Contact.",
      },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { streamChatReply, isProviderConfigured } from "@/lib/chatProvider";
import { buildSystemPrompt } from "@/lib/buildSystemPrompt";
import { getClientIp, isRateLimited, extractMessages } from "@/lib/chatGuard";

export const runtime = "nodejs";

/**
 * Endpoint streaming untuk widget chat di UI. Mengirim potongan teks jawaban
 * secara bertahap (plain text chunks) supaya bisa dirender dengan efek
 * "typing" — sesuai catatan interaksi Bagian 2.3 dokumen roadmap.
 *
 * Validasi (rate limit, API key, format pesan) tetap dilakukan SEBELUM
 * streaming dimulai, jadi error selalu berbentuk JSON status non-200 yang
 * jelas untuk ditangani di client — bukan tercampur di tengah teks jawaban.
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

  const system = buildSystemPrompt();
  const generator = streamChatReply(system, messages);

  // Coba ambil potongan pertama DI LUAR ReadableStream dulu, supaya kalau
  // provider langsung gagal (mis. API key invalid), kita masih bisa
  // mengembalikan JSON error dengan status code yang jelas, bukan stream
  // kosong yang membingungkan di client.
  let firstChunk: IteratorResult<string>;
  try {
    firstChunk = await generator.next();
  } catch (error) {
    console.error("[api/chat/stream] Chat provider error:", error);
    return NextResponse.json(
      {
        error:
          "Maaf, chatbot sedang mengalami gangguan koneksi ke AI. Coba lagi sebentar, atau hubungi saya langsung lewat email di halaman Contact.",
      },
      { status: 502 }
    );
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        if (!firstChunk.done && firstChunk.value) {
          controller.enqueue(encoder.encode(firstChunk.value));
        }
        for await (const chunk of generator) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (error) {
        console.error("[api/chat/stream] Stream error mid-way:", error);
        controller.enqueue(
          encoder.encode(
            "\n\n[Maaf, koneksi ke AI terputus di tengah jalan. Coba tanya ulang ya.]"
          )
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

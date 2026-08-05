const NAVIGATE_REGEX = /\[\[NAVIGATE:(home|about|skills|projects|contact)\]\]/i;

const TARGET_TO_HREF: Record<string, string> = {
  home: "/#home",
  about: "/about",
  skills: "/skills",
  projects: "/projects",
  contact: "/#contact",
};

export interface ParsedChatReply {
  /** Teks jawaban yang aman ditampilkan ke user (marker sudah dihapus). */
  cleanText: string;
  /** Path tujuan navigasi, atau null kalau tidak ada niat pindah halaman. */
  navigateHref: string | null;
}

/**
 * Selama streaming berlangsung, marker bisa saja baru "setengah jadi"
 * (misal baru "[[NAVI" doang). Fungsi ini menyembunyikan ekor teks yang
 * terlihat seperti awal marker, supaya tidak sempat kelihatan berkedip
 * di UI sebelum akhirnya dihapus penuh oleh parseChatReply().
 */
export function hideInProgressMarker(text: string): string {
  const idx = text.lastIndexOf("[[");
  if (idx === -1) return text;

  const tail = text.slice(idx);
  const isCompleteMarker = NAVIGATE_REGEX.test(tail);
  const looksLikePartialMarker = tail.length < 30; // batas wajar panjang marker kita

  if (isCompleteMarker || looksLikePartialMarker) {
    return text.slice(0, idx).trimEnd();
  }
  return text;
}

/** Cari marker [[NAVIGATE:target]] di teks jawaban chatbot, pisahkan dari teks yang ditampilkan. */
export function parseChatReply(rawText: string): ParsedChatReply {
  const match = rawText.match(NAVIGATE_REGEX);
  const cleanText = rawText.replace(NAVIGATE_REGEX, "").trimEnd();

  if (!match) {
    return { cleanText, navigateHref: null };
  }

  const target = match[1].toLowerCase();
  return { cleanText, navigateHref: TARGET_TO_HREF[target] ?? null };
}

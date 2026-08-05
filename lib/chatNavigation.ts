// Marker mendukung 2 bentuk:
// - [[NAVIGATE:target]]          -> halaman umum (home/about/skills/projects/contact)
// - [[NAVIGATE:project:slug]]    -> halaman detail project tertentu, misal project:studio-ai
const NAVIGATE_REGEX =
  /\[\[NAVIGATE:(home|about|skills|projects|contact|project:[a-z0-9-]+)\]\]/i;

const TARGET_TO_HREF: Record<string, string> = {
  home: "/#home",
  about: "/about",
  skills: "/skills",
  projects: "/projects",
  contact: "/#contact",
};

/** Ubah target hasil match regex jadi path URL tujuan. */
function resolveHref(target: string): string | null {
  const lower = target.toLowerCase();

  if (lower.startsWith("project:")) {
    const slug = lower.slice("project:".length).trim();
    return slug ? `/projects/${slug}` : null;
  }

  return TARGET_TO_HREF[lower] ?? null;
}

export interface ParsedChatReply {
  /** Teks jawaban yang aman ditampilkan ke user (marker sudah dihapus). */
  cleanText: string;
  /** Path tujuan navigasi, atau null kalau tidak ada niat pindah halaman. */
  navigateHref: string | null;
}

/**
 * Selama streaming berlangsung, marker bisa saja baru "setengah jadi"
 * (misal baru "[[NAVI" doang, atau "[[NAVIGATE:project:stu" yang belum
 * selesai). Fungsi ini menyembunyikan ekor teks yang terlihat seperti awal
 * marker, supaya tidak sempat kelihatan berkedip di UI sebelum akhirnya
 * dihapus penuh oleh parseChatReply().
 */
export function hideInProgressMarker(text: string): string {
  const idx = text.lastIndexOf("[[");
  if (idx === -1) return text;

  const tail = text.slice(idx);
  const isCompleteMarker = NAVIGATE_REGEX.test(tail);
  // Marker project:slug bisa lebih panjang dari marker biasa (nama slug),
  // jadi batas toleransinya dilonggarkan sedikit.
  const looksLikePartialMarker = tail.length < 60;

  if (isCompleteMarker || looksLikePartialMarker) {
    return text.slice(0, idx).trimEnd();
  }
  return text;
}

/** Cari marker [[NAVIGATE:...]] di teks jawaban chatbot, pisahkan dari teks yang ditampilkan. */
export function parseChatReply(rawText: string): ParsedChatReply {
  const match = rawText.match(NAVIGATE_REGEX);
  const cleanText = rawText.replace(NAVIGATE_REGEX, "").trimEnd();

  if (!match) {
    return { cleanText, navigateHref: null };
  }

  return { cleanText, navigateHref: resolveHref(match[1]) };
}

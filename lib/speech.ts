const SPEECH_LANG = "id-ID";

// Nama-nama suara yang umum dipakai browser/OS untuk menandai suara wanita.
// Web Speech API TIDAK punya field "gender" resmi, jadi ini best-effort
// berdasarkan nama suara yang lazim dipakai Chrome/Edge/Windows/macOS.
const FEMALE_VOICE_HINTS = [
  "female",
  "wanita",
  "damayanti", // nama umum suara Indonesia wanita di sebagian sistem
  "zira", // Microsoft (en)
  "susan",
  "samantha", // macOS default (en)
  "victoria",
  "karen",
  "moira",
  "tessa",
  "veena",
  "google indonesia", // suara default Google ID di Chrome (nada cenderung netral/wanita)
];

let cachedVoices: SpeechSynthesisVoice[] | null = null;

function getVoicesAsync(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve([]);
      return;
    }
    if (cachedVoices) {
      resolve(cachedVoices);
      return;
    }
    const existing = window.speechSynthesis.getVoices();
    if (existing.length > 0) {
      cachedVoices = existing;
      resolve(existing);
      return;
    }
    // Voices sering belum siap saat pertama dipanggil — tunggu event ini.
    window.speechSynthesis.onvoiceschanged = () => {
      const voices = window.speechSynthesis.getVoices();
      cachedVoices = voices;
      resolve(voices);
    };
    // Fallback kalau event tidak pernah fire di sebagian browser.
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
  });
}

async function pickFemaleVoice(): Promise<SpeechSynthesisVoice | null> {
  const voices = await getVoicesAsync();
  if (voices.length === 0) return null;

  const idVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("id"));
  const pool = idVoices.length > 0 ? idVoices : voices;

  const femaleMatch = pool.find((v) =>
    FEMALE_VOICE_HINTS.some((hint) => v.name.toLowerCase().includes(hint))
  );
  if (femaleMatch) return femaleMatch;

  // Kalau tidak ketemu voice bahasa Indonesia yang cocok, coba cari suara
  // wanita di bahasa apa pun yang tersedia — lebih baik daripada default acak.
  const anyFemaleMatch = voices.find((v) =>
    FEMALE_VOICE_HINTS.some((hint) => v.name.toLowerCase().includes(hint))
  );
  if (anyFemaleMatch) return anyFemaleMatch;

  return pool[0] ?? null;
}

/**
 * Ucapkan teks lewat browser (gratis, bawaan Web Speech API), dengan suara
 * wanita kalau tersedia di sistem user. Catatan: Web Speech API tidak
 * menyediakan info gender resmi, jadi ini best-effort berdasarkan nama
 * suara — hasil bisa beda-beda tergantung OS/browser masing-masing user.
 */
export async function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel(); // hentikan ucapan sebelumnya kalau masih jalan

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = SPEECH_LANG;
  // Pitch sedikit lebih tinggi dari default membantu kesan suara lebih
  // "ringan"/feminin walau voice bawaan sistemnya netral.
  utterance.pitch = 1.15;
  utterance.rate = 1.0;

  const voice = await pickFemaleVoice();
  if (voice) utterance.voice = voice;

  window.speechSynthesis.speak(utterance);
}

export { SPEECH_LANG };

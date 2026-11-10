# Portfolio AI — Website Portfolio + Chatbot "Vanessa"

Website portfolio pribadi dengan chatbot AI bernama **Vanessa** yang menjawab pertanyaan recruiter seputar skill, pengalaman, dan project — dibangun untuk mendemonstrasikan kemampuan fullstack dan AI engineering secara langsung.

🔗 Live Demo: portfolio-ai-nu-pied.vercel.app

Dikembangkan secara mandiri end-to-end oleh **Fabrizio Kevin Moningka** — dari perancangan sistem, chatbot logic, hingga deployment production.

## ✨ Fitur Utama

**Untuk Pengunjung (Publik)**
- 🏠 Hero, About, Skills, Projects, Contact — landing page satu halaman dengan section terstruktur
- 📄 Halaman `/about` — narasi lengkap, sertifikasi, bahasa, soft skills
- 📁 Halaman `/projects` + `/projects/[slug]` — detail per-project bergaya README
- 🤖 Chatbot AI "Vanessa" — floating widget, hanya menjawab topik seputar skill/pengalaman/project, menolak topik di luar itu dengan sopan
- ⚡ Streaming Response — jawaban chatbot muncul real-time dengan efek typing via `/api/chat/stream`
- 🎙️ Voice Interaction — input suara & text-to-speech berbasis Web Speech API (browser-native, tanpa biaya API tambahan).
  ⚠️ **Hanya berfungsi di Google Chrome dan Microsoft Edge.** Web Speech API tidak didukung penuh (atau tidak didukung sama sekali) di Firefox dan Safari, karena implementasi ini dipilih khusus supaya fitur voice tetap gratis (tanpa API voice berbayar seperti ElevenLabs/Whisper). Di browser yang tidak didukung, tombol voice otomatis disembunyikan/dinonaktifkan dan pengunjung tetap bisa chat lewat teks seperti biasa.

**Teknis & Aksesibilitas**
- ♿ Skip-to-content link, dukungan `prefers-reduced-motion`, form label accessible
- 🎨 Dark modern theme — teal (#14B8A6) + dark slate (#0F172A)
- 🔄 Micro-interaction — fade-in, scroll reveal, hover scale (Framer Motion)
- 🔒 Rate Limiting — 20 pesan/10 menit per IP pada endpoint chatbot
- 🔁 Rotasi Multi-Akun Groq — hingga 5 API key Groq dipakai bergantian; kalau key yang aktif kena rate limit/quota habis, sistem otomatis pindah ke key berikutnya (1 → 2 → 3 → 4 → 5 → 1 → ...) tanpa mengganggu pengalaman chat pengunjung. Lihat detail di `lib/chatProvider.ts`.

## 🛠️ Arsitektur & Tech Stack

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend       │  HTTP   │   API Routes       │         │   LLM Provider   │
│   Next.js (TS)   │ ───────▶│  Next.js API        │ ───────▶│   Groq (utama,   │
│   Tailwind CSS   │         │  /api/chat/stream    │         │   5 key rotasi)  │
│   Framer Motion  │         │  chatProvider.ts      │         │   Claude (fallback)│
│   → Vercel       │         │  → Vercel Functions   │         │                  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (TypeScript), Tailwind CSS, Framer Motion |
| Chatbot | Groq API — default, dengan rotasi hingga 5 API key; Claude API (Anthropic) — fallback via `CHAT_PROVIDER` |
| Voice | Web Speech API (browser STT/TTS) — didukung di Chrome & Edge saja |
| Backend | Next.js API Routes (serverless) |
| Hosting | Vercel |
| CI/CD | Auto-deploy dari GitHub |

## 📁 Struktur Proyek

```
portfolio-ai/
├── app/
│   ├── page.tsx                # Landing/Hero
│   ├── about/page.tsx
│   ├── projects/page.tsx
│   ├── projects/[slug]/page.tsx
│   ├── contact/page.tsx
│   └── api/
│       └── chat/stream/route.ts   # Endpoint chatbot streaming
├── components/
│   ├── ui/
│   ├── ChatWidget.tsx
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── ProjectCard.tsx
│   ├── SkillBadge.tsx
│   └── Footer.tsx
├── data/
│   ├── profile.json
│   ├── projects.json
│   └── system-prompt.md
├── hooks/
│   ├── useVoiceRecognition.ts
│   └── useVoiceSynthesis.ts
├── lib/
│   ├── chatProvider.ts         # Abstraksi Groq (rotasi 5 key) / Claude
│   └── navigationTools.ts
├── public/
│   └── images/
├── styles/
│   └── globals.css
└── tailwind.config.ts
```

## 🚀 Menjalankan Secara Lokal

**Prasyarat**
- Node.js 18+
- Minimal 1 Groq API key, disarankan hingga 5 key dari akun berbeda (buat gratis di [console.groq.com/keys](https://console.groq.com/keys) — kuota Groq dihitung per akun, jadi pakai email berbeda per akun agar rotasi benar-benar menambah kuota)
- Google Chrome atau Microsoft Edge, kalau ingin menguji fitur Voice Interaction

**Instalasi**
```bash
git clone https://github.com/fabriziomoningka-13/portfolio-ai.git
cd portfolio-ai
npm install
cp .env.local.example .env.local   # isi GROQ_API_KEY_1 s/d GROQ_API_KEY_5, CHAT_PROVIDER
npm run dev
```

Berjalan di `http://localhost:3000`

> Setiap kali mengubah `.env.local`, hentikan server (`Ctrl+C`) lalu jalankan lagi `npm run dev`. Di Vercel, env baru baru berlaku setelah **redeploy**.

### Environment Variables

| Key | Keterangan |
|---|---|
| `CHAT_PROVIDER` | `groq` (default, gratis) atau `anthropic` (Claude API, final sebelum demo ke recruiter) |
| `GROQ_API_KEY_1` | API key akun Groq pertama |
| `GROQ_API_KEY_2` | API key akun Groq kedua (dipakai otomatis kalau key 1 kena limit) |
| `GROQ_API_KEY_3` | API key akun Groq ketiga (dipakai otomatis kalau key 1 & 2 kena limit) |
| `GROQ_API_KEY_4` | API key akun Groq keempat (dipakai otomatis kalau key 1–3 kena limit) |
| `GROQ_API_KEY_5` | API key akun Groq kelima (dipakai otomatis kalau key 1–4 kena limit) |
| `ANTHROPIC_API_KEY` | API key Claude, dipakai kalau `CHAT_PROVIDER=anthropic` |

Isi sebanyak key yang tersedia (minimal 1); rotasi menyesuaikan jumlah key yang terisi. Jangan pernah commit `.env.local` ke GitHub.

## 🗺️ Roadmap

- [ ] Analytics sederhana — pertanyaan apa yang paling sering ditanyakan pengunjung
- [ ] Resume download button dengan tracking klik
- [ ] GitHub contribution graph embed di halaman About
- [ ] Custom domain

## 👤 Kontak

**Fabrizio Kevin Moningka**
Fullstack Developer | UI/Visual Design | AI & Automation

📧 kevinkmoningka@gmail.com
💼 [LinkedIn](https://linkedin.com/in/fabrizio-kevin-moningka-710598419)
💻 [GitHub](https://github.com/fabriziomoningka-13)
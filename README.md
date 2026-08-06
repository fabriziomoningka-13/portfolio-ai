# Portfolio AI — Website Portfolio + Chatbot "Vanessa"

Website portfolio pribadi dengan chatbot AI bernama **Vanessa** yang menjawab pertanyaan recruiter seputar skill, pengalaman, dan project — dibangun untuk mendemonstrasikan kemampuan fullstack dan AI engineering secara langsung.

🔗 Live Demo: your-domain.vercel.app

Dikembangkan secara mandiri end-to-end oleh **Fabrizio Kevin Moningka** — dari perancangan sistem, chatbot logic, hingga deployment production.

## ✨ Fitur Utama

**Untuk Pengunjung (Publik)**
- 🏠 Hero, About, Skills, Projects, Contact — landing page satu halaman dengan section terstruktur
- 📄 Halaman `/about` — narasi lengkap, sertifikasi, bahasa, soft skills
- 📁 Halaman `/projects` + `/projects/[slug]` — detail per-project bergaya README
- 🤖 Chatbot AI "Vanessa" — floating widget, hanya menjawab topik seputar skill/pengalaman/project, menolak topik di luar itu dengan sopan
- ⚡ Streaming Response — jawaban chatbot muncul real-time dengan efek typing via `/api/chat/stream`
- 🎙️ Voice Interaction — input suara & text-to-speech berbasis Web Speech API (browser-native, tanpa biaya API tambahan)

**Teknis & Aksesibilitas**
- ♿ Skip-to-content link, dukungan `prefers-reduced-motion`, form label accessible
- 🎨 Dark modern theme — teal (#14B8A6) + dark slate (#0F172A)
- 🔄 Micro-interaction — fade-in, scroll reveal, hover scale (Framer Motion)
- 🔒 Rate Limiting — 20 pesan/10 menit per IP pada endpoint chatbot

## 🛠️ Arsitektur & Tech Stack

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend       │  HTTP   │   API Routes       │         │   LLM Provider   │
│   Next.js (TS)   │ ───────▶│  Next.js API        │ ───────▶│   Groq (utama)   │
│   Tailwind CSS   │         │  /api/chat/stream    │         │   Claude (fallback)│
│   Framer Motion  │         │  chatProvider.ts      │         │                  │
│   → Vercel       │         │  → Vercel Functions   │         │                  │
└─────────────────┘         └──────────────────┘         └─────────────────┘
```

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 14 (TypeScript), Tailwind CSS, Framer Motion |
| Chatbot | Groq API (Llama 3.3 70B) — default; Claude API (Anthropic) — fallback via `CHAT_PROVIDER` |
| Voice | Web Speech API (browser STT/TTS) |
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
│   ├── chatProvider.ts         # Abstraksi Groq/Claude
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
- Groq API key (console.groq.com/keys)

**Instalasi**
```bash
git clone https://github.com/fabriziomoningka-13/portfolio-ai.git
cd portfolio-ai
npm install
cp .env.local.example .env.local   # isi GROQ_API_KEY, CHAT_PROVIDER
npm run dev
```

Berjalan di `http://localhost:3000`

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
# Portfolio Website + AI Chatbot

Website portfolio pribadi dengan chatbot AI berbasis RAG yang hanya menjawab pertanyaan seputar skill, pengalaman, dan project pemiliknya.

## Tech Stack
- Next.js (App Router) + TypeScript
- TailwindCSS + shadcn/ui
- Framer Motion
- Claude API (Anthropic) untuk chatbot

## Menjalankan secara lokal

```bash
npm install
cp .env.local.example .env.local   # lalu isi ANTHROPIC_API_KEY kamu
npm run dev
```

Buka http://localhost:3000

## Struktur Folder
Lihat `portfolio-project-full.docx` Bagian 1.4 untuk detail lengkap struktur folder yang direncanakan.

## Deploy
Project ini di-deploy otomatis ke Vercel setiap push ke branch `main`.

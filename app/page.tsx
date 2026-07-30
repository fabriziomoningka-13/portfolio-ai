import { Button } from "@/components/ui/button";
import profile from "@/data/profile.json";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-sm uppercase tracking-widest text-text-muted">
        Fase 2 — Setup Project ✅
      </p>
      <h1 className="text-4xl font-bold sm:text-5xl">{profile.tagline}</h1>
      <p className="max-w-xl text-text-muted">{profile.subtitle}</p>
      <div className="flex gap-4">
        <Button variant="solid">Lihat Project</Button>
        <Button variant="outline">Download CV</Button>
      </div>
    </main>
  );
}

import Image from "next/image";
import { Download, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import profile from "@/data/profile.json";

export function Hero() {
  return (
    <section
      id="home"
      className="mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 py-20 md:flex-row md:justify-between md:py-28"
    >
      <div className="flex max-w-xl flex-col items-center gap-5 text-center md:items-start md:text-left">
        <h1 className="font-heading text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
          {profile.tagline}
        </h1>
        <p className="text-lg text-text-muted">{profile.subtitle}</p>
        <div className="flex flex-wrap justify-center gap-4 md:justify-start">
          <Button asChild size="lg" variant="solid">
            <a href="#projects">
              <FolderKanban className="size-5" /> Lihat Project
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={profile.resumeUrl} download>
              <Download className="size-5" /> Download CV
            </a>
          </Button>
        </div>
      </div>

      <div className="relative size-40 shrink-0 sm:size-52 md:size-64">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-primary to-green-accent opacity-70 blur-md" />
        <div className="absolute inset-1 overflow-hidden rounded-full bg-dark-surface">
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            sizes="(max-width: 640px) 160px, (max-width: 768px) 208px, 256px"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

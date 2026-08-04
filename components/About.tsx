import Link from "next/link";
import { ArrowRight } from "lucide-react";
import profile from "@/data/profile.json";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">About Me</h2>
      </Reveal>

      <div className="grid gap-10 md:grid-cols-3">
        <Reveal delay={0.1} className="flex flex-col gap-4 md:col-span-2">
          {profile.about.paragraphs.map((p, i) => (
            <p key={i} className="text-text-muted leading-relaxed">
              {p}
            </p>
          ))}
          <Button asChild variant="outline" className="mt-2 self-start">
            <Link href="/about">
              Read Full Story <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Reveal>

        <Reveal delay={0.2} className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {profile.about.highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl border border-border bg-dark-surface p-4 text-center transition-colors hover:border-teal-primary md:text-left"
            >
              <div className="font-heading text-2xl font-bold text-teal-primary">
                {h.value}
              </div>
              <div className="text-xs text-text-muted">{h.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

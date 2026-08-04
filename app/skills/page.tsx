import type { Metadata } from "next";
import { Code2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { SkillBadge } from "@/components/SkillBadge";
import profile from "@/data/profile.json";

export const metadata: Metadata = {
  title: `Skills — ${profile.name}`,
  description: `Full breakdown of ${profile.name}'s technical skills and tools.`,
};

export default function SkillsPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-5xl px-6 py-16">
        <Reveal>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">Skills</h1>
          <p className="mt-3 max-w-2xl text-text-muted">
            A full breakdown of the languages, frameworks, and tools I work with,
            grouped by category.
          </p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-12">
          {profile.skillCategories.map((category, i) => (
            <Reveal key={category.name} delay={i * 0.05}>
              <div className="mb-4 flex items-center gap-2">
                <Code2 className="size-5 text-teal-primary" />
                <h2 className="font-heading text-lg font-semibold text-text-primary">
                  {category.name}
                </h2>
              </div>
              <RevealGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {category.items.map((skill) => (
                  <RevealItem key={skill}>
                    <SkillBadge name={skill} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SkillBadge } from "@/components/SkillBadge";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import profile from "@/data/profile.json";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Skills</h2>
      </Reveal>
      <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {profile.skillsPreview.map((skill) => (
          <RevealItem key={skill}>
            <SkillBadge name={skill} />
          </RevealItem>
        ))}
      </RevealGroup>

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/skills">
            View All Skills <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}

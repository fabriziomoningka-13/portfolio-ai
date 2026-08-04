import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { Button } from "@/components/ui/button";
import projectsData from "@/data/projects.json";
import type { Project } from "@/components/ProjectCard";

const HOME_PROJECTS_LIMIT = 4;

export function Projects() {
  const allProjects = projectsData as Project[];
  const featured = allProjects.slice(0, HOME_PROJECTS_LIMIT);

  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Projects</h2>
      </Reveal>

      <ProjectsGrid projects={featured} />

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <Button asChild size="lg" variant="outline">
          <Link href="/projects">
            Lihat Semua Project <ArrowRight className="size-4" />
          </Link>
        </Button>
      </Reveal>
    </section>
  );
}

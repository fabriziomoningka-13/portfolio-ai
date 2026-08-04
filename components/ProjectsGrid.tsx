import { ProjectCard, type Project } from "@/components/ProjectCard";
import { RevealGroup, RevealItem } from "@/components/Reveal";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <RevealGroup className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {projects.map((project) => (
        <RevealItem key={project.slug} className="h-full" hoverLift>
          <ProjectCard project={project} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

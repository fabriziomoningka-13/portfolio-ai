import { ProjectCard, type Project } from "@/components/ProjectCard";
import projects from "@/data/projects.json";

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Projects</h2>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {(projects as Project[]).map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}

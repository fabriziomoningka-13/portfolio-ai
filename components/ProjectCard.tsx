import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";

export interface Project {
  slug: string;
  title: string;
  description: string;
  tech: string[];
  thumbnail: string;
  demoUrl: string;
  githubUrl: string;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-dark-surface transition-colors hover:border-teal-primary hover:shadow-lg hover:shadow-teal-primary/10">
      <div className="relative h-44 w-full bg-dark-base">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
        />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold text-text-primary">{project.title}</h3>
        <p className="flex-1 text-sm text-text-muted">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-teal-primary"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="mt-2 flex gap-3">
          <Button asChild size="sm" variant="solid">
            <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" /> Live Demo
            </a>
          </Button>
          <Button asChild size="sm" variant="outline">
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <GithubIcon className="size-4" /> GitHub
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

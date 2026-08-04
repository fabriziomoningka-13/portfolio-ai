import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";
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
  period?: string;
  context?: string;
  highlights?: string[];
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-dark-surface transition-colors hover:border-teal-primary hover:shadow-lg hover:shadow-teal-primary/10">
      {/* Area ini navigasi internal ke halaman detail project (bukan tab baru) */}
      <Link href={`/projects/${project.slug}`} className="flex flex-1 flex-col">
        <div className="relative h-44 w-full bg-dark-base">
          <Image
            src={project.thumbnail}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
          />
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5 pb-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-text-primary transition-colors group-hover:text-teal-primary">
              {project.title}
            </h3>
            <ArrowUpRight className="size-4 shrink-0 text-text-muted transition-colors group-hover:text-teal-primary" />
          </div>
          <p className="flex-1 text-sm text-text-muted">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tech.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-teal-primary"
              >
                {t}
              </span>
            ))}
            {project.tech.length > 4 && (
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-text-muted">
                +{project.tech.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Tombol aksi eksternal — sengaja di luar <Link> supaya tidak nested anchor */}
      <div className="flex gap-3 p-5 pt-4">
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
  );
}

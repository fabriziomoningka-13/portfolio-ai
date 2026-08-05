import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { GithubIcon } from "@/components/icons";
import type { Project } from "@/components/ProjectCard";
import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";

const projects = projectsData as Project[];

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${profile.name}`,
    description: project.description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <Link
            href="/projects"
            className="mb-8 inline-flex items-center gap-2 text-sm text-text-muted transition-colors hover:text-teal-primary"
          >
            <ArrowLeft className="size-4" /> Back to all projects
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="relative mb-8 h-56 w-full overflow-hidden rounded-2xl border border-border bg-dark-surface sm:h-72 md:h-96">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
            {project.period && (
              <span className="rounded-full border border-border px-2.5 py-1 font-mono">
                {project.period}
              </span>
            )}
            {project.context && <span>{project.context}</span>}
          </div>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">{project.title}</h1>
          <p className="mt-3 max-w-2xl text-text-muted">{project.description}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild variant="solid">
              <a href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" /> Live Demo
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-4" /> GitHub
              </a>
            </Button>
          </div>
        </Reveal>

        {/* Tech stack */}
        <Reveal delay={0.15} className="mt-10">
          <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
            Tech Stack
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-border bg-dark-surface px-3 py-1.5 font-mono text-xs text-teal-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Highlights / README-style detail points */}
        {project.highlights && project.highlights.length > 0 && (
          <Reveal delay={0.2} className="mt-10">
            <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              Detail & Highlights
            </h2>
            <ul className="flex flex-col gap-4">
              {project.highlights.map((point, i) => (
                <li
                  key={i}
                  className="flex gap-3 rounded-xl border border-border bg-dark-surface p-4"
                >
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-teal-primary" />
                  <p className="text-sm leading-relaxed text-text-muted">{point}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* Navigasi ke project lain */}
        <Reveal delay={0.25} className="mt-14 border-t border-border pt-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-teal-primary hover:underline"
          >
            <ArrowLeft className="size-4" /> View other projects
          </Link>
        </Reveal>
      </main>
      <Footer />
    </>
  );
}

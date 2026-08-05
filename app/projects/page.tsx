import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import type { Project } from "@/components/ProjectCard";
import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";

export const metadata: Metadata = {
  title: `All Projects — ${profile.name}`,
  description: `A complete collection of projects built by ${profile.name}.`,
};

export default function ProjectsPage() {
  const allProjects = projectsData as Project[];

  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            All Projects
          </h1>
          <p className="mt-3 max-w-2xl text-text-muted">
            A complete collection of projects I&apos;ve worked on — from
            fullstack applications and AI experiments to personal projects.
          </p>
        </Reveal>

        <div className="mt-10">
          <ProjectsGrid projects={allProjects} />
        </div>
      </main>
      <Footer />
    </>
  );
}

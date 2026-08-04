import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { Reveal } from "@/components/Reveal";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import type { Project } from "@/components/ProjectCard";
import profile from "@/data/profile.json";
import projectsData from "@/data/projects.json";

export const metadata: Metadata = {
  title: `Semua Project — ${profile.name}`,
  description: `Kumpulan lengkap project yang pernah dikerjakan oleh ${profile.name}.`,
};

export default function ProjectsPage() {
  const allProjects = projectsData as Project[];

  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-16">
        <Reveal>
          <h1 className="font-heading text-3xl font-bold sm:text-4xl">
            Semua Project
          </h1>
          <p className="mt-3 max-w-2xl text-text-muted">
            Kumpulan lengkap project yang pernah saya kerjakan — mulai dari
            aplikasi fullstack, eksperimen AI, hingga project pribadi.
          </p>
        </Reveal>

        <div className="mt-10">
          <ProjectsGrid projects={allProjects} />
        </div>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

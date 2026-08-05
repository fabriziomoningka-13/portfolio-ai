import type { Metadata } from "next";
import Image from "next/image";
import { GraduationCap, Award, Languages, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import profile from "@/data/profile.json";

export const metadata: Metadata = {
  title: `About — ${profile.name}`,
  description: `More about ${profile.name}'s background, education, and skills.`,
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="mx-auto max-w-4xl px-6 py-16">
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
            <div className="relative size-24 shrink-0 overflow-hidden rounded-full border border-border bg-dark-surface sm:size-28">
              <Image
                src={profile.avatarUrl}
                alt={`Foto profil ${profile.name}`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold sm:text-4xl">About Me</h1>
              <p className="mt-2 text-text-muted">{profile.subtitle}</p>
            </div>
          </div>
        </Reveal>

        {/* Narasi lengkap */}
        <Reveal delay={0.1} className="mt-12 flex flex-col gap-4">
          {profile.about.extendedParagraphs.map((p, i) => (
            <p key={i} className="leading-relaxed text-text-muted">
              {p}
            </p>
          ))}
        </Reveal>

        {/* Highlight stats */}
        <Reveal delay={0.15} className="mt-10 grid grid-cols-3 gap-4">
          {profile.about.highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl border border-border bg-dark-surface p-4 text-center"
            >
              <div className="font-heading text-2xl font-bold text-teal-primary">
                {h.value}
              </div>
              <div className="text-xs text-text-muted">{h.label}</div>
            </div>
          ))}
        </Reveal>

        {/* Education */}
        <Reveal delay={0.2} className="mt-14">
          <div className="mb-4 flex items-center gap-2">
            <GraduationCap className="size-5 text-teal-primary" />
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Education
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {profile.education.map((edu) => (
              <div
                key={edu.institution}
                className="rounded-xl border border-border bg-dark-surface p-4"
              >
                <div className="font-medium text-text-primary">{edu.degree}</div>
                <div className="text-sm text-text-muted">{edu.institution}</div>
                <div className="mt-1 font-mono text-xs text-teal-primary">{edu.period}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Certifications */}
        <Reveal delay={0.25} className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Award className="size-5 text-teal-primary" />
            <h2 className="font-heading text-lg font-semibold text-text-primary">
              Certifications & Training
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {profile.certifications.map((cert) => (
              <div
                key={cert.title}
                className="rounded-xl border border-border bg-dark-surface p-4"
              >
                <div className="font-medium text-text-primary">{cert.title}</div>
                <div className="text-sm text-text-muted">{cert.issuer}</div>
                <div className="mt-1 font-mono text-xs text-teal-primary">{cert.year}</div>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-10 sm:grid-cols-2">
          {/* Languages */}
          <Reveal delay={0.3}>
            <div className="mb-4 flex items-center gap-2">
              <Languages className="size-5 text-teal-primary" />
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Languages
              </h2>
            </div>
            <div className="flex flex-col gap-2">
              {profile.languages.map((lang) => (
                <div
                  key={lang.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-dark-surface px-4 py-3 text-sm"
                >
                  <span className="text-text-primary">{lang.name}</span>
                  <span className="text-text-muted">{lang.level}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Soft Skills */}
          <Reveal delay={0.35}>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-5 text-teal-primary" />
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                Soft Skills
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.softSkills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-dark-surface px-3 py-1.5 text-xs text-text-primary"
                >
                  {skill}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </main>
      <Footer />
    </>
  );
}

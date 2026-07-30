import { SkillBadge } from "@/components/SkillBadge";
import profile from "@/data/profile.json";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Skills</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {profile.skills.map((skill) => (
          <SkillBadge key={skill} name={skill} />
        ))}
      </div>
    </section>
  );
}

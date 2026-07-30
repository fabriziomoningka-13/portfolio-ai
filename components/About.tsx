import profile from "@/data/profile.json";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="mb-8 font-heading text-2xl font-bold sm:text-3xl">Tentang Saya</h2>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-2">
          {profile.about.paragraphs.map((p, i) => (
            <p key={i} className="text-text-muted leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
          {profile.about.highlights.map((h) => (
            <div
              key={h.label}
              className="rounded-xl border border-border bg-dark-surface p-4 text-center md:text-left"
            >
              <div className="font-heading text-2xl font-bold text-teal-primary">
                {h.value}
              </div>
              <div className="text-xs text-text-muted">{h.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

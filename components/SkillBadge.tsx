export function SkillBadge({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-center rounded-xl border border-border bg-dark-surface px-4 py-3 text-center text-sm font-medium text-text-primary transition-colors hover:border-teal-primary">
      {name}
    </div>
  );
}

import profile from "@/data/profile.json";

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 text-center text-sm text-text-muted">
      © {new Date().getFullYear()} {profile.name}
    </footer>
  );
}

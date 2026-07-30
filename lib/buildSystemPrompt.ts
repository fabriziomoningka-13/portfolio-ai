import fs from "fs";
import path from "path";
import profile from "@/data/profile.json";
import projects from "@/data/projects.json";

/**
 * Merangkai system prompt final untuk chatbot:
 * - Membaca template guardrail dari data/system-prompt.md
 * - Menyuntikkan konteks data diri & project ke placeholder {{CONTEXT}}
 *
 * Dipisah dari data/system-prompt.md (bukan di-hardcode di sini) supaya
 * gampang diedit tanpa menyentuh kode — sesuai catatan 4.2 di dokumen.
 */
export function buildSystemPrompt(): string {
  const templatePath = path.join(process.cwd(), "data", "system-prompt.md");
  const template = fs.readFileSync(templatePath, "utf-8");

  const context = [
    "## DATA PROFIL",
    "```json",
    JSON.stringify(profile, null, 2),
    "```",
    "",
    "## DATA PROJECT",
    "```json",
    JSON.stringify(projects, null, 2),
    "```",
  ].join("\n");

  return template.replace("{{CONTEXT}}", context);
}

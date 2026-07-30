import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  // Pastikan data/system-prompt.md ikut ter-bundle di serverless function
  // Vercel untuk /api/chat (dibaca lewat fs.readFileSync di runtime).
  outputFileTracingIncludes: {
    "/api/chat": ["./data/**"],
  },
};

export default nextConfig;


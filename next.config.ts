import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    // Pin the workspace root: without this, Next walks up and finds an unrelated
    // package-lock.json in the home directory.
    root: __dirname,
    // Tailwind v4 is compiled by Turbopack, not PostCSS (Next 16 default).
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

import type { Metadata } from "next";
import { IBM_Plex_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { MotionBoot } from "@/components/motion/boot";
import { ScrollReveals } from "@/components/motion/ScrollReveals";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { getProfile } from "@/lib/content";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

// GitHub Pages serves the site from the repo root, so Open Graph URLs resolve
// against this origin (CLAUDE.md, Stack).
const siteUrl = "https://lathifash03.github.io";

export function generateMetadata(): Metadata {
  const profile = getProfile("en");
  return {
    metadataBase: new URL(siteUrl),
    title: profile.name,
    description: profile.statement,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.png", type: "image/png", sizes: "32x32" },
      ],
    },
    openGraph: {
      type: "website",
      title: profile.name,
      description: profile.statement,
      url: "/",
      siteName: profile.name,
    },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${jakarta.variable} ${plexMono.variable}`}>
      <body className="antialiased">
        {/* Must run before first paint — see components/motion/boot.tsx. */}
        <MotionBoot />
        {children}
        <SmoothScroll />
        <ScrollReveals />
      </body>
    </html>
  );
}

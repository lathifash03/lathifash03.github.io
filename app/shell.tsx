import type { ReactNode } from "react";
import { MotionBoot } from "@/components/motion/boot";
import { ScrollReveals } from "@/components/motion/ScrollReveals";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * The document every locale shares. There is one root layout per locale route
 * group, because `<html lang>` has to be right per route and only a root layout
 * renders <html> (CLAUDE.md, Routes).
 */
export function SiteShell({
  lang,
  children,
}: {
  lang: string;
  children: ReactNode;
}) {
  return (
    // MotionBoot sets data-intro and data-js on <html> before hydration, so the
    // server markup and the client's first read of this element differ by
    // design. suppressHydrationWarning covers attributes on this element only,
    // not its children, so a real mismatch anywhere else still reports.
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
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

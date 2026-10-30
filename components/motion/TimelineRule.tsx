"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll } from "motion/react";
import { useScrub } from "@/components/motion/useScrub";

/**
 * DESIGN.md §7.8: the Experience rule draws downward with scroll progress.
 * The rule is a real element rather than a border so it has something to
 * scale; when the effect is off it simply stands at full height.
 */
export function TimelineRule({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useScrub();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "end 0.6"],
  });

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-px bg-line"
        style={
          on
            ? { scaleY: scrollYProgress, transformOrigin: "top" }
            : undefined
        }
      />
      {children}
    </div>
  );
}

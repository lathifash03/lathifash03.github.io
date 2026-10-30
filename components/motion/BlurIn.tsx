"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { useScrub } from "@/components/motion/useScrub";

/**
 * DESIGN.md §7.9: a Leadership entry resolves from blur(8px) at 25% opacity
 * to sharp as its top reaches 55% of the viewport. Scrubbed by scroll, and
 * clamped at both ends — once an entry has resolved it stays resolved, so
 * nothing is left soft at the foot of the page (decision I).
 */
export function BlurIn({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useScrub();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.55"],
  });
  const radius = useTransform(scrollYProgress, [0, 1], [8, 0], { clamp: true });
  const opacity = useTransform(scrollYProgress, [0, 1], [0.25, 1], {
    clamp: true,
  });
  const filter = useMotionTemplate`blur(${radius}px)`;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={on ? { filter, opacity } : undefined}
    >
      {children}
    </motion.div>
  );
}

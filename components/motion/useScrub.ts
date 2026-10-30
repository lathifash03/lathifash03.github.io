"use client";

import { useEffect, useState } from "react";

/**
 * Whether a scroll-scrubbed effect (DESIGN.md §7.6, §7.8, §7.9) should run.
 *
 * These three cannot express their start state in a keyframe, so unlike every
 * other effect they are switched off here rather than by the stylesheet's
 * prefers-reduced-motion block. It starts false and turns on after mount, so
 * the server markup is always the plain, finished layout.
 */
export function useScrub(minWidth = 0): boolean {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const queries = [
      "(prefers-reduced-motion: no-preference)",
      ...(minWidth ? [`(min-width: ${minWidth}px)`] : []),
    ].map((query) => window.matchMedia(query));

    const sync = () => setOn(queries.every((query) => query.matches));
    sync();

    for (const query of queries) query.addEventListener("change", sync);
    return () => {
      for (const query of queries) query.removeEventListener("change", sync);
    };
  }, [minWidth]);

  return on;
}

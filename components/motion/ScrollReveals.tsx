"use client";

import { useEffect } from "react";
import { FAILSAFE_KEY } from "@/components/motion/boot";

/** Matches the stylesheet: an element reveals once its top is 10% above the fold. */
const TRIGGER = 0.9;

/**
 * DESIGN.md §7.10. One sweep for every [data-reveal] on the page, so the
 * sections themselves stay server components and carry no client bundle.
 *
 * This asks "is the element above the line yet?" rather than listening for it
 * to cross: an IntersectionObserver reports a crossing, and a fast scroll —
 * a Lenis fling, an anchor jump, a restored scroll position — can carry an
 * element from below the fold to above it between two samples, firing nothing
 * and stranding that element at opacity 0 for good. A position test cannot be
 * skipped. The set drains as elements reveal, and the listeners detach with
 * the last one.
 */
export function ScrollReveals() {
  useEffect(() => {
    const html = document.documentElement;

    // Hydration arrived, so the boot failsafe is no longer needed.
    const failsafe = (window as unknown as Record<string, number | undefined>)[
      FAILSAFE_KEY
    ];
    if (failsafe !== undefined) window.clearTimeout(failsafe);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // Belt and braces: the stylesheet already drops the animation, and
      // without data-js there is no held state left to drop.
      html.removeAttribute("data-js");
      return;
    }

    const pending = new Set(document.querySelectorAll("[data-reveal]"));
    let frame = 0;

    function detach() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    function sweep() {
      frame = 0;
      const line = window.innerHeight * TRIGGER;
      for (const node of pending) {
        if (node.getBoundingClientRect().top < line) {
          node.setAttribute("data-shown", "");
          pending.delete(node);
        }
      }
      if (pending.size === 0) detach();
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(sweep);
    }

    sweep();
    if (pending.size) {
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    }

    return detach;
  }, []);

  return null;
}

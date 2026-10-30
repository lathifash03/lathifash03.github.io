"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * DESIGN.md §7.5. Desktop fine pointers only — a touch device keeps its
 * native scroll, which is both faster and the behaviour people expect.
 * Nav clicks are intercepted here rather than in SiteNav so the offset is
 * read from the real header height instead of a duplicated constant.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || still) return;

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest?.("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      const header = document.querySelector("header");
      const offset = header instanceof HTMLElement ? header.offsetHeight : 0;

      event.preventDefault();
      lenis.scrollTo(target, { offset: -offset });
      history.pushState(null, "", href);
    };

    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onClick);
      lenis.destroy();
    };
  }, []);

  return null;
}

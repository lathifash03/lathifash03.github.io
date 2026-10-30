"use client";

import { useEffect } from "react";

/**
 * DESIGN.md §7.1: any click, key, wheel or touch ends the intro at once.
 * Marking the document `done` both hides the overlay and collapses
 * --intro-delay, so the hero does not keep waiting for an intro that has
 * already gone.
 */
export function IntroSkip() {
  useEffect(() => {
    const html = document.documentElement;
    if (html.getAttribute("data-intro") === "done") return;

    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    const skip = () => {
      html.setAttribute("data-intro", "done");
      stop();
    };
    const stop = () => {
      window.clearTimeout(timer);
      for (const event of events) window.removeEventListener(event, skip);
    };

    for (const event of events) {
      window.addEventListener(event, skip, { passive: true });
    }
    // The overlay's own animation is finished by 1.4s; after that there is
    // nothing left to skip, and the listeners should not outlive it.
    const timer = window.setTimeout(stop, 1500);

    return stop;
  }, []);

  return null;
}

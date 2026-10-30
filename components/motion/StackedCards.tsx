"use client";

import {
  Children,
  createRef,
  useEffect,
  useMemo,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useScrub } from "@/components/motion/useScrub";

/** DESIGN.md §7.6: top offsets 96 / 112 / 128px. */
const TOP = 96;
const STEP = 16;

/** A fully covered card: a hint of shade, not a shadow over the content. */
const DIM = 0.94;
const SHRINK = 0.96;

/**
 * DESIGN.md §7.6. Below 1024px, and whenever stillness is asked for, the
 * children are returned as the plain vertical list they already are.
 *
 * The scrub is hand-written against rendered rects rather than handed to a
 * scroll-progress helper. Those measure an element's position in the document,
 * and a sticky card's document position is not where it is on screen — so a
 * card that had pinned still reported itself as travelling, and dimmed while
 * it was the one being read. `getBoundingClientRect` reports where the card
 * actually is, in WebKit and Chromium alike.
 */
export function StackedCards({ children }: { children: ReactNode }) {
  const on = useScrub(1024);
  const cards = Children.toArray(children);
  const refs = useMemo(
    () => cards.map(() => createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards.length],
  );

  useEffect(() => {
    if (!on) return;

    const nodes = refs
      .map((ref) => ref.current)
      .filter((node): node is HTMLDivElement => node !== null);
    let frame = 0;

    function paint() {
      frame = 0;
      const vh = window.innerHeight;

      nodes.forEach((node, i) => {
        const next = nodes[i + 1];
        // Nothing arrives over the front card, so it is never touched.
        if (!next) return;

        // 0 while the next card is still below the fold, 1 once it has pinned
        // on top of this one: a card is only ever dimmed by what covers it.
        // Scaling from the top edge keeps `top` honest, so reading the next
        // card's rect here cannot feed back on itself.
        const pinned = TOP + (i + 1) * STEP;
        const travel = Math.max(1, vh - pinned);
        const covered = Math.min(1, Math.max(0, (vh - next.getBoundingClientRect().top) / travel));

        node.style.transform = `scale(${1 - (1 - SHRINK) * covered})`;
        node.style.filter = `brightness(${1 - (1 - DIM) * covered})`;
      });
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      for (const node of nodes) {
        node.style.transform = "";
        node.style.filter = "";
      }
    };
  }, [on, refs]);

  return (
    <div className={on ? "" : "space-y-6 md:space-y-8"}>
      {cards.map((card, i) => (
        <div
          key={i}
          ref={refs[i]}
          // DESIGN.md §6: the one shadow in the system, and this is what it is
          // for — without an edge, a card sliding over another reads as one
          // tall card rather than two.
          className={on ? "sticky rounded-card shadow-stack" : undefined}
          style={
            on
              ? ({
                  top: TOP + i * STEP,
                  zIndex: i,
                  // Shrink downward from the top edge, so each covered card
                  // keeps peeking out by its 16px step. Scaling about the
                  // centre would drop the top edge by ~30px on a card this
                  // tall and hide the card behind altogether.
                  transformOrigin: "top center",
                } as CSSProperties)
              : undefined
          }
        >
          {card}
        </div>
      ))}
    </div>
  );
}

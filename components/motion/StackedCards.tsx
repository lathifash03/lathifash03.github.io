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
/** How much of the window is left under a card that cannot fit above it. */
const FLOOR = 24;
/** Under this window height a card has no room to stack at all. */
const MIN_HEIGHT = 700;

/** A fully covered card: a hint of shade, not a shadow over the content. */
const DIM = 0.94;
const SHRINK = 0.96;

/**
 * DESIGN.md §7.6. Below 1024px, under 700px of window height, and whenever
 * stillness is asked for, the children are returned as the plain vertical
 * list they already are.
 *
 * The scrub is hand-written against rendered rects rather than handed to a
 * scroll-progress helper. Those measure an element's position in the document,
 * and a sticky card's document position is not where it is on screen — so a
 * card that had pinned still reported itself as travelling, and dimmed while
 * it was the one being read. `getBoundingClientRect` reports where the card
 * actually is, in WebKit and Chromium alike.
 */
export function StackedCards({ children }: { children: ReactNode }) {
  const on = useScrub(1024, MIN_HEIGHT);
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
    let tops: number[] = [];
    let frame = 0;

    /**
     * Where each card pins. A card shorter than the window pins at its step
     * in the stack; a card taller than the window pins by its bottom edge
     * instead, so its last line is read before the next card arrives over it
     * — which is what the step offsets alone could not do.
     */
    function layout() {
      const vh = window.innerHeight;
      tops = nodes.map((node, i) =>
        Math.min(TOP + i * STEP, vh - node.offsetHeight - FLOOR),
      );
      nodes.forEach((node, i) => {
        node.style.top = `${tops[i]}px`;
      });
    }

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
        const travel = Math.max(1, vh - tops[i + 1]);
        const covered = Math.min(
          1,
          Math.max(0, (vh - next.getBoundingClientRect().top) / travel),
        );

        node.style.transform = `scale(${1 - (1 - SHRINK) * covered})`;
        node.style.filter = `brightness(${1 - (1 - DIM) * covered})`;
      });
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function onResize() {
      layout();
      onScroll();
    }

    layout();
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    // A card's height changes when its web fonts land, and the pin positions
    // are measured, so they are measured again once they have.
    document.fonts?.ready.then(onResize).catch(() => {});

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frame) cancelAnimationFrame(frame);
      for (const node of nodes) {
        node.style.top = "";
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
                  // `top` is written by the effect, which knows the window and
                  // the card's own height; this is the value before it runs.
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

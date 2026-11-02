"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { useScrub } from "@/components/motion/useScrub";
import type { LaneId, Profile } from "@/lib/content";

/** DESIGN.md §2: accents fill a chip; they never colour a word. */
const chipFill: Record<LaneId, string> = {
  ai: "bg-chip-ai",
  sw: "bg-chip-sw",
  wr: "bg-chip-wr",
};

/** Each chip's resting tilt, as a value rather than a class: the pop-in
 *  keyframe has to end on it, and a keyframe cannot read a utility. */
const chipTilt: Record<LaneId, string> = {
  ai: "-6deg",
  sw: "3deg",
  wr: "-3deg",
};

/**
 * One glyph per lane, drawn rather than imported: three marks do not earn an
 * icon package. Each is a white stroke on its chip and is hidden from the
 * accessibility tree — the phrase beside it says what the lane is.
 */
const glyph: Record<LaneId, string> = {
  // a magnifier, for research
  ai: "M10.5 3a7.5 7.5 0 1 0 4.55 13.46l4.24 4.25 1.42-1.42-4.25-4.24A7.5 7.5 0 0 0 10.5 3Zm0 2a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z",
  // stacked blocks, for building
  sw: "M4 5h7v5H4V5Zm9 0h7v5h-7V5ZM4 12h7v7H4v-7Zm9 0h7v7h-7v-7Z",
  // a pen nib, for writing
  wr: "M4 20.5 5.5 15 15 5.5a2.1 2.1 0 0 1 3 3L8.5 18 3 19.5l1-1Zm2.2-1.7 1.4-.4L16.6 9.7l-1-1L7 17.3l-.8 1.5Z",
};

/** How much of the scrub the marker sweep takes, in word-widths. */
const MARKER_STEPS = 3;
/** The statement's top enters at 0.88 of the viewport and finishes at 0.35. */
const ENTER = 0.88;
const DONE = 0.35;

type Piece =
  | { kind: "word"; text: string; index: number }
  | { kind: "space"; text: string }
  | { kind: "chip"; lane: LaneId; index: number };

/**
 * DESIGN.md §4 and §7.13. The sentence is built from content segments, split
 * into words here so each one can carry its own place in the scrub. The words
 * are the only thing JS touches per frame: it writes one progress value on the
 * paragraph and the stylesheet derives every word, chip and the marker from it.
 */
export function LaneStatement({ profile }: { profile: Profile }) {
  const on = useScrub();
  const ref = useRef<HTMLParagraphElement>(null);

  const { groups, total } = useMemo(() => {
    let index = 0;
    const groups = profile.lanesStatement.map((segment) => {
      const pieces: Piece[] = [];
      if (segment.lane) pieces.push({ kind: "chip", lane: segment.lane, index });
      for (const token of segment.text.split(/(\s+)/)) {
        if (!token) continue;
        if (/^\s+$/.test(token)) pieces.push({ kind: "space", text: token });
        else pieces.push({ kind: "word", text: token, index: index++ });
      }
      return { mark: segment.mark, pieces };
    });
    return { groups, total: index };
  }, [profile.lanesStatement]);

  useEffect(() => {
    const node = ref.current;
    if (!on || !node) return;

    const chips = Array.from(
      node.querySelectorAll<HTMLElement>("[data-chip]"),
    ).map((el) => ({ el, index: Number(el.dataset.chip) }));
    const steps = total + MARKER_STEPS;
    let frame = 0;

    function paint() {
      frame = 0;
      if (!node) return;
      const vh = window.innerHeight;
      const top = node.getBoundingClientRect().top;
      const from = vh * ENTER;
      const to = vh * DONE;
      const p = Math.min(1, Math.max(0, (from - top) / (from - to)));

      node.style.setProperty("--p", String(p));
      // The sweep is the tail of the same scrub, so it can only start once the
      // last word is in (DESIGN.md §7.11).
      const marker = Math.min(1, Math.max(0, (p * steps - total) / MARKER_STEPS));
      node.style.setProperty("--m", String(marker));

      for (const chip of chips) {
        // A chip belongs to the phrase after it, so it pops as that phrase's
        // first word starts to arrive, and then stays — scrubbing back up
        // un-reveals words, but a chip that blinked in and out would read as
        // a fault rather than a reversal.
        if (p * steps - chip.index > 0) chip.el.setAttribute("data-on", "");
      }
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
      node.style.removeProperty("--p");
      node.style.removeProperty("--m");
    };
  }, [on, total]);

  return (
    <p
      ref={ref}
      className="statement max-w-[24ch] font-display text-section text-ink sm:max-w-[20ch]"
      style={{ "--n": total + MARKER_STEPS } as CSSProperties}
    >
      {groups.map((group, g) => (
        <span key={g} className={group.mark === "hl" ? "lane-marker" : undefined}>
          {group.pieces.map((piece, i) => {
            if (piece.kind === "space") return piece.text;
            if (piece.kind === "chip") {
              return (
                <span
                  key={i}
                  aria-hidden="true"
                  data-chip={piece.index}
                  className={`lane-chip mr-[0.18em] inline-flex size-[0.82em] shrink-0 translate-y-[0.06em] items-center justify-center rounded-[0.18em] align-baseline ${chipFill[piece.lane]}`}
                  style={{ "--tilt": chipTilt[piece.lane] } as CSSProperties}
                >
                  <svg viewBox="0 0 24 24" fill="white" className="size-[0.55em]">
                    <path d={glyph[piece.lane]} />
                  </svg>
                </span>
              );
            }
            return (
              <span
                key={i}
                className="statement-word"
                style={{ "--i": piece.index } as CSSProperties}
              >
                {piece.text}
              </span>
            );
          })}
        </span>
      ))}
    </p>
  );
}

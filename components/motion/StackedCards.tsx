"use client";

import {
  Children,
  createRef,
  useMemo,
  type ReactNode,
  type RefObject,
} from "react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "motion/react";
import { useScrub } from "@/components/motion/useScrub";

/** DESIGN.md §7.6: top offsets 96 / 112 / 128px. */
const TOP = 96;
const STEP = 16;

/** How far the arriving card has travelled before the one beneath is fully dim. */
const ARRIVED = 0.8;

type CardRef = RefObject<HTMLDivElement | null>;

function StackedCard({
  children,
  index,
  selfRef,
  nextRef,
  on,
}: {
  children: ReactNode;
  index: number;
  selfRef: CardRef;
  nextRef: CardRef | undefined;
  on: boolean;
}) {
  // A sticky card stops moving the moment it pins, so its own box cannot
  // measure how far it has been covered — it would read 0 for the whole
  // stack. The card arriving over it is still travelling, so the dim is
  // scrubbed against that instead: 0 as the next card's top enters at the
  // foot of the screen, 1 as it reaches the top. Clamped, so a card that is
  // merely in view is never dimmed (decision I).
  const { scrollYProgress } = useScroll({
    target: nextRef ?? selfRef,
    offset: ["start end", "start start"],
  });
  const scale = useTransform(scrollYProgress, [0, ARRIVED], [1, 0.96], {
    clamp: true,
  });
  const brightness = useTransform(scrollYProgress, [0, ARRIVED], [1, 0.7], {
    clamp: true,
  });
  const filter = useMotionTemplate`brightness(${brightness})`;

  if (!on) return <div ref={selfRef}>{children}</div>;

  return (
    <motion.div
      ref={selfRef}
      // DESIGN.md §6: the one shadow in the system, and this is what it is
      // for — without an edge, a card sliding over another reads as one
      // tall card rather than two.
      className="sticky rounded-card shadow-stack"
      style={{
        top: TOP + index * STEP,
        zIndex: index,
        // The last card has nothing arriving over it, so it never dims.
        ...(nextRef ? { scale, filter } : {}),
      }}
    >
      {children}
    </motion.div>
  );
}

/**
 * DESIGN.md §7.6. Below 1024px, and whenever stillness is asked for, the
 * children are returned as the plain vertical list they already are.
 */
export function StackedCards({ children }: { children: ReactNode }) {
  const on = useScrub(1024);
  const cards = Children.toArray(children);
  const refs = useMemo(
    () => cards.map(() => createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cards.length],
  );

  return (
    <div className={on ? "" : "space-y-6 md:space-y-8"}>
      {cards.map((card, i) => (
        <StackedCard
          key={i}
          index={i}
          selfRef={refs[i]}
          nextRef={refs[i + 1]}
          on={on}
        >
          {card}
        </StackedCard>
      ))}
    </div>
  );
}

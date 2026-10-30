import type { CSSProperties } from "react";
import type { Profile } from "@/lib/content";

/**
 * DESIGN.md §7.1. Server-rendered so it is already painted when the page
 * arrives, and driven entirely by CSS: there is no state to hydrate and
 * nothing to wait for. The page underneath is fully rendered and readable —
 * the overlay is aria-hidden, takes no pointer events, and lifts itself.
 */
export function Intro({ profile }: { profile: Profile }) {
  const greetings = profile.greetings;

  return (
    <div className="intro" aria-hidden="true">
      <p className="intro-greetings">
        {greetings.map((greeting, i) => (
          <span
            key={greeting.text}
            className="intro-greeting"
            lang={greeting.lang}
            dir={greeting.dir}
            data-last={i === greetings.length - 1 ? "" : undefined}
            style={{ "--i": i } as CSSProperties}
          >
            {greeting.text}
          </span>
        ))}
      </p>
      <span className="intro-grid" />
    </div>
  );
}

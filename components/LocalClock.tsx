"use client";

import { useEffect, useState } from "react";

/**
 * DESIGN.md §7.4. Rendered only after mount: the server has no business
 * guessing the reader's clock, and the city alone holds the space.
 *
 * Two shapes, one source. "full" is the hero's `Jakarta · WIB · 07:12:34`;
 * "compact" is the contact card's `Jakarta · 07:12 WIB`, which drops the
 * seconds because nothing there is ticking for the reader to watch.
 */
export function LocalClock({
  city,
  zone,
  timeZone,
  ariaLabel,
  variant = "full",
  className = "font-mono text-meta text-ink-2",
}: {
  city: string;
  zone: string;
  timeZone: string;
  ariaLabel: string;
  variant?: "full" | "compact";
  className?: string;
}) {
  const [time, setTime] = useState<{ hm: string; s: string } | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-GB", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => {
      const [hh, mm, ss] = format.format(new Date()).split(":");
      setTime({ hm: `${hh}:${mm}`, s: ss });
    };
    tick();
    const id = window.setInterval(tick, variant === "compact" ? 15_000 : 1000);
    return () => window.clearInterval(id);
  }, [timeZone, variant]);

  if (variant === "compact") {
    return (
      <p className={className} aria-label={ariaLabel}>
        {city}
        {time ? (
          <>
            {" · "}
            <span className="tabular-nums">{time.hm}</span> {zone}
          </>
        ) : null}
      </p>
    );
  }

  return (
    <p className={className} aria-label={ariaLabel}>
      {city} · {zone}
      {time ? (
        <>
          {" · "}
          <span className="tabular-nums text-ink">{time.hm}</span>
          <span className="tabular-nums">:{time.s}</span>
        </>
      ) : null}
    </p>
  );
}

"use client";

import { useEffect, useState } from "react";

/**
 * DESIGN.md §7.4. Rendered only after mount: the server has no business
 * guessing the reader's clock, and the label alone holds the space.
 */
export function LocalClock({
  label,
  timeZone,
  ariaLabel,
}: {
  label: string;
  timeZone: string;
  ariaLabel: string;
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
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timeZone]);

  return (
    <p className="font-mono text-meta text-ink-2" aria-label={ariaLabel}>
      {label}
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

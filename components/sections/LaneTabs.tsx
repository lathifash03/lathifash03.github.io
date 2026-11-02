"use client";

import { useRef, useState } from "react";
import { SkillGraph } from "@/components/sections/SkillGraph";
import type { Asset, LaneId, Profile, Ui } from "@/lib/content";

const laneTint: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-ink",
  sw: "bg-lane-sw-tint text-ink",
  wr: "bg-lane-wr-tint text-ink",
};

/** Same pair as a tag pill elsewhere: tint fill, strong text (DESIGN.md §4). */
const laneSkill: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-lane-ai-strong",
  sw: "bg-lane-sw-tint text-lane-sw-strong",
  wr: "bg-lane-wr-tint text-lane-wr-strong",
};

/**
 * DESIGN.md §4, "Lanes section". A real tablist: arrow keys move the
 * selection, Home and End jump to the ends, and only the selected tab is in
 * the tab order, so a keyboard reader tabs past the whole group in one press
 * rather than three.
 *
 * The panel is rendered for the selected lane only, but every summary exists
 * in the markup of the page's one server-rendered default, so a reader
 * without script still sees a lane described rather than an empty box.
 */
export function LaneTabs({
  lanes,
  photo,
  ui,
}: {
  lanes: Profile["lanes"];
  photo?: Asset;
  ui: Ui;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function select(next: number) {
    const i = (next + lanes.length) % lanes.length;
    setActive(i);
    tabs.current[i]?.focus();
  }

  const lane = lanes[active];
  const skills = lane.skills ?? [];

  return (
    <div>
      <div role="tablist" className="grid gap-3 sm:grid-cols-3">
        {lanes.map((item, i) => {
          const selected = i === active;
          return (
            <button
              key={item.id}
              ref={(node) => {
                tabs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`lane-tab-${item.id}`}
              aria-selected={selected}
              aria-controls="lane-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                  event.preventDefault();
                  select(i + 1);
                } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                  event.preventDefault();
                  select(i - 1);
                } else if (event.key === "Home") {
                  event.preventDefault();
                  select(0);
                } else if (event.key === "End") {
                  event.preventDefault();
                  select(lanes.length - 1);
                }
              }}
              className={`rounded-image border px-5 py-4 text-left text-[1.0625rem] transition-colors duration-200 ${
                selected
                  ? `border-transparent ${laneTint[item.id]}`
                  : "border-line text-ink-2 hover:text-ink"
              }`}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Min height set by the longest summary, so switching tabs never moves
          the page under the reader (DESIGN.md §7.12). */}
      <div
        id="lane-panel"
        role="tabpanel"
        aria-labelledby={`lane-tab-${lane.id}`}
        tabIndex={0}
        className="mt-6"
      >
        <p className="max-w-[68ch] text-ink sm:min-h-[6rem]">{lane.summary}</p>

        {skills.length ? (
          <>
            {/* One list, two jobs: the pills a phone sees, and the plain text
                the graph beside it is a picture of (DESIGN.md §4). */}
            <ul
              aria-label={ui.labels.skills}
              className="mt-5 flex flex-wrap gap-2 md:sr-only"
            >
              {skills.map((skill) => (
                <li
                  key={skill}
                  className={`rounded-full px-3 py-1 font-mono text-[0.75rem] leading-5 ${laneSkill[lane.id]}`}
                >
                  {skill}
                </li>
              ))}
            </ul>
            <SkillGraph skills={skills} lane={lane.id} photo={photo} />
          </>
        ) : null}
      </div>
    </div>
  );
}

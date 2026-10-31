import { Section } from "@/components/ui/Section";
import type { LaneId, Profile, Ui } from "@/lib/content";

/** DESIGN.md §4: each lane card is filled with its own tint. */
const laneCard: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint",
  sw: "bg-lane-sw-tint",
  wr: "bg-lane-wr-tint",
};

const laneRule: Record<LaneId, string> = {
  ai: "bg-lane-ai-strong",
  sw: "bg-lane-sw-strong",
  wr: "bg-lane-wr-strong",
};

/** Unnumbered (decision H). */
export function Lanes({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <Section id="lanes" title={ui.sections.lanes}>
      <ul className="grid gap-6 md:grid-cols-3 md:gap-8">
        {profile.lanes.map((lane) => (
          <li
            key={lane.id}
            data-reveal
            className={`rounded-card p-7 md:p-8 ${laneCard[lane.id]}`}
          >
            <span
              aria-hidden="true"
              className={`block h-0.5 w-10 ${laneRule[lane.id]}`}
            />
            <h3 className="mt-5 text-card text-ink">{lane.title}</h3>
            {/* Body stays ink on the tint (14:1) — the lane colour labels, it
                never sets a paragraph (DESIGN.md §2). */}
            <p className="mt-4 max-w-[48ch] text-ink">{lane.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

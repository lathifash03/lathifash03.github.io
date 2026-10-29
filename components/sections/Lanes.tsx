import { Section } from "@/components/ui/Section";
import type { Profile, Ui } from "@/lib/content";

const laneRule: Record<string, string> = {
  ai: "bg-lane-ai",
  sw: "bg-lane-sw",
  wr: "bg-lane-wr",
};

/** Unnumbered (decision H). */
export function Lanes({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <Section id="lanes" title={ui.sections.lanes}>
      <ul className="grid gap-12 md:grid-cols-3 md:gap-8">
        {profile.lanes.map((lane) => (
          <li key={lane.id}>
            <span
              aria-hidden="true"
              className={`block h-0.5 w-10 ${laneRule[lane.id]}`}
            />
            <h3 className="mt-5 text-card text-ink">{lane.title}</h3>
            <p className="mt-4 max-w-[48ch] text-ink">{lane.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}

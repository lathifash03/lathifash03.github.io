import { LaneTabs } from "@/components/sections/LaneTabs";
import { Section } from "@/components/ui/Section";
import type { LaneId, Profile, Ui } from "@/lib/content";

/** DESIGN.md §2: accents fill a chip; they never colour a word. */
const chip: Record<LaneId, string> = {
  ai: "bg-chip-ai -rotate-6",
  sw: "bg-chip-sw rotate-3",
  wr: "bg-chip-wr -rotate-3",
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

function LaneChip({ lane }: { lane: LaneId }) {
  return (
    <span
      aria-hidden="true"
      className={`mr-[0.18em] inline-flex size-[0.82em] shrink-0 translate-y-[0.06em] items-center justify-center rounded-[0.18em] align-baseline ${chip[lane]}`}
    >
      <svg viewBox="0 0 24 24" fill="white" className="size-[0.55em]">
        <path d={glyph[lane]} />
      </svg>
    </span>
  );
}

/** Unnumbered (decision H). */
export function Lanes({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <Section id="lanes" title={ui.sections.lanes}>
      {/* data-reveal is what ScrollReveals marks shown, and the marker sweep
          hangs off that one attribute (DESIGN.md §7.11). */}
      <p data-reveal className="max-w-[24ch] text-section text-ink sm:max-w-[20ch]">
        {profile.lanesStatement.map((segment, i) => (
          <span key={i} className={segment.mark === "hl" ? "lane-marker" : undefined}>
            {segment.lane ? <LaneChip lane={segment.lane} /> : null}
            {segment.text}
          </span>
        ))}
      </p>

      <div className="mt-14 md:mt-20">
        <LaneTabs lanes={profile.lanes} />
      </div>
    </Section>
  );
}

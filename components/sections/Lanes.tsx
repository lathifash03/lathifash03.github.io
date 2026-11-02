import { LaneStatement } from "@/components/sections/LaneStatement";
import { LaneTabs } from "@/components/sections/LaneTabs";
import { Section } from "@/components/ui/Section";
import type { Profile, Ui } from "@/lib/content";

/** Unnumbered (decision H). */
export function Lanes({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <Section id="lanes" title={ui.sections.lanes}>
      <LaneStatement profile={profile} />

      <div className="mt-14 md:mt-20">
        <LaneTabs lanes={profile.lanes} photo={profile.photo} ui={ui} />
      </div>
    </Section>
  );
}

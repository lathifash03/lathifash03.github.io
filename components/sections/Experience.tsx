import { TimelineRule } from "@/components/motion/TimelineRule";
import { Section } from "@/components/ui/Section";
import {
  localePath,
  type ExperienceItem,
  type LaneId,
  type Locale,
  type Ui,
} from "@/lib/content";

/** DESIGN.md §4: a lane dot inside a tint ring, so the lane reads as colour. */
const laneNode: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-lane-ai",
  sw: "bg-lane-sw-tint text-lane-sw",
  wr: "bg-lane-wr-tint text-lane-wr",
};

/** DESIGN.md §4: year range in mono left, role and bullets right, lane node on a 1px rule. */
export function Experience({
  items,
  ui,
  locale,
}: {
  items: ExperienceItem[];
  ui: Ui;
  locale: Locale;
}) {
  return (
    <Section id="experience" index="04" title={ui.sections.experience}>
      <TimelineRule className="ml-2 md:ml-0">
        <ol className="relative pl-8 md:pl-12">
          {items.map((item) => (
            <li key={item.id} className="relative pb-14 last:pb-0">
              <span
                aria-hidden="true"
                className={`absolute -left-[38px] top-0.5 flex size-5 items-center justify-center rounded-full md:-left-[54px] ${laneNode[item.lane]}`}
              >
                <span className="size-2.5 rounded-full bg-current" />
              </span>
              <div className="grid gap-x-8 gap-y-2 md:grid-cols-12">
                <p className="font-mono text-meta text-ink-2 md:col-span-3 md:pt-1.5">
                  {item.period}
                </p>
                <div className="md:col-span-9">
                  <h3 className="text-[1.375rem] leading-snug text-ink">
                    {item.role}
                  </h3>
                  <p className="mt-1 text-ink-2">
                    {item.org} · {item.place}
                  </p>
                  <ul className="mt-4 max-w-[68ch] space-y-2 text-ink">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span aria-hidden="true" className="text-ink-2">
                          —
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                  {item.caseStudy ? (
                    <a
                      href={localePath(locale, item.caseStudy)}
                      className="group mt-4 inline-flex items-center gap-1.5 text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                    >
                      {ui.actions.readCaseStudy}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-[3px]"
                      >
                        →
                      </span>
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </TimelineRule>
    </Section>
  );
}

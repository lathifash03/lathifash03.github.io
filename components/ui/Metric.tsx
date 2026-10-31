import type { LaneId, Project } from "@/lib/content";

type Metric = NonNullable<Project["metrics"]>[number];

/** DESIGN.md §4, "Metric chip": a tint pill around the number itself. */
const laneChip: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-lane-ai-strong",
  sw: "bg-lane-sw-tint text-lane-sw-strong",
  wr: "bg-lane-wr-tint text-lane-wr-strong",
};

/**
 * DESIGN.md §4 + CLAUDE.md hard rule 2: the caveat is rendered next to the
 * number, never hidden behind a tooltip.
 */
export function MetricBlock({ metric }: { metric: Metric }) {
  return (
    <div>
      <p className="font-mono text-[2rem] leading-tight text-ink">
        {metric.value}
      </p>
      <p className="mt-1 text-ink-2">{metric.label}</p>
      {metric.caveat ? (
        <p className="mt-1 font-mono text-meta text-ink-2">{metric.caveat}</p>
      ) : null}
    </div>
  );
}

/**
 * The inline form used by the data rows (decision E). The number sits in a
 * lane chip; the caveat still travels with it in plain text, never inside the
 * chip and never behind a hover (CLAUDE.md hard rule 2).
 */
export function MetricInline({ metric, lane }: { metric: Metric; lane: LaneId }) {
  return (
    <p className="text-ink">
      <span
        className={`mr-2 inline-block rounded-full px-2.5 py-0.5 font-mono text-[1.0625rem] ${laneChip[lane]}`}
      >
        {metric.value}
      </span>
      <span className="text-ink-2">{metric.label}</span>
      {metric.caveat ? (
        <span className="font-mono text-meta text-ink-2"> · {metric.caveat}</span>
      ) : null}
    </p>
  );
}

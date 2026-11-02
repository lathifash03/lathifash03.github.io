import type { LaneId, Project } from "@/lib/content";

type Metric = NonNullable<Project["metrics"]>[number];

/** DESIGN.md §4, "Metric chip": a tint pill around the number itself. */
const laneChip: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-lane-ai-strong",
  sw: "bg-lane-sw-tint text-lane-sw-strong",
  wr: "bg-lane-wr-tint text-lane-wr-strong",
};

/**
 * DESIGN.md §4, "Metric row". The compact form a stacked research card uses:
 * at most three to a row, each one the number in its lane chip with the label
 * under it — and the caveat under that, in the card, never behind a hover
 * (CLAUDE.md hard rule 2). A fourth metric wraps onto a second row rather
 * than being dropped.
 *
 * A row of two takes half the card each rather than leaving a third column
 * empty: the labels are sentences, and a narrower chip is a taller card.
 */
const columns: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

export function MetricChips({
  metrics,
  lane,
}: {
  metrics: NonNullable<Project["metrics"]>;
  lane: LaneId;
}) {
  if (!metrics.length) return null;
  return (
    <ul className={`grid gap-3 ${columns[Math.min(metrics.length, 3)]}`}>
      {metrics.map((metric) => (
        <li key={metric.label} className="rounded-image bg-surface p-4">
          <p>
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[1.0625rem] ${laneChip[lane]}`}
            >
              {metric.value}
            </span>
          </p>
          <p className="mt-2 text-meta leading-snug text-ink">{metric.label}</p>
          {metric.caveat ? (
            <p className="mt-1.5 font-mono text-[0.75rem] leading-5 text-ink-2">
              {metric.caveat}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
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

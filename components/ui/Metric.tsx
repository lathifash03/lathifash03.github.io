import type { Project } from "@/lib/content";

type Metric = NonNullable<Project["metrics"]>[number];

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

/** The inline form used by the data rows (decision E). */
export function MetricInline({ metric }: { metric: Metric }) {
  return (
    <p className="text-ink">
      <span className="font-mono text-[1.25rem] text-ink">{metric.value}</span>{" "}
      <span className="text-ink-2">{metric.label}</span>
      {metric.caveat ? (
        <span className="font-mono text-meta text-ink-2"> · {metric.caveat}</span>
      ) : null}
    </p>
  );
}

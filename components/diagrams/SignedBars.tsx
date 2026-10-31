import type { Project } from "@/lib/content";

type Chart = NonNullable<Project["chart"]>;

/**
 * A small signed bar chart, drawn from the project's own numbers
 * (DESIGN.md §4). The zero line is always drawn, because a chart whose values
 * cross zero is unreadable without it: positive bars grow right from it in the
 * ai strong colour, negative bars grow left in the wr strong colour.
 *
 * Every bar prints the figure exactly as content wrote it (`−0.205`, `−0,205`),
 * so nothing is rounded or re-punctuated here.
 */
export function SignedBars({ chart }: { chart: Chart }) {
  const rowH = 30;
  const labelW = 62;
  const valueW = 58;
  const w = 320;
  const plotX = labelW;
  const plotW = w - labelW - valueW;

  const values = chart.bars.map((bar) => bar.value);
  const max = Math.max(...values, 0);
  const min = Math.min(...values, 0);
  const span = max - min || 1;
  /** Two decimals is well under a device pixel, and keeps the markup legible. */
  const px = (n: number) => Math.round(n * 100) / 100;
  const zeroX = px(plotX + (plotW * (0 - min)) / span);

  const height = rowH * chart.bars.length + 20;
  const spoken = [
    chart.title,
    ...chart.bars.map((bar) => `${bar.label} ${bar.display}`),
  ].join(". ");

  return (
    <figure>
      <svg
        viewBox={`0 0 ${w} ${height}`}
        role="img"
        aria-label={spoken}
        className="h-auto w-full max-w-[420px]"
        xmlns="http://www.w3.org/2000/svg"
      >
        {chart.bars.map((bar, i) => {
          const y = i * rowH + 6;
          const x = px(plotX + (plotW * (Math.min(bar.value, 0) - min)) / span);
          const barW = px(Math.max((plotW * Math.abs(bar.value)) / span, 1));
          const negative = bar.value < 0;

          return (
            <g key={bar.label}>
              <text
                x={0}
                y={y + 12}
                className="font-mono"
                fontSize="11"
                fill="var(--ink-2)"
              >
                {bar.label}
              </text>
              <rect
                x={x}
                y={y + 2}
                width={barW}
                height={13}
                rx={3}
                fill={
                  negative ? "var(--lane-wr-strong)" : "var(--lane-ai-strong)"
                }
              />
              <text
                x={w}
                y={y + 12}
                textAnchor="end"
                className="font-mono"
                fontSize="11"
                fill="var(--ink)"
              >
                {bar.display}
              </text>
            </g>
          );
        })}
        {/* Drawn last so it sits over the bars it divides. */}
        <line
          x1={zeroX}
          x2={zeroX}
          y1={2}
          y2={height - 16}
          stroke="var(--ink)"
          strokeWidth="1"
        />
        <text
          x={zeroX}
          y={height - 4}
          textAnchor="middle"
          className="font-mono"
          fontSize="10"
          fill="var(--ink-2)"
        >
          0
        </text>
      </svg>
      <figcaption className="mt-2 font-mono text-meta text-ink-2">
        {chart.title}
      </figcaption>
    </figure>
  );
}

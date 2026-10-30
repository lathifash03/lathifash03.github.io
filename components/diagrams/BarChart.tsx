import type { ChartFigure } from "@/lib/content";
import { lineHeight, wrap, type DiagramVariant } from "./layout";

/**
 * An evaluation chart, drawn from the numbers in the case study's frontmatter.
 *
 * Every bar is ink; only the bar the surrounding text is about is drawn in the
 * lane colour, so the colour means "this one" rather than decorating the
 * categories. Each bar carries its own figure as content wrote it (`6 / 6`,
 * `57%`), so nothing is rounded into a label.
 */
function Chart({ figure, variant }: { figure: ChartFigure; variant: DiagramVariant }) {
  const wide = variant === "wide";

  const w = wide ? 640 : 300;
  const fs = wide ? 14 : 15;
  const fsSm = wide ? 12.5 : 13.5;
  const barH = wide ? 24 : 16;
  const gap = wide ? 14 : 10;

  // Wide: label | track | value on one line. Phone: label and value on their
  // own line with the track full width underneath.
  const labelW = wide ? 168 : 0;
  const valueW = wide ? 70 : 0;
  const trackX = wide ? labelW + gap : 0;
  const trackW = wide ? w - trackX - gap - valueW : w;
  const rowH = wide ? barH + 26 : fs + barH + 20;

  const bars = figure.bars;
  const chartBottom = rowH * bars.length - (wide ? 26 : 20);

  const ruleX = figure.rule
    ? trackX + (trackW * figure.rule.value) / figure.rule.of
    : 0;
  const ruleLines = figure.rule ? wrap(figure.rule.label, fsSm, w - 8, true) : [];
  const ruleBlockH = figure.rule ? 10 + lineHeight(fsSm) * ruleLines.length : 0;
  const height = chartBottom + ruleBlockH;

  const spoken = [
    figure.title,
    figure.axis,
    ...bars.map((bar) => `${bar.label} ${bar.display}`),
    ...(figure.rule ? [figure.rule.label] : []),
  ].join(". ");

  return (
    <svg
      viewBox={`0 0 ${w} ${height}`}
      role="img"
      aria-label={spoken}
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className="font-sans" fill="var(--ink)">
        {bars.map((bar, i) => {
          const top = i * rowH;
          const barY = wide ? top : top + fs + 6;
          const fill = bar.highlight ? "var(--lane-ai)" : "var(--ink)";
          const filled = Math.max(0, (trackW * bar.value) / bar.of);

          return (
            <g key={bar.label}>
              <text
                x={wide ? labelW : 0}
                y={wide ? barY + barH / 2 + fs * 0.35 : top + fs}
                textAnchor={wide ? "end" : "start"}
                fontSize={fs}
              >
                {bar.label}
              </text>
              <rect x={trackX} y={barY} width={trackW} height={barH} rx="3" fill="var(--surface-2)" />
              {filled > 0 ? (
                <rect x={trackX} y={barY} width={filled} height={barH} rx="3" fill={fill} />
              ) : null}
              <text
                x={w}
                y={wide ? barY + barH / 2 + fsSm * 0.4 : top + fs}
                textAnchor="end"
                className="font-mono"
                fontSize={fsSm}
                fill={bar.highlight ? "var(--lane-ai)" : "var(--ink-2)"}
              >
                {bar.display}
              </text>
            </g>
          );
        })}

        {figure.rule ? (
          <g>
            <line
              x1={ruleX}
              y1={-4}
              x2={ruleX}
              y2={chartBottom + 4}
              stroke="var(--ink-2)"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            {ruleLines.map((line, i) => (
              <text
                key={line}
                x={w}
                y={chartBottom + 10 + lineHeight(fsSm) * (i + 1) - 4}
                textAnchor="end"
                className="font-mono"
                fontSize={fsSm}
                fill="var(--ink-2)"
              >
                {line}
              </text>
            ))}
          </g>
        ) : null}
      </g>
    </svg>
  );
}

export function BarChart({ figure }: { figure: ChartFigure }) {
  return (
    <>
      <div className="sm:hidden">
        <Chart figure={figure} variant="phone" />
      </div>
      <div className="hidden sm:block">
        <Chart figure={figure} variant="wide" />
      </div>
    </>
  );
}

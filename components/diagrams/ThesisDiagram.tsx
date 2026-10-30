import type { ReactNode } from "react";
import type { Ui } from "@/lib/content";
import { Lines } from "./Lines";
import { lineHeight, metrics, wrap, type DiagramVariant } from "./layout";

/**
 * The four-phase hybrid pipeline of the thesis, redrawn from the project's own
 * figure. The phases are numbered because the order is the point. Measured the
 * same way as the kg-agent drawing, so it also has a phone size (decision 5).
 */
export function ThesisDiagram({
  ui,
  variant = "wide",
}: {
  ui: Ui;
  variant?: DiagramVariant;
}) {
  const d = ui.diagrams.thesis;
  const m = metrics[variant];
  const arrow = `th-arrow-${variant}`;

  const boxW = m.w - m.inset * 2;
  const innerW = boxW - m.pad * 2;
  const cx = m.w / 2;
  const lhT = lineHeight(m.fs);
  const lhD = lineHeight(m.fsSm);

  const parts: ReactNode[] = [];
  let y = 0;

  const arrowDown = (key: string) => {
    const from = y;
    y += m.gap;
    parts.push(
      <line
        key={key}
        x1={cx}
        y1={from}
        x2={cx}
        y2={y}
        stroke="var(--ink-2)"
        strokeWidth="1.5"
        markerEnd={`url(#${arrow})`}
      />,
    );
  };

  const pillW = Math.round(boxW * 0.62);
  const pillH = lhT + m.pad * 1.6;
  parts.push(
    <g key="input">
      <rect x={cx - pillW / 2} y={y} width={pillW} height={pillH} rx="12" fill="var(--paper)" />
      <text x={cx} y={y + pillH / 2 + m.fs * 0.35} textAnchor="middle" fontSize={m.fs}>
        {d.input}
      </text>
    </g>,
  );
  y += pillH;

  const phases = [
    { title: d.phase1, detail: d.phase1Detail },
    { title: d.phase2, detail: d.phase2Detail },
    { title: d.phase3, detail: d.phase3Detail },
    { title: d.phase4, detail: d.phase4Detail },
  ];

  phases.forEach((phase, i) => {
    arrowDown(`a${i}`);
    const titleLines = wrap(phase.title, m.fs, innerW);
    const detailLines = wrap(phase.detail, m.fsSm, innerW);
    const top = y;
    const numberBase = top + m.pad + m.fsSm;
    const titleBase = numberBase + lhT;
    const detailBase = titleBase + lhD * titleLines.length;
    const h = detailBase + lhD * (detailLines.length - 1) + m.pad - top;

    parts.push(
      <g key={phase.title}>
        <rect x={m.inset} y={top} width={boxW} height={h} rx="16" fill="var(--paper)" />
        <text
          x={m.inset + m.pad}
          y={numberBase}
          className="font-mono"
          fontSize={m.fsSm}
          fill="var(--lane-ai)"
        >
          {`0${i + 1}`}
        </text>
        <Lines lines={titleLines} x={m.inset + m.pad} y={titleBase} fontSize={m.fs} />
        <Lines
          lines={detailLines}
          x={m.inset + m.pad}
          y={detailBase}
          fontSize={m.fsSm}
          fill="var(--ink-2)"
        />
      </g>,
    );
    y = top + h;
  });

  arrowDown("a-out");
  const outH = lhT + m.pad * 1.8;
  parts.push(
    <g key="output">
      <rect x={cx - pillW / 2} y={y} width={pillW} height={outH} rx="12" fill="var(--ink)" />
      <text
        x={cx}
        y={y + outH / 2 + m.fs * 0.35}
        textAnchor="middle"
        fontSize={m.fs}
        fill="var(--paper)"
      >
        {d.output}
      </text>
    </g>,
  );
  y += outH;

  return (
    <svg
      viewBox={`0 0 ${m.w} ${y}`}
      role="img"
      aria-label={d.description}
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)" />
        </marker>
      </defs>
      <g className="font-sans" fill="var(--ink)">
        {parts}
      </g>
    </svg>
  );
}

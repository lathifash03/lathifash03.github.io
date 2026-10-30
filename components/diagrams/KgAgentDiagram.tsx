import type { ReactNode } from "react";
import type { Ui } from "@/lib/content";
import { Lines } from "./Lines";
import { lineHeight, metrics, wrap, type DiagramVariant } from "./layout";

/**
 * The kg-agent verify-then-retry loop, redrawn from the project's own pipeline
 * figure. Flat fills and tone steps only (DESIGN.md §6); the lane colour marks
 * the gates and the retry path. All words come from ui.diagrams.kgAgent.
 *
 * The layout is measured rather than hard-coded, so the same drawing can be
 * dealt at the wide and the phone size (decision 5).
 */
export function KgAgentDiagram({
  ui,
  variant = "wide",
}: {
  ui: Ui;
  variant?: DiagramVariant;
}) {
  const d = ui.diagrams.kgAgent;
  const m = metrics[variant];
  const arrow = `kg-arrow-${variant}`;
  const laneArrow = `kg-arrow-lane-${variant}`;

  const boxW = m.w - m.inset * 2;
  const innerW = boxW - m.pad * 2;
  const cx = m.w / 2;
  const lhT = lineHeight(m.fs);
  const lhD = lineHeight(m.fsSm);
  const padY = Math.round(m.pad * 0.8);

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

  // Query
  const pillW = Math.round(boxW * 0.62);
  const pillH = lhT + m.pad * 1.6;
  parts.push(
    <g key="query">
      <rect x={cx - pillW / 2} y={y} width={pillW} height={pillH} rx="12" fill="var(--paper)" />
      <text x={cx} y={y + pillH / 2 + m.fs * 0.35} textAnchor="middle" fontSize={m.fs}>
        {d.query}
      </text>
    </g>,
  );
  y += pillH;
  arrowDown("a1");

  // Retrieval, with the graph it reads from
  const retrievalTop = y;
  const retrievalTitle = y + m.pad + m.fs;
  const retrievalDetail = retrievalTitle + lhD;
  const chipTop = retrievalDetail + 10;
  const chipH = lhD + m.pad;
  const retrievalH = chipTop + chipH + m.pad - retrievalTop;
  parts.push(
    <g key="retrieval">
      <rect x={m.inset} y={retrievalTop} width={boxW} height={retrievalH} rx="16" fill="var(--paper)" />
      <text x={cx} y={retrievalTitle} textAnchor="middle" fontSize={m.fs}>
        {d.retrieval}
      </text>
      <text
        x={cx}
        y={retrievalDetail}
        textAnchor="middle"
        className="font-mono"
        fontSize={m.fsSm}
        fill="var(--ink-2)"
      >
        {d.retrievalDetail}
      </text>
      <rect
        x={m.inset + m.pad}
        y={chipTop}
        width={innerW}
        height={chipH}
        rx="8"
        fill="var(--surface)"
      />
      <text x={cx} y={chipTop + chipH / 2 + m.fsSm * 0.35} textAnchor="middle" fontSize={m.fsSm}>
        {d.graph}
        <tspan className="font-mono" fill="var(--ink-2)">
          {"  "}
          {d.graphEngine}
        </tspan>
      </text>
    </g>,
  );
  y = retrievalTop + retrievalH;
  arrowDown("a2");

  // Draft
  const draftTop = y;
  const draftH = m.pad + m.fs + lhD + m.pad;
  parts.push(
    <g key="draft">
      <rect x={m.inset} y={draftTop} width={boxW} height={draftH} rx="16" fill="var(--paper)" />
      <text x={cx} y={draftTop + m.pad + m.fs} textAnchor="middle" fontSize={m.fs}>
        {d.draft}
      </text>
      <text
        x={cx}
        y={draftTop + m.pad + m.fs + lhD}
        textAnchor="middle"
        className="font-mono"
        fontSize={m.fsSm}
        fill="var(--ink-2)"
      >
        {d.draftEngine}
      </text>
    </g>,
  );
  y = draftTop + draftH;
  arrowDown("a3");

  // The three gates
  parts.push(
    <text key="gates-label" x={m.inset} y={y + m.fsSm} fontSize={m.fsSm} fill="var(--ink-2)">
      {d.gates}
    </text>,
  );
  y += m.fsSm + 10;

  const gatesTop = y;
  const gates = [
    { title: d.faithfulness, detail: d.faithfulnessDetail },
    { title: d.trust, detail: d.trustDetail },
    { title: d.temporal, detail: d.temporalDetail },
  ];
  for (const gate of gates) {
    const detailLines = wrap(gate.detail, m.fsSm, innerW - 12);
    const rowH = padY * 2 + m.fs + lhD * detailLines.length;
    parts.push(
      <g key={gate.title}>
        <rect x={m.inset} y={y} width={boxW} height={rowH} rx="10" fill="var(--paper)" />
        <rect x={m.inset} y={y} width="4" height={rowH} rx="2" fill="var(--lane-ai)" />
        <text x={m.inset + m.pad} y={y + padY + m.fs} fontSize={m.fs}>
          {gate.title}
        </text>
        <Lines
          lines={detailLines}
          x={m.inset + m.pad}
          y={y + padY + m.fs + lhD}
          fontSize={m.fsSm}
          fill="var(--ink-2)"
        />
      </g>,
    );
    y += rowH + 8;
  }
  const gatesBottom = y - 8;

  // Retry: a failed gate goes back to retrieval
  const channel = 4;
  parts.push(
    <path
      key="retry-path"
      d={`M${m.inset} ${(gatesTop + gatesBottom) / 2} H${channel} V${retrievalDetail - 4} H${m.inset - 4}`}
      fill="none"
      stroke="var(--lane-ai)"
      strokeWidth="1.5"
      strokeDasharray="4 4"
      markerEnd={`url(#${laneArrow})`}
    />,
  );
  const retryLines = wrap(d.retry, m.fsSm, boxW);
  parts.push(
    <Lines
      key="retry-label"
      lines={retryLines}
      x={cx}
      y={y + m.fsSm + 2}
      fontSize={m.fsSm}
      textAnchor="middle"
      fill="var(--lane-ai)"
    />,
  );
  y += m.fsSm + 2 + lhD * (retryLines.length - 1) + 6;
  arrowDown("a4");

  // Verified answer
  const outH = lhT + m.pad * 1.8;
  parts.push(
    <g key="verified">
      <rect x={cx - pillW / 2} y={y} width={pillW} height={outH} rx="12" fill="var(--ink)" />
      <text
        x={cx}
        y={y + outH / 2 + m.fs * 0.35}
        textAnchor="middle"
        fontSize={m.fs}
        fill="var(--paper)"
      >
        {d.verified}
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
        <marker id={laneArrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--lane-ai)" />
        </marker>
      </defs>
      <g className="font-sans" fill="var(--ink)">
        {parts}
      </g>
    </svg>
  );
}

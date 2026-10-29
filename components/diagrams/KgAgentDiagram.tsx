import type { Ui } from "@/lib/content";

const ARROW = "url(#kg-arrow)";

/**
 * The kg-agent verify-then-retry loop, redrawn from the project's own pipeline
 * figure. Flat fills and tone steps only (DESIGN.md §6); the lane colour marks
 * the gates and the retry path. All words come from ui.diagrams.kgAgent.
 */
export function KgAgentDiagram({ ui }: { ui: Ui }) {
  const d = ui.diagrams.kgAgent;

  const gates = [
    { y: 294, title: d.faithfulness, detail: d.faithfulnessDetail },
    { y: 340, title: d.trust, detail: d.trustDetail },
    { y: 386, title: d.temporal, detail: d.temporalDetail },
  ];

  return (
    <svg
      viewBox="0 0 360 540"
      role="img"
      aria-label={d.description}
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="kg-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)" />
        </marker>
        <marker
          id="kg-arrow-lane"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--lane-ai)" />
        </marker>
      </defs>

      <g className="font-sans" fill="var(--ink)" fontSize="14">
        <rect x="90" y="0" width="180" height="40" rx="12" fill="var(--paper)" />
        <text x="180" y="25" textAnchor="middle">
          {d.query}
        </text>
        <line x1="180" y1="40" x2="180" y2="62" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd={ARROW} />

        <rect x="28" y="66" width="304" height="92" rx="16" fill="var(--paper)" />
        <text x="180" y="92" textAnchor="middle">
          {d.retrieval}
        </text>
        <text x="180" y="110" textAnchor="middle" className="font-mono" fontSize="12" fill="var(--ink-2)">
          {d.retrievalDetail}
        </text>
        <rect x="48" y="120" width="264" height="28" rx="8" fill="var(--surface)" />
        <text x="180" y="139" textAnchor="middle" fontSize="13">
          {d.graph}
          <tspan className="font-mono" fill="var(--ink-2)" fontSize="12">
            {"  "}
            {d.graphEngine}
          </tspan>
        </text>
        <line x1="180" y1="158" x2="180" y2="182" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd={ARROW} />

        <rect x="28" y="186" width="304" height="58" rx="16" fill="var(--paper)" />
        <text x="180" y="212" textAnchor="middle">
          {d.draft}
        </text>
        <text x="180" y="230" textAnchor="middle" className="font-mono" fontSize="12" fill="var(--ink-2)">
          {d.draftEngine}
        </text>
        <line x1="180" y1="244" x2="180" y2="268" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd={ARROW} />

        <text x="28" y="284" fontSize="13" fill="var(--ink-2)">
          {d.gates}
        </text>
        {gates.map((gate) => (
          <g key={gate.title}>
            <rect x="28" y={gate.y} width="304" height="38" rx="10" fill="var(--paper)" />
            <rect x="28" y={gate.y} width="4" height="38" rx="2" fill="var(--lane-ai)" />
            <text x="44" y={gate.y + 17} fontSize="13">
              {gate.title}
            </text>
            <text x="44" y={gate.y + 31} fontSize="12" fill="var(--ink-2)">
              {gate.detail}
            </text>
          </g>
        ))}

        {/* retry: a failed gate goes back to retrieval */}
        <path
          d="M28 405 H12 V112 H22"
          fill="none"
          stroke="var(--lane-ai)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          markerEnd="url(#kg-arrow-lane)"
        />
        <text x="180" y="446" textAnchor="middle" fontSize="12" fill="var(--lane-ai)">
          {d.retry}
        </text>

        <line x1="180" y1="456" x2="180" y2="476" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd={ARROW} />
        <rect x="90" y="480" width="180" height="44" rx="12" fill="var(--ink)" />
        <text x="180" y="507" textAnchor="middle" fill="var(--paper)">
          {d.verified}
        </text>
      </g>
    </svg>
  );
}

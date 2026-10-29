import type { Ui } from "@/lib/content";

const ARROW = "url(#th-arrow)";

/**
 * The four-phase hybrid pipeline of the thesis, redrawn from the project's own
 * figure. The phases are numbered because the order is the point.
 */
export function ThesisDiagram({ ui }: { ui: Ui }) {
  const d = ui.diagrams.thesis;

  const phases = [
    { title: d.phase1, detail: d.phase1Detail },
    { title: d.phase2, detail: d.phase2Detail },
    { title: d.phase3, detail: d.phase3Detail },
    { title: d.phase4, detail: d.phase4Detail },
  ];

  return (
    <svg
      viewBox="0 0 360 548"
      role="img"
      aria-label={d.description}
      className="h-auto w-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <marker
          id="th-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" fill="var(--ink-2)" />
        </marker>
      </defs>

      <g className="font-sans" fill="var(--ink)" fontSize="14">
        <rect x="90" y="0" width="180" height="40" rx="12" fill="var(--paper)" />
        <text x="180" y="25" textAnchor="middle">
          {d.input}
        </text>

        {phases.map((phase, i) => {
          const y = 64 + i * 104;
          return (
            <g key={phase.title}>
              <line
                x1="180"
                y1={y - 24}
                x2="180"
                y2={y - 4}
                stroke="var(--ink-2)"
                strokeWidth="1.5"
                markerEnd={ARROW}
              />
              <rect x="28" y={y} width="304" height="80" rx="16" fill="var(--paper)" />
              <text x="48" y={y + 28} className="font-mono" fontSize="12" fill="var(--lane-ai)">
                {`0${i + 1}`}
              </text>
              <text x="48" y={y + 50} fontSize="14">
                {phase.title}
              </text>
              <text x="48" y={y + 68} fontSize="12" fill="var(--ink-2)">
                {phase.detail}
              </text>
            </g>
          );
        })}

        <line x1="180" y1="456" x2="180" y2="480" stroke="var(--ink-2)" strokeWidth="1.5" markerEnd={ARROW} />
        <rect x="90" y="484" width="180" height="44" rx="12" fill="var(--ink)" />
        <text x="180" y="511" textAnchor="middle" fill="var(--paper)">
          {d.output}
        </text>
      </g>
    </svg>
  );
}

import type { Ui } from "@/lib/content";
import { KgAgentDiagram } from "./KgAgentDiagram";
import { ThesisDiagram } from "./ThesisDiagram";

export type DiagramName = "kgAgent" | "thesis";

const drawings = { kgAgent: KgAgentDiagram, thesis: ThesisDiagram };

/**
 * Picks the drawing's size from the viewport (decision 5). Both are in the
 * markup; `display: none` keeps the hidden one out of the accessibility tree,
 * so the figure is announced once.
 *
 * `narrow` takes the phone drawing at every width. It is for a column that is
 * narrow on a wide screen — the research card's panel — where the wide
 * drawing would have to be scaled down until its labels fell under 11px; the
 * phone drawing is the same figure dealt for a narrow measure.
 */
export function Diagram({
  name,
  ui,
  narrow = false,
}: {
  name: DiagramName;
  ui: Ui;
  narrow?: boolean;
}) {
  const Drawing = drawings[name];
  if (narrow) return <Drawing ui={ui} variant="phone" />;
  return (
    <>
      <div className="sm:hidden">
        <Drawing ui={ui} variant="phone" />
      </div>
      <div className="hidden sm:block">
        <Drawing ui={ui} variant="wide" />
      </div>
    </>
  );
}

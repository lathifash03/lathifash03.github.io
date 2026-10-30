import type { Ui } from "@/lib/content";
import { KgAgentDiagram } from "./KgAgentDiagram";
import { ThesisDiagram } from "./ThesisDiagram";

export type DiagramName = "kgAgent" | "thesis";

const drawings = { kgAgent: KgAgentDiagram, thesis: ThesisDiagram };

/**
 * Picks the drawing's size from the viewport (decision 5). Both are in the
 * markup; `display: none` keeps the hidden one out of the accessibility tree,
 * so the figure is announced once.
 */
export function Diagram({ name, ui }: { name: DiagramName; ui: Ui }) {
  const Drawing = drawings[name];
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

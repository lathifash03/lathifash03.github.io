import { marked } from "marked";
import { BarChart } from "@/components/diagrams/BarChart";
import { Diagram } from "@/components/diagrams/Diagram";
import { Picture } from "@/components/ui/Picture";
import { FIGURE_MARKER, type CaseStudy, type Figure, type Ui } from "@/lib/content";

function toHtml(markdown: string): string {
  const html = marked.parse(markdown, { async: false, gfm: true });
  // Give every table its own scroll container; at 390px they are wider than
  // the measure and must not push the page sideways (DESIGN.md §5).
  return html
    .replace(/<table>/g, '<div class="table-scroll"><table>')
    .replace(/<\/table>/g, "</table></div>");
}

function FigureBlock({ figure, ui }: { figure: Figure; ui: Ui }) {
  // A figure whose only image is withheld leaves no empty box behind (decision B).
  if (figure.kind === "images" && !figure.images.length) return null;

  return (
    <figure className="my-14">
      <div className="rounded-image bg-surface-2 p-5 md:p-8">
        {figure.kind === "diagram" ? (
          // A vertical drawing stretched to the full measure would set its
          // labels larger than the headings; it keeps its own column instead.
          <div className="mx-auto max-w-[420px]">
            <Diagram name={figure.diagram} ui={ui} />
          </div>
        ) : null}

        {figure.kind === "chart" ? (
          <>
            <p className="text-ink">{figure.title}</p>
            <p className="mt-1 font-mono text-meta text-ink-2">{figure.axis}</p>
            <div className="mt-7">
              <BarChart figure={figure} />
            </div>
          </>
        ) : null}

        {figure.kind === "images" && figure.images.length ? (
          <ul
            className={`grid gap-4 ${figure.images.length > 1 ? "sm:grid-cols-2" : ""}`}
          >
            {figure.images.map((image) => (
              <li key={image.src}>
                <Picture
                  asset={image}
                  className="w-full rounded-[8px] bg-surface object-contain"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <figcaption className="mt-4 text-meta leading-relaxed text-ink-2">
        {figure.caption}
      </figcaption>
    </figure>
  );
}

/**
 * The case-study body: markdown from content/, with the drawn figures spliced
 * in where the text calls for them.
 */
export function CaseStudyBody({ study, ui }: { study: CaseStudy; ui: Ui }) {
  const figures = new Map((study.figures ?? []).map((item) => [item.id, item]));
  const pieces = study.body.split(FIGURE_MARKER);

  return (
    <div className="case-body">
      {pieces.map((piece, i) => {
        // split() with one capture group alternates: text, id, text, id, …
        if (i % 2 === 1) {
          const figure = figures.get(piece);
          if (!figure) return null;
          return <FigureBlock key={`figure-${piece}`} figure={figure} ui={ui} />;
        }
        const trimmed = piece.trim();
        if (!trimmed) return null;
        return (
          <div
            key={`text-${i}`}
            className="case-prose"
            // Content is first-party markdown from content/, rendered at build time.
            dangerouslySetInnerHTML={{ __html: toHtml(trimmed) }}
          />
        );
      })}
    </div>
  );
}


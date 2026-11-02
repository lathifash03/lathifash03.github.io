import type { ReactNode } from "react";
import { Diagram, type DiagramName } from "@/components/diagrams/Diagram";
import { StackedCards } from "@/components/motion/StackedCards";
import { Section } from "@/components/ui/Section";
import { Gallery } from "@/components/ui/Gallery";
import { MetricChips } from "@/components/ui/Metric";
import { ProjectLinks, TeamLabel } from "@/components/ui/ProjectLinks";
import { Picture } from "@/components/ui/Picture";
import { TagList } from "@/components/ui/Tag";
import type { LaneId, Locale, Project, Ui } from "@/lib/content";

/** Diagrams are drawn per project; a project without one is single column (decision B). */
const diagrams: Record<string, DiagramName> = {
  "kg-agent": "kgAgent",
  "narrative-to-procedural": "thesis",
};

/**
 * DESIGN.md §4: white digits on the lane's chip colour. This chip carries a
 * word, not a glyph, so it uses the text-safe shade of the hue — white on the
 * lighter chip is 4.08:1, which is fine for an icon and short of AA for text.
 */
const indexChip: Record<LaneId, string> = {
  ai: "bg-chip-ai-text",
  sw: "bg-chip-sw-text",
  wr: "bg-chip-wr-text",
};

function ResearchCard({
  project,
  index,
  total,
  ui,
  locale,
}: {
  project: Project;
  index: number;
  total: number;
  ui: Ui;
  locale: Locale;
}) {
  const name = diagrams[project.slug];
  const visual: ReactNode = name ? (
    <Diagram name={name} ui={ui} narrow />
  ) : project.image ? (
    <Picture
      asset={project.image}
      className="max-h-full w-full rounded-[8px] object-contain"
    />
  ) : null;

  return (
    <article className="rounded-card border border-line bg-white p-6 md:p-8 lg:p-10">
      <div
        className={
          visual ? "grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12" : ""
        }
      >
        <div className={visual ? "lg:col-span-8" : ""}>
          <p className="flex items-center gap-4 font-mono text-meta text-ink-2">
            {/* DESIGN.md §4: the index is the card's one saturated mark. */}
            <span className={`rounded-full px-2.5 py-1 text-white ${indexChip[project.lane]}`}>
              {`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
            </span>
            <span>{project.year}</span>
          </p>

          <h3 className="mt-4 font-display text-card text-ink">{project.title}</h3>
          <p className="mt-2 text-ink-2">{project.context}</p>
          <div className="mt-1">
            <TeamLabel project={project} ui={ui} />
          </div>

          {/* Nothing is clipped: a summary that would run past three lines
              on the card is shortened in content instead (DESIGN.md §4). */}
          <p className="mt-4 max-w-[68ch] text-ink">{project.summary}</p>

          {project.gallery?.length ? (
            <div className="mt-6">
              <Gallery images={project.gallery} />
            </div>
          ) : null}

          {project.metrics?.length ? (
            <div className="mt-5">
              <MetricChips metrics={project.metrics} lane={project.lane} />
            </div>
          ) : null}

          <div className="mt-5">
            <TagList tags={project.tags} lane={project.lane} />
          </div>

          <div className="mt-5">
            <ProjectLinks links={project.links} ui={ui} locale={locale} />
          </div>
        </div>

        {visual ? (
          // The panel colour comes from content, so a new card brings its own
          // ground rather than editing this component (DESIGN.md §2).
          // The panel is a fixed height once the cards stack, and the
          // drawing inside is scaled to fit it rather than setting the card's
          // height itself (DESIGN.md §4, §7.6).
          <div
            className="flex flex-col justify-center rounded-image p-4 md:p-8 lg:col-span-4 lg:p-6 lg:[&_svg]:max-h-[37rem]"
            style={{ backgroundColor: project.panel ?? "var(--surface-2)" }}
          >
            {visual}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export function Research({
  projects,
  ui,
  locale,
}: {
  projects: Project[];
  ui: Ui;
  locale: Locale;
}) {
  return (
    <Section id="research" index="01" title={ui.sections.research}>
      <StackedCards>
        {projects.map((project, i) => (
          <ResearchCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            ui={ui}
            locale={locale}
          />
        ))}
      </StackedCards>
    </Section>
  );
}

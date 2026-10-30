import type { ReactNode } from "react";
import { Diagram, type DiagramName } from "@/components/diagrams/Diagram";
import { Section } from "@/components/ui/Section";
import { Gallery } from "@/components/ui/Gallery";
import { MetricBlock } from "@/components/ui/Metric";
import { ProjectLinks, TeamLabel } from "@/components/ui/ProjectLinks";
import { Picture } from "@/components/ui/Picture";
import { TagList } from "@/components/ui/Tag";
import type { Project, Ui } from "@/lib/content";

/** Diagrams are drawn per project; a project without one is single column (decision B). */
const diagrams: Record<string, DiagramName> = {
  "kg-agent": "kgAgent",
  "narrative-to-procedural": "thesis",
};

function ResearchCard({
  project,
  index,
  total,
  ui,
}: {
  project: Project;
  index: number;
  total: number;
  ui: Ui;
}) {
  const name = diagrams[project.slug];
  const visual: ReactNode = name ? (
    <Diagram name={name} ui={ui} />
  ) : project.image ? (
    <Picture asset={project.image} className="w-full rounded-[8px] object-cover" />
  ) : null;

  return (
    <article className="rounded-card bg-surface p-6 md:p-10">
      <div
        className={
          visual ? "grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12" : ""
        }
      >
        <div className={visual ? "lg:col-span-7" : ""}>
          <p className="flex gap-4 font-mono text-meta text-ink-2">
            <span>{`${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}</span>
            <span>{project.year}</span>
          </p>

          <h3 className="mt-5 text-card text-ink">{project.title}</h3>
          <p className="mt-3 text-ink-2">{project.context}</p>
          <div className="mt-1">
            <TeamLabel project={project} ui={ui} />
          </div>

          <p className="mt-6 max-w-[68ch] text-ink">{project.summary}</p>

          {project.gallery?.length ? (
            <div className="mt-8">
              <Gallery images={project.gallery} />
            </div>
          ) : null}

          {project.metrics?.length ? (
            <ul className="mt-10 space-y-8">
              {project.metrics.map((metric) => (
                <li key={metric.label}>
                  <MetricBlock metric={metric} />
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-10">
            <TagList tags={project.tags} lane={project.lane} />
          </div>

          <div className="mt-8">
            <ProjectLinks links={project.links} ui={ui} />
          </div>
        </div>

        {visual ? (
          <div className="rounded-image bg-surface-2 p-4 md:p-8 lg:col-span-5">
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
}: {
  projects: Project[];
  ui: Ui;
}) {
  return (
    <Section id="research" index="01" title={ui.sections.research}>
      <div className="space-y-6 md:space-y-8">
        {projects.map((project, i) => (
          <ResearchCard
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
            ui={ui}
          />
        ))}
      </div>
    </Section>
  );
}

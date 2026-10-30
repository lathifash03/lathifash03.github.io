import { Gallery } from "@/components/ui/Gallery";
import { Section } from "@/components/ui/Section";
import { MetricInline } from "@/components/ui/Metric";
import { ProjectLinks, TeamLabel } from "@/components/ui/ProjectLinks";
import { TagList } from "@/components/ui/Tag";
import type { Project, Ui } from "@/lib/content";

/** Decision E: bordered rows, no cards; metric inline with its caveat. */
function DataRow({ project, ui }: { project: Project; ui: Ui }) {
  return (
    <article className="grid gap-x-8 gap-y-5 border-t border-line py-10 md:grid-cols-12">
      <div className="md:col-span-3">
        <p className="font-mono text-meta text-ink-2">{project.year}</p>
        <div className="mt-1">
          <TeamLabel project={project} ui={ui} />
        </div>
      </div>

      <div className="md:col-span-9">
        <h3 className="text-[1.375rem] leading-snug text-ink">{project.title}</h3>
        <p className="mt-2 text-ink-2">{project.context}</p>
        <p className="mt-4 max-w-[68ch] text-ink">{project.summary}</p>

        {project.metrics?.length ? (
          <ul className="mt-5 space-y-2">
            {project.metrics.map((metric) => (
              <li key={metric.label}>
                <MetricInline metric={metric} />
              </li>
            ))}
          </ul>
        ) : null}

        {project.gallery?.length ? (
          <div className="mt-6">
            <Gallery images={project.gallery} />
          </div>
        ) : null}

        <div className="mt-6">
          <TagList tags={project.tags} lane={project.lane} />
        </div>

        <div className="mt-5">
          <ProjectLinks links={project.links} ui={ui} />
        </div>
      </div>
    </article>
  );
}

export function Data({ projects, ui }: { projects: Project[]; ui: Ui }) {
  return (
    <Section id="data" index="03" title={ui.sections.data}>
      <div>
        {projects.map((project) => (
          <DataRow key={project.slug} project={project} ui={ui} />
        ))}
      </div>
    </Section>
  );
}

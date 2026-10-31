import { ScreenshotBelt } from "@/components/motion/ScreenshotBelt";
import { DeviceFrame } from "@/components/ui/DeviceFrame";
import { Gallery } from "@/components/ui/Gallery";
import { Section } from "@/components/ui/Section";
import { ProjectLinks, TeamLabel } from "@/components/ui/ProjectLinks";
import { TagList } from "@/components/ui/Tag";
import type { Locale, Project, Ui } from "@/lib/content";

/** Decision E: compact card, optional 16:10 image on top, 2 columns from 768px. */
function BuiltCard({
  project,
  ui,
  locale,
}: {
  project: Project;
  ui: Ui;
  locale: Locale;
}) {
  return (
    <article
      data-reveal
      className="flex flex-col rounded-card border border-line bg-surface p-6 md:p-8"
    >
      {project.image ? (
        <div className="mb-8">
          <DeviceFrame asset={project.image} frame={project.frame} />
        </div>
      ) : null}

      <p className="font-mono text-meta text-ink-2">{project.year}</p>
      <h3 className="mt-4 text-[1.375rem] leading-snug text-ink">
        {project.title}
      </h3>
      <p className="mt-2 text-ink-2">{project.context}</p>
      <div className="mt-1">
        <TeamLabel project={project} ui={ui} />
      </div>

      <p className="mt-5 max-w-[68ch] grow text-ink">{project.summary}</p>

      {project.gallery?.length ? (
        <div className="mt-6">
          <Gallery images={project.gallery} />
        </div>
      ) : null}

      <div className="mt-8">
        <TagList tags={project.tags} lane={project.lane} />
      </div>

      <div className="mt-6">
        <ProjectLinks links={project.links} ui={ui} locale={locale} />
      </div>
    </article>
  );
}

export function Built({
  projects,
  ui,
  locale,
}: {
  projects: Project[];
  ui: Ui;
  locale: Locale;
}) {
  return (
    <Section id="built" index="02" title={ui.sections.built}>
      <ScreenshotBelt projects={projects} ui={ui} />

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
        {projects.map((project) => (
          <BuiltCard
            key={project.slug}
            project={project}
            ui={ui}
            locale={locale}
          />
        ))}
      </div>
    </Section>
  );
}

import { localePath, type Locale, type Project, type Ui } from "@/lib/content";

/** Every label comes from ui.json (CLAUDE.md hard rule 6). */
export function ProjectLinks({
  links,
  ui,
  locale,
}: {
  links: Project["links"];
  ui: Ui;
  locale: Locale;
}) {
  const items: { href: string; label: string }[] = [];
  if (links.caseStudy)
    items.push({
      href: localePath(locale, links.caseStudy),
      label: ui.actions.readCaseStudy,
    });
  if (links.demo) items.push({ href: links.demo, label: ui.actions.liveDemo });
  if (links.code) items.push({ href: links.code, label: ui.actions.viewCode });
  if (links.report)
    items.push({ href: links.report, label: ui.actions.readReport });
  if (links.article)
    items.push({ href: links.article, label: ui.actions.readArticle });

  if (!items.length) return null;

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            className="group inline-flex items-center gap-1.5 text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
          >
            {item.label}
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-[3px]"
            >
              →
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function TeamLabel({
  project,
  ui,
}: {
  project: Project;
  ui: Ui;
}) {
  if (!project.team) return null;
  return (
    <p className="font-mono text-meta text-ink-2">
      {ui.labels.teamProject}
      {project.teamSize
        ? ` · ${ui.labels.teamSize.replace("{n}", String(project.teamSize))}`
        : ""}
    </p>
  );
}

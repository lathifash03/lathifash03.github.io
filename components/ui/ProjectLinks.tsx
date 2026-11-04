import { ExternalIcon } from "@/components/ui/ExternalIcon";
import { localePath, type Locale, type Project, type Ui } from "@/lib/content";
import { leavesSite, newTab } from "@/lib/links";

/** Every label comes from ui.json (CLAUDE.md hard rule 6). */

/**
 * A case study may link a second repository of its own (`evalCode`), which no
 * project card carries — hence the widened type rather than a second component.
 */
type Links = Project["links"] & { evalCode?: string };

export function ProjectLinks({
  links,
  ui,
  locale,
  title,
}: {
  links: Links;
  ui: Ui;
  locale: Locale;
  /**
   * The project these links belong to. Several cards show the same "View code",
   * so the title goes into each accessible name (DESIGN.md §4).
   */
  title?: string;
}) {
  const items: { href: string; label: string; note?: string }[] = [];
  if (links.caseStudy)
    items.push({
      href: localePath(locale, links.caseStudy),
      label: ui.actions.readCaseStudy,
    });
  if (links.demo)
    items.push({
      href: links.demo,
      label: ui.actions.liveDemo,
      note: links.demoNote,
    });
  if (links.code) items.push({ href: links.code, label: ui.actions.viewCode });
  if (links.evalCode)
    items.push({ href: links.evalCode, label: ui.actions.evalCode });
  if (links.report)
    items.push({ href: links.report, label: ui.actions.readReport });
  if (links.article)
    items.push({ href: links.article, label: ui.actions.readArticle });

  if (!items.length) return null;

  return (
    <ul className="flex flex-wrap gap-x-6 gap-y-2">
      {items.map((item) => {
        const away = leavesSite(item.href);
        return (
          <li key={item.href} className="max-w-full">
            <a
              href={item.href}
              // The name keeps the visible text and adds the project, so
              // WCAG 2.5.3 holds while 2.4.4 tells the cards apart.
              aria-label={
                title
                  ? ui.labels.linkFor
                      .replace("{action}", item.label)
                      .replace("{title}", title)
                  : undefined
              }
              {...newTab(item.href)}
              className="inline-flex items-center gap-1.5 text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
            >
              {item.label}
              {away ? <ExternalIcon /> : null}
            </a>
            {/* Same treatment as a metric's caveat (DESIGN.md §4): it is read
                with the link, not hidden behind a hover. */}
            {item.note ? (
              <span className="font-mono text-meta text-ink-2"> · {item.note}</span>
            ) : null}
          </li>
        );
      })}
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

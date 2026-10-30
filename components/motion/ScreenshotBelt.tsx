import { Picture } from "@/components/ui/Picture";
import type { Asset, Project, Ui } from "@/lib/content";

/**
 * DESIGN.md §7.7. The shots are whatever the Built projects actually carry —
 * pruned assets have already been dropped from the content, so a missing file
 * removes a shot rather than leaving a gap. The row is rendered twice and
 * drifts by exactly half its width, which is what makes the 40s loop seamless;
 * the second half is decoration and is hidden from assistive technology.
 */
export function ScreenshotBelt({
  projects,
  ui,
}: {
  projects: Project[];
  ui: Ui;
}) {
  const shots: Asset[] = projects.flatMap((project) => [
    ...(project.image ? [project.image] : []),
    ...(project.gallery ?? []),
  ]);

  // Two shots is the least that reads as a row rather than a stray image.
  if (shots.length < 2) return null;

  const item = (shot: Asset, duplicate: boolean) => (
    <li
      key={`${duplicate ? "dup" : "shot"}-${shot.src}`}
      className={duplicate ? "belt-dup" : undefined}
      aria-hidden={duplicate ? "true" : undefined}
    >
      <Picture
        asset={duplicate ? { ...shot, alt: "" } : shot}
        className="aspect-[16/10] w-[280px] rounded-image bg-surface object-cover md:w-[360px]"
      />
    </li>
  );

  return (
    <div
      className="belt-viewport"
      role="group"
      aria-label={ui.labels.screenshots}
      tabIndex={0}
    >
      <ul className="belt">
        {shots.map((shot) => item(shot, false))}
        {shots.map((shot) => item(shot, true))}
      </ul>
    </div>
  );
}

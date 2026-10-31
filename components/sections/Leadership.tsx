import { BlurIn } from "@/components/motion/BlurIn";
import { Picture } from "@/components/ui/Picture";
import { Section } from "@/components/ui/Section";
import type { Leadership as LeadershipContent, Ui } from "@/lib/content";

/**
 * DESIGN.md §4, "Speaking / Training row card". These were a small meta-sized
 * list; they are the same words at body size on the wr tint, with the year in
 * its own mono column and the detail set below the title.
 */
function RowList({
  title,
  items,
}: {
  title: string;
  items: LeadershipContent["speaking"];
}) {
  if (!items.length) return null;
  // One list, one left edge: once any row carries a year, every row reserves
  // the same column for it, so the titles line up down the list.
  const dated = items.some((item) => item.year);
  return (
    <div>
      <h3 className="font-mono text-meta text-ink-2">{title}</h3>
      <ul className="mt-5 space-y-3">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex gap-4 rounded-image bg-lane-wr-tint p-5"
          >
            {dated ? (
              <p
                aria-hidden={item.year ? undefined : "true"}
                className="w-10 shrink-0 font-mono text-meta text-lane-wr-strong"
              >
                {item.year ?? ""}
              </p>
            ) : null}
            <div>
              <p className="text-body text-ink">{item.title}</p>
              {item.detail ? (
                <p className="mt-1 text-ink-2">{item.detail}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Leadership({
  content,
  ui,
}: {
  content: LeadershipContent;
  ui: Ui;
}) {
  return (
    <Section id="leadership" index="05" title={ui.sections.leadership}>
      <p className="max-w-[48ch] text-hero-statement text-ink">
        {content.intro}
      </p>

      <ul className="mt-16 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12">
        {content.roles.map((role) => (
          <li key={`${role.org}-${role.role}`}>
            <BlurIn>
              <p className="font-mono text-meta text-ink-2">{role.period}</p>
              <h3 className="mt-3 text-[1.375rem] leading-snug text-ink">
                {role.role}
              </h3>
              <p className="mt-1 text-ink-2">{role.org}</p>
              <p className="mt-4 max-w-[60ch] text-ink">{role.detail}</p>
            </BlurIn>
          </li>
        ))}
      </ul>

      <div className="mt-20 grid gap-12 lg:grid-cols-2 lg:gap-8">
        <RowList title={ui.sections.speaking} items={content.speaking} />
        <RowList title={ui.sections.training} items={content.training} />
      </div>

      {content.gallery.length ? (
        <ul className="mt-20 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {content.gallery.map((photo) => (
            <li key={photo.src}>
              <BlurIn>
                <figure>
                  <Picture
                    asset={photo}
                    className="aspect-[4/3] w-full rounded-image bg-surface-2 object-cover"
                  />
                  <figcaption className="mt-3 text-meta text-ink-2">
                    {photo.caption}
                  </figcaption>
                </figure>
              </BlurIn>
            </li>
          ))}
        </ul>
      ) : null}
    </Section>
  );
}

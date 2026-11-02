import type { CSSProperties } from "react";
import { BlurIn } from "@/components/motion/BlurIn";
import { ExternalIcon } from "@/components/ui/ExternalIcon";
import { Picture } from "@/components/ui/Picture";
import { Section } from "@/components/ui/Section";
import type {
  Leadership as LeadershipContent,
  TrainingCategory,
  Ui,
} from "@/lib/content";

/**
 * DESIGN.md §4: two photos overlapping, the portrait in front and the
 * landscape behind and offset, each tilted its own way so they read as prints
 * laid down rather than a grid. The tilts are static layout, not motion, so
 * they survive prefers-reduced-motion.
 */
function SpeakingCollage({
  photos,
}: {
  photos: NonNullable<LeadershipContent["speakingPhotos"]>;
}) {
  const [front, behind] = photos;
  return (
    <div className="relative pb-10 sm:pb-16">
      <div className="w-[72%] rotate-[-3deg] overflow-hidden rounded-[20px] border-[3px] border-white shadow-tile">
        <Picture
          asset={front}
          className="aspect-[600/1003] w-full bg-surface-2 object-cover"
        />
      </div>
      <div className="absolute right-0 bottom-0 w-[62%] rotate-2 overflow-hidden rounded-[20px] border-[3px] border-white shadow-tile">
        <Picture
          asset={behind}
          className="aspect-[1080/635] w-full bg-surface-2 object-cover"
        />
      </div>
    </div>
  );
}

/**
 * DESIGN.md §4, "Role photo stack". One to three prints tucked behind the
 * right edge of a role, tilted and mostly hidden; pointing at them — or
 * tapping, or tabbing to them — fans them out and lifts the front one. It is
 * a button because that gesture is an action, and its accessible name is the
 * photographs' own alt text, which is the context the stack carries.
 */
function PhotoStack({
  photos,
}: {
  photos: NonNullable<LeadershipContent["roles"][number]["photos"]>;
}) {
  return (
    <button type="button" className="photo-stack">
      {photos.map((photo, i) => (
        <span
          key={photo.src}
          className="photo-stack-card"
          style={{ "--i": i } as CSSProperties}
        >
          <Picture asset={photo} className="size-full object-cover" />
        </span>
      ))}
    </button>
  );
}

/** DESIGN.md §4, "Speaking row card": body size on the wr tint, year apart. */
function SpeakingList({
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

/** DESIGN.md §2: the chip carries the category, so the category is a colour. */
const categoryChip: Record<TrainingCategory, string> = {
  ict: "bg-lane-ai-tint text-lane-ai-strong",
  community: "bg-lane-wr-tint text-lane-wr-strong",
  business: "bg-lane-sw-tint text-lane-sw-strong",
  productivity: "bg-growth-tint text-growth-strong",
};

/** DESIGN.md §4, "Training card": chip, title, organiser, date, one line. */
function TrainingList({
  title,
  items,
  ui,
}: {
  title: string;
  items: LeadershipContent["training"];
  ui: Ui;
}) {
  if (!items.length) return null;
  return (
    <div>
      <h3 className="font-mono text-meta text-ink-2">{title}</h3>
      <ul className="mt-5 grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <li
            key={item.title}
            className="flex h-full flex-col rounded-image border border-line p-5"
          >
            <p className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span
                className={`rounded-full px-3 py-1 font-mono text-[0.75rem] leading-5 ${categoryChip[item.category]}`}
              >
                {ui.labels.categories[item.category]}
              </span>
              <span className="font-mono text-meta text-ink-2">{item.date}</span>
            </p>
            <p className="mt-4 text-body text-ink">{item.title}</p>
            <p className="mt-1 text-ink-2">{item.org}</p>
            <p className="mt-3 text-ink-2">{item.detail}</p>
            {item.verify ? (
              <p className="mt-auto pt-4">
                <a
                  href={item.verify}
                  className="inline-flex items-center gap-1.5 text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                >
                  {ui.actions.verify}
                  <ExternalIcon />
                </a>
              </p>
            ) : null}
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
              {/* The stack sits against the row's right edge, so the role's
                  own words keep the measure they had (DESIGN.md §4). */}
              <div className="relative">
                {/* Only the heading lines give way to the stack; the detail
                    paragraph below it keeps the full measure. */}
                <div className={role.photos ? "xl:pr-[13.5rem]" : undefined}>
                  <p className="font-mono text-meta text-ink-2">{role.period}</p>
                  <h3 className="mt-3 font-display text-[1.375rem] leading-snug text-ink">
                    {role.role}
                  </h3>
                  <p className="mt-1 text-ink-2">{role.org}</p>
                </div>
                <p className="mt-4 max-w-[60ch] text-ink">{role.detail}</p>
                {role.photos ? <PhotoStack photos={role.photos} /> : null}
              </div>
            </BlurIn>
          </li>
        ))}
      </ul>

      {/* The collage sits beside the Speaking rows from 1024px and above them
          on a phone, so the photos and the list they belong to are read
          together (DESIGN.md §4). */}
      <div className="mt-20 grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-10">
        {content.speakingPhotos ? (
          <div className="lg:col-span-5">
            <SpeakingCollage photos={content.speakingPhotos} />
          </div>
        ) : null}
        <div className={content.speakingPhotos ? "lg:col-span-7" : "lg:col-span-12"}>
          <SpeakingList title={ui.sections.speaking} items={content.speaking} />
        </div>
      </div>

      <div className="mt-16">
        <TrainingList title={ui.sections.training} items={content.training} ui={ui} />
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

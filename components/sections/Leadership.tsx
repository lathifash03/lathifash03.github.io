import { BlurIn } from "@/components/motion/BlurIn";
import { Picture } from "@/components/ui/Picture";
import { Section } from "@/components/ui/Section";
import type { Leadership as LeadershipContent, Ui } from "@/lib/content";

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

      <div className="mt-20 grid gap-12 md:grid-cols-2 md:gap-8">
        <div>
          <h3 className="font-mono text-meta text-ink-2">
            {ui.sections.speaking}
          </h3>
          <ul className="mt-5 space-y-4">
            {content.speaking.map((item) => (
              <li key={item} className="max-w-[60ch] text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-mono text-meta text-ink-2">
            {ui.sections.training}
          </h3>
          <ul className="mt-5 space-y-4">
            {content.training.map((item) => (
              <li key={item} className="max-w-[60ch] text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
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

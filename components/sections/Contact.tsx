import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import type { Profile, Ui } from "@/lib/content";

export function Contact({ profile, ui }: { profile: Profile; ui: Ui }) {
  const { contact, education, languages, skills } = profile;

  return (
    <Section id="contact" index="07" title={ui.sections.contact}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="max-w-[40ch] text-hero-statement text-ink">
            {contact.closing}
          </p>

          <a
            href={`mailto:${contact.email}`}
            className="mt-8 inline-block break-all font-mono text-[1.0625rem] text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
          >
            {contact.email}
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href={contact.cv} variant="primary">
              {ui.actions.downloadCv}
            </LinkButton>
            <CopyEmail
              email={contact.email}
              label={ui.actions.copyEmail}
              copiedLabel={ui.actions.copied}
            />
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[contact.github, contact.linkedin].map((href) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-mono text-meta text-ink underline decoration-line underline-offset-4 transition-colors duration-200 hover:decoration-ink"
                >
                  {href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-5">
          <h3 className="text-[1.375rem] leading-snug text-ink">
            {education.degree}
          </h3>
          <p className="mt-2 text-ink-2">{education.school}</p>
          <dl className="mt-6 space-y-3">
            {[
              education.period,
              education.gpa,
              education.scholarship,
              education.thesis,
            ].map((line) => (
              <dd key={line} className="max-w-[48ch] text-ink">
                {line}
              </dd>
            ))}
          </dl>

          <div className="mt-10 space-y-6">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}>
                <p className="font-mono text-meta text-ink-2">{group}</p>
                <p className="mt-2 max-w-[48ch] text-ink">{items.join(" · ")}</p>
              </div>
            ))}
            <div>
              <p className="font-mono text-meta text-ink-2">
                {ui.labels.languages}
              </p>
              <p className="mt-2 text-ink">{languages.join(" · ")}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

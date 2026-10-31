import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import type { Profile, Ui } from "@/lib/content";

/**
 * DESIGN.md §4, "Contact band": the closing section is the page's one dark
 * block. Everything that was `--ink` / `--ink-2` on white becomes
 * `--paper` / `--paper` at 70% here, which is 14.25:1 and 9.5:1 on ink.
 */
export function Contact({ profile, ui }: { profile: Profile; ui: Ui }) {
  const { contact, education, languages, skills } = profile;

  return (
    <Section id="contact" index="07" title={ui.sections.contact} tone="dark">
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-8">
        <div data-reveal className="lg:col-span-7">
          <p className="max-w-[40ch] text-hero-statement text-white">
            {contact.closing}
          </p>

          <a
            href={`mailto:${contact.email}`}
            className="mt-8 inline-block break-all font-mono text-[1.0625rem] text-paper underline decoration-paper/40 underline-offset-4 transition-colors duration-200 hover:decoration-paper"
          >
            {contact.email}
          </a>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <LinkButton href={contact.cv} variant="primaryOnDark">
              {ui.actions.downloadCv}
            </LinkButton>
            <CopyEmail
              email={contact.email}
              label={ui.actions.copyEmail}
              copiedLabel={ui.actions.copied}
              onDark
            />
          </div>

          <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[contact.github, contact.linkedin, contact.medium].map((href) => (
              <li key={href}>
                <a
                  href={href}
                  className="font-mono text-meta text-paper underline decoration-paper/40 underline-offset-4 transition-colors duration-200 hover:decoration-paper"
                >
                  {href.replace(/^https?:\/\/(www\.)?/, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal className="lg:col-span-5">
          <h3 className="text-[1.375rem] leading-snug text-white">
            {education.degree}
          </h3>
          <p className="mt-2 text-paper/70">{education.school}</p>
          {/* Plain facts with no terms to pair them to, so a list, not a
              description list: a <dl> of bare <dd>s fails WCAG 1.3.1. */}
          <ul className="mt-6 space-y-3">
            {[
              education.period,
              education.gpa,
              education.scholarship,
              education.thesis,
            ].map((line) => (
              <li key={line} className="max-w-[48ch] text-paper">
                {line}
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-6">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}>
                <p className="font-mono text-meta text-paper/70">{group}</p>
                <p className="mt-2 max-w-[48ch] text-paper">
                  {items.join(" · ")}
                </p>
              </div>
            ))}
            <div>
              <p className="font-mono text-meta text-paper/70">
                {ui.labels.languages}
              </p>
              <p className="mt-2 text-paper">{languages.join(" · ")}</p>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

import { LocalClock } from "@/components/LocalClock";
import { Section } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { CopyEmail } from "@/components/ui/CopyEmail";
import { Picture } from "@/components/ui/Picture";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile, Ui } from "@/lib/content";

/**
 * Drawn here for the same reason as the lane glyphs: three marks do not earn
 * an icon package. Each is decoration beside its own label, so it is hidden
 * from the accessibility tree.
 */
const subjectIcon: Record<string, string> = {
  // briefcase — a role
  internship:
    "M9 4h6a2 2 0 0 1 2 2v1h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h3V6a2 2 0 0 1 2-2Zm0 3h6V6H9v1ZM4 9v9h16V9H4Z",
  // flask — a research idea
  research:
    "M9 2h6v2h-1v5.3l4.4 8.2A2 2 0 0 1 16.6 21H7.4a2 2 0 0 1-1.8-3.5L10 9.3V4H9V2Zm3 2v5.8L8.2 17h7.6L12 9.8V4Z",
  // waving hand — just saying hi
  hello:
    "M12 2a1.5 1.5 0 0 1 1.5 1.5V10h1V4.5a1.5 1.5 0 0 1 3 0V13a7 7 0 0 1-7 7h-.6a6 6 0 0 1-4.6-2.2l-3-3.7a1.5 1.5 0 0 1 2.2-2l1.9 1.9V5.5a1.5 1.5 0 0 1 3 0V10h1V3.5A1.5 1.5 0 0 1 12 2Z",
};

/**
 * DESIGN.md §4, "Start-a-message card". Three `mailto:` links with a
 * prefilled subject — the reader's own mail client does the work, so there is
 * no form, no backend and nothing is posted anywhere.
 */
function StartMessage({ profile, ui }: { profile: Profile; ui: Ui }) {
  const { contact, location, photo, name } = profile;
  const options = [
    ["internship", ui.message.internship],
    ["research", ui.message.research],
    ["hello", ui.message.hello],
  ] as const;

  return (
    <div className="rounded-card bg-white p-6 md:p-8">
      <div className="flex items-center gap-4">
        {photo ? (
          <span className="inline-block shrink-0 -rotate-[5deg] rounded-[14px] border-2 border-white bg-tile shadow-tile">
            <Picture
              asset={photo}
              className="size-12 rounded-[12px] object-cover object-top"
            />
          </span>
        ) : null}
        <div>
          <p className="font-display text-[1.0625rem] leading-tight text-ink">
            {name}
          </p>
          <LocalClock
            city={location.city}
            zone={location.zone}
            timeZone={location.timezone}
            ariaLabel={ui.labels.clock}
            variant="compact"
            className="mt-0.5 font-mono text-meta text-ink-2"
          />
        </div>
      </div>

      <p className="mt-6 text-ink">{ui.message.line}</p>

      <ul className="mt-4 flex flex-col gap-2">
        {options.map(([key, subject]) => (
          <li key={key}>
            <a
              href={`mailto:${contact.email}?subject=${encodeURIComponent(subject)}`}
              className="group flex items-center gap-3 rounded-full border border-line px-4 py-2.5 text-[0.9375rem] text-ink transition-colors duration-200 hover:bg-surface-2"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-[18px] shrink-0 text-ink-2"
              >
                <path d={subjectIcon[key]} />
              </svg>
              {subject}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-meta text-ink-2">{ui.message.note}</p>
    </div>
  );
}

/**
 * DESIGN.md §4, "Contact band": the page's one dark block, in two balanced
 * columns. Everything that was `--ink` / `--ink-2` on white becomes
 * `--paper` / `--paper` at 70% here, which is 14.25:1 and 9.5:1 on ink.
 */
export function Contact({ profile, ui }: { profile: Profile; ui: Ui }) {
  const { contact } = profile;

  return (
    <Section id="contact" index="07" title={ui.sections.contact} tone="dark">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div data-reveal>
          <p className="max-w-[16ch] font-display text-[clamp(2rem,3.6vw,3.25rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
            {contact.headline}
          </p>

          <p className="mt-6 max-w-[42ch] text-paper/80">{contact.closing}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* The address is the button: a reader can see where it goes
                before clicking, and copy it from the control beside it. */}
            <a
              href={`mailto:${contact.email}`}
              className="inline-flex h-12 items-center rounded-full bg-paper px-6 font-mono text-[0.9375rem] break-all text-ink transition-colors duration-200 hover:bg-white"
            >
              {contact.email}
            </a>
            <CopyEmail
              email={contact.email}
              label={ui.actions.copyEmail}
              copiedLabel={ui.actions.copied}
              onDark
            />
          </div>

          <div className="mt-8">
            <LinkButton href={contact.cv} variant="secondaryOnDark">
              {ui.actions.downloadCv}
            </LinkButton>
          </div>

          {/* The same circles as the hero row, inverted for the dark ground.
              Each is icon-only, so its name comes from ui.json. */}
          <div className="mt-10">
            <SocialLinks profile={profile} ui={ui} set="contact" onDark />
          </div>
        </div>

        <div data-reveal>
          <StartMessage profile={profile} ui={ui} />
        </div>
      </div>
    </Section>
  );
}

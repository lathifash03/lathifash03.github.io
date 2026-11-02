import type { CSSProperties } from "react";
import { LocalClock } from "@/components/LocalClock";
import { Picture } from "@/components/ui/Picture";
import { Container } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { SocialLinks } from "@/components/ui/SocialLinks";
import type { Profile, Ui } from "@/lib/content";

/** DESIGN.md §2: the three status colours exist only on this dark card. */
const traceMark: Record<string, { mark: string; className: string }> = {
  pass: { mark: "✓", className: "text-trace-pass" },
  fail: { mark: "✗", className: "text-trace-fail" },
  retry: { mark: "↻", className: "text-trace-retry" },
  done: { mark: "✓", className: "text-trace-pass" },
};

/** DESIGN.md §7.3. */
const PER_CHAR = 22;
const LINE_GAP = 180;
/** The lines start after the hero itself has settled. */
const START = 400;

/**
 * DESIGN.md §7.3. The lines type in, in file order, and the card never adds,
 * edits or reorders their text.
 *
 * Each line's timing is worked out here, from its own character count, and
 * written into the element as a complete `animation` shorthand. It has to be a
 * literal rather than a `var()` inside `steps()`, which Safari refuses — and
 * the stylesheet's reduced-motion block carries `!important`, so it still
 * overrides these inline values and leaves every line finished.
 */
function VerifyTrace({ profile, ui }: { profile: Profile; ui: Ui }) {
  const specs = profile.heroTrace.map((line) => {
    const full = line.threshold ? `${line.text} ${line.threshold}` : line.text;
    const chars = full.length;
    return { ...line, chars, duration: chars * PER_CHAR };
  });
  // Each line waits for every line before it, summed rather than accumulated
  // in place: a render must not carry state between its own iterations.
  const lines = specs.map((spec, i) => ({
    ...spec,
    delay:
      START +
      specs
        .slice(0, i)
        .reduce((sum, previous) => sum + previous.duration + LINE_GAP, 0),
  }));

  return (
    <figure>
      <div
        data-dark
        className="rotate-2 rounded-card bg-ink p-6 text-paper shadow-stack md:p-7"
      >
        <p className="font-mono text-meta text-paper/60">
          {ui.labels.traceHeader}
        </p>
        <hr className="mt-4 border-paper/15" />
        <ul className="mt-4 space-y-2.5">
          {lines.map((line, i) => {
            const { mark, className } = traceMark[line.status];
            const last = i === lines.length - 1;
            return (
              <li
                key={line.text}
                className="flex items-baseline gap-x-3 font-mono text-meta"
              >
                <span
                  aria-hidden="true"
                  className={`trace-mark ${className}`}
                  style={{
                    animationDelay: `calc(var(--intro-delay) + ${line.delay + line.duration}ms)`,
                  }}
                >
                  {mark}
                </span>
                <span
                  className="trace-type"
                  style={
                    {
                      animation: `trace-type ${line.duration}ms steps(${line.chars}, end) both`,
                      animationDelay: `calc(var(--intro-delay) + ${line.delay}ms)`,
                    } as CSSProperties
                  }
                >
                  <span className="text-paper">{line.text}</span>
                  {line.threshold ? (
                    <span className="text-paper/55"> {line.threshold}</span>
                  ) : null}
                </span>
                {last ? (
                  <span
                    aria-hidden="true"
                    className="trace-caret"
                    style={{
                      animationDelay: `calc(var(--intro-delay) + ${line.delay + line.duration}ms)`,
                    }}
                  >
                    &nbsp;
                  </span>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
      <figcaption className="mt-5 text-meta text-ink-2">
        {ui.labels.illustration}
      </figcaption>
    </figure>
  );
}

/**
 * DESIGN.md §4: a small tilted tile holding the cut-out portrait, inline with
 * the name. It is the only portrait in the hero.
 */
function PortraitTile({ profile }: { profile: Profile }) {
  if (!profile.photo) return null;
  return (
    // shrink-0: the tile shares a flex row with the name, and the name's
    // min-content width would otherwise squeeze the tile out of square and
    // crop the portrait off-centre.
    <span className="inline-block shrink-0 -rotate-[5deg] rounded-[24px] border-[3px] border-white bg-tile shadow-tile">
      <Picture
        asset={profile.photo}
        priority
        className="size-24 rounded-[21px] object-cover object-top md:size-36"
      />
    </span>
  );
}

/**
 * DESIGN.md §4, "the hero stack". The photo sits behind and the trace card
 * overlaps its lower-left corner; below 1024px they stop overlapping and
 * become two stacked blocks, so neither covers the other on a phone.
 *
 * The photo is absent until its file exists (it is draft in content), and the
 * stack simply collapses to the trace card alone — never a broken image.
 */
function HeroStack({ profile, ui }: { profile: Profile; ui: Ui }) {
  const photo = profile.photoCard;
  return (
    <div className={photo ? "lg:relative lg:pb-28" : ""}>
      {photo ? (
        // Right-aligned, so the card below can clip its lower-left corner
        // rather than sitting across the middle of the picture.
        <div className="mb-8 -rotate-4 overflow-hidden rounded-card border-[3px] border-white shadow-tile lg:mb-0 lg:ml-auto lg:w-[72%]">
          <Picture
            asset={photo}
            className="aspect-4/5 w-full bg-surface-2 object-cover"
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </div>
      ) : null}
      <div className={photo ? "lg:absolute lg:bottom-0 lg:left-0 lg:w-[88%]" : ""}>
        <VerifyTrace profile={profile} ui={ui} />
      </div>
    </div>
  );
}

export function Hero({ profile, ui }: { profile: Profile; ui: Ui }) {
  return (
    <section id="hero" className="pt-28 pb-12 md:pt-40 md:pb-16">
      <Container>
        <div className="grid items-start gap-x-8 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            {/* Pill sits top-right of the hero block on desktop, above the
                name on a phone, so it never crowds the portrait tile. */}
            <div
              className="hero-rise flex md:justify-end"
              style={{ "--i": 0 } as CSSProperties}
            >
              <p className="inline-flex items-center gap-2.5 rounded-full border border-lane-sw-strong/20 bg-lane-sw-tint px-4 py-1.5 font-mono text-meta text-lane-sw-strong">
                <span
                  aria-hidden="true"
                  className="inline-block size-2 rounded-full bg-lane-sw"
                />
                {profile.status}
              </p>
            </div>

            <div
              className="hero-rise mt-6 flex items-center gap-5"
              style={{ "--i": 1 } as CSSProperties}
            >
              <PortraitTile profile={profile} />
              <h1 className="text-hero-name text-ink">{profile.name}</h1>
            </div>

            <p
              className="hero-rise mt-8 max-w-[68ch] text-hero-statement text-ink"
              style={{ "--i": 2 } as CSSProperties}
            >
              {profile.statement}
            </p>

            <div
              className="hero-rise mt-10 flex flex-wrap items-center gap-3"
              style={{ "--i": 3 } as CSSProperties}
            >
              <LinkButton href={profile.contact.cv} variant="primary">
                {ui.actions.downloadCv}
              </LinkButton>
              <LinkButton href={`mailto:${profile.contact.email}`}>
                {ui.actions.email}
              </LinkButton>
            </div>

            {/* Socials and the clock share one row, split by a hairline. The
                rule is hidden once the row wraps, where it would dangle. */}
            <div
              className="hero-rise mt-8 flex flex-wrap items-center gap-x-6 gap-y-4"
              style={{ "--i": 4 } as CSSProperties}
            >
              <SocialLinks profile={profile} ui={ui} />
              <span
                aria-hidden="true"
                className="hidden h-8 w-px bg-line sm:block"
              />
              <LocalClock
                label={profile.location.label}
                timeZone={profile.location.timezone}
                ariaLabel={ui.labels.clock}
              />
            </div>
          </div>

          <div
            className="hero-rise lg:col-span-5 lg:pt-10"
            style={{ "--i": 2 } as CSSProperties}
          >
            <HeroStack profile={profile} ui={ui} />
          </div>
        </div>
      </Container>
    </section>
  );
}

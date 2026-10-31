import { SiteNav } from "@/components/SiteNav";
import { Intro } from "@/components/motion/Intro";
import { IntroSkip } from "@/components/motion/IntroSkip";
import { Built } from "@/components/sections/Built";
import { Contact } from "@/components/sections/Contact";
import { Data } from "@/components/sections/Data";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Lanes } from "@/components/sections/Lanes";
import { Leadership } from "@/components/sections/Leadership";
import { Research } from "@/components/sections/Research";
import { Writing } from "@/components/sections/Writing";
import {
  getExperience,
  getLeadership,
  getProfile,
  getProjectsByGroup,
  getUi,
  getWriting,
  hasCompleteLocale,
  localePath,
  otherLocale,
  reportMissingAssets,
  type Locale,
} from "@/lib/content";

/** One page, both locales: the route only chooses which content/ folder to read. */
export function HomePage({ locale }: { locale: Locale }) {
  const profile = getProfile(locale);
  const ui = getUi(locale);
  const research = getProjectsByGroup(locale, "research");
  const built = getProjectsByGroup(locale, "built");
  const data = getProjectsByGroup(locale, "data");

  const other = otherLocale(locale);
  const offerOther = hasCompleteLocale(other);

  reportMissingAssets();

  return (
    <>
      {/* DESIGN.md §7.1. Above the page, never in place of it. */}
      <Intro profile={profile} />
      <IntroSkip />
      <SiteNav
        name={profile.name}
        ui={ui}
        locale={locale}
        otherLocale={offerOther ? other : null}
        otherPath={offerOther ? localePath(other, "/") : null}
      />
      <main>
        <Hero profile={profile} ui={ui} />
        <Lanes profile={profile} ui={ui} />
        <Research projects={research} ui={ui} locale={locale} />
        <Built projects={built} ui={ui} locale={locale} />
        <Data projects={data} ui={ui} locale={locale} />
        <Experience items={getExperience(locale)} ui={ui} locale={locale} />
        <Leadership content={getLeadership(locale)} ui={ui} />
        <Writing content={getWriting(locale)} ui={ui} />
        <Contact profile={profile} ui={ui} />
      </main>
    </>
  );
}

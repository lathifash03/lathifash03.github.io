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
  reportMissingAssets,
} from "@/lib/content";

const locale = "en";

export default function HomePage() {
  const profile = getProfile(locale);
  const ui = getUi(locale);
  const research = getProjectsByGroup(locale, "research");
  const built = getProjectsByGroup(locale, "built");
  const data = getProjectsByGroup(locale, "data");

  reportMissingAssets();

  return (
    <>
      {/* DESIGN.md §7.1. Above the page, never in place of it. */}
      <Intro profile={profile} />
      <IntroSkip />
      <SiteNav name={profile.name} ui={ui} />
      <main>
        <Hero profile={profile} ui={ui} />
        <Lanes profile={profile} ui={ui} />
        <Research projects={research} ui={ui} />
        <Built projects={built} ui={ui} />
        <Data projects={data} ui={ui} />
        <Experience items={getExperience(locale)} ui={ui} />
        <Leadership content={getLeadership(locale)} ui={ui} />
        <Writing content={getWriting(locale)} ui={ui} />
        <Contact profile={profile} ui={ui} />
      </main>
    </>
  );
}

import type { MetadataRoute } from "next";
import {
  availableLocales,
  getCaseStudies,
  localePath,
  otherLocale,
  hasCompleteLocale,
  type Locale,
} from "@/lib/content";
import { siteUrl } from "@/lib/metadata";

// Reading content/ at build time makes the route look dynamic to Next;
// `output: export` needs it pinned (CLAUDE.md, Stack).
export const dynamic = "force-static";

/**
 * Lists only the locales the language gate actually published, so an incomplete
 * translation is never advertised to a crawler (CLAUDE.md, Routes). Each entry
 * also names its counterpart, matching the hreflang pairs on the pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of availableLocales()) {
    const routes = ["/", ...getCaseStudies(locale).map((s) => `/projects/${s.slug}/`)];

    for (const route of routes) {
      const other = otherLocale(locale);
      entries.push({
        url: `${siteUrl}${localePath(locale, route)}`,
        changeFrequency: "monthly",
        // The home page is the entry point; case studies sit below it.
        priority: route === "/" ? 1 : 0.8,
        alternates: hasCompleteLocale(other)
          ? {
              languages: {
                [locale]: `${siteUrl}${localePath(locale, route)}`,
                [other]: `${siteUrl}${localePath(other, route)}`,
              } as Record<Locale, string>,
            }
          : undefined,
      });
    }
  }

  return entries;
}

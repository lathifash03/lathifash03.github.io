import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/metadata";

// Reading content/ at build time makes the route look dynamic to Next;
// `output: export` needs it pinned (CLAUDE.md, Stack).
export const dynamic = "force-static";

/**
 * Nothing here is private, so everything is crawlable. The pages of an
 * unpublished locale carry their own `noindex` (CLAUDE.md, Routes); they are
 * not listed here, because a Disallow would also hide the complete locale once
 * the translation lands.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

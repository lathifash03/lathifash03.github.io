/**
 * One rule for links that leave the site (DESIGN.md §4): a different origin
 * opens in a new tab, and the tab never gets a handle on this page.
 *
 * A site-relative path, a hash and a `mailto:`/`tel:` scheme are all excluded:
 * the first two stay here, and handing a mail client to a new tab would leave
 * an empty one behind.
 */
export function leavesSite(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/** Spread onto an `<a>`: the new-tab pair, or nothing for a link that stays. */
export function newTab(href: string): { target: "_blank"; rel: string } | Record<string, never> {
  return leavesSite(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}

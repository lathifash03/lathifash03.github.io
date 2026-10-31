import { Container } from "@/components/ui/Section";
import { LinkButton } from "@/components/ui/Button";
import { defaultLocale, getProfile, getUi } from "@/lib/content";
import { fontVariables } from "./fonts";
import "./globals.css";

/**
 * GitHub Pages serves one 404.html for every unknown path, so this page is in
 * the default locale.
 *
 * It renders its own <html> because it sits above both locale route groups and
 * so has no root layout of its own. Next still emits a bare <html> wrapper
 * around it; the HTML parser folds this element's attributes onto that root, so
 * the served page keeps its lang and font classes. Without this, the 404 would
 * be the only page with no lang attribute and no stylesheet.
 */
export default function NotFound() {
  const ui = getUi(defaultLocale);
  const profile = getProfile(defaultLocale);

  return (
    <html lang={defaultLocale} className={fontVariables}>
      <body className="antialiased">
        <main className="flex min-h-screen items-center py-20">
          <Container>
            <p className="font-mono text-meta text-ink-2">404</p>
            <h1 className="mt-4 max-w-[24ch] text-section text-ink">
              {ui.notFound.title}
            </h1>
            <div className="mt-10">
              <LinkButton href="/" variant="primary">
                {ui.notFound.home}
              </LinkButton>
            </div>
            <p className="mt-16 font-mono text-meta text-ink-2">
              {profile.name}
            </p>
          </Container>
        </main>
      </body>
    </html>
  );
}

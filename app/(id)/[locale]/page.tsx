import { notFound } from "next/navigation";
import { HomePage } from "@/components/pages/HomePage";
import { prefixedLocales, toLocale } from "@/lib/content";

/**
 * `output: export` rejects an empty param list, so an untranslated site still
 * has to name one route. That route then 404s instead of rendering: a locale
 * is either complete or absent, never half-translated (CLAUDE.md, Routes).
 */
export function generateStaticParams() {
  const translated = prefixedLocales();
  return translated.length ? translated.map((locale) => ({ locale })) : [{ locale: "id" }];
}

export default async function TranslatedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!prefixedLocales().some((item) => item === locale)) notFound();
  return <HomePage locale={toLocale(locale)} />;
}

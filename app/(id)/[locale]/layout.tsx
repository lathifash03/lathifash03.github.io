import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/app/shell";
import { prefixedLocales, toLocale } from "@/lib/content";
import { siteMetadata } from "@/lib/metadata";

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale } = await params;
  // The page 404s for a locale that is not built, and its content files may not
  // exist, so nothing is read here either.
  if (!prefixedLocales().some((item) => item === locale)) return {};
  return siteMetadata(toLocale(locale));
}

export default async function TranslatedLayout({
  children,
  params,
}: Params & { children: ReactNode }) {
  const { locale } = await params;
  return <SiteShell lang={toLocale(locale)}>{children}</SiteShell>;
}

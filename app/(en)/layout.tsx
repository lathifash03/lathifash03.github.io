import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/app/shell";
import { siteMetadata } from "@/lib/metadata";

export function generateMetadata(): Metadata {
  return siteMetadata("en");
}

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteShell lang="en">{children}</SiteShell>;
}

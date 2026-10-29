import { getProfile } from "@/lib/content";

export default function HomePage() {
  const profile = getProfile("en");

  return (
    <main className="mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center px-6 py-20 md:px-12">
      <h1 className="text-hero-name text-ink">{profile.name}</h1>
      <p className="mt-10 max-w-[68ch] text-hero-statement text-ink">
        {profile.statement}
      </p>
    </main>
  );
}

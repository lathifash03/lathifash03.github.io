import type { LaneId } from "@/lib/content";

/**
 * DESIGN.md §4: tint fill, strong text, no border. The pair is measured AA on
 * the tint itself, on white and on paper (§2), so a pill is legible wherever a
 * card puts it.
 */
const laneTag: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-lane-ai-strong",
  sw: "bg-lane-sw-tint text-lane-sw-strong",
  wr: "bg-lane-wr-tint text-lane-wr-strong",
};

export function TagList({ tags, lane }: { tags: string[]; lane: LaneId }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`rounded-full px-3 py-1 font-mono text-[0.75rem] leading-5 ${laneTag[lane]}`}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

import type { LaneId } from "@/lib/content";

const laneBorder: Record<LaneId, string> = {
  ai: "border-lane-ai",
  sw: "border-lane-sw",
  wr: "border-lane-wr",
};

/** DESIGN.md §4: pill, 1px border in the lane colour, ink text, mono 12px. */
export function TagList({ tags, lane }: { tags: string[]; lane: LaneId }) {
  if (!tags.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className={`rounded-full border px-3 py-1 font-mono text-[0.75rem] leading-5 text-ink ${laneBorder[lane]}`}
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

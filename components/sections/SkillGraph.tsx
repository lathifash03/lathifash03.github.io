import type { CSSProperties } from "react";
import { Picture } from "@/components/ui/Picture";
import type { Asset, LaneId } from "@/lib/content";

const laneStroke: Record<LaneId, string> = {
  ai: "var(--lane-ai-strong)",
  sw: "var(--lane-sw-strong)",
  wr: "var(--lane-wr-strong)",
};

const laneNode: Record<LaneId, string> = {
  ai: "bg-lane-ai-tint text-lane-ai-strong",
  sw: "bg-lane-sw-tint text-lane-sw-strong",
  wr: "bg-lane-wr-tint text-lane-wr-strong",
};

/**
 * Where a skill sits, in percent of the box. Two columns either side of the
 * portrait, because the labels are words: a ring would have to rotate them or
 * overlap them. The small offsets are a function of the index rather than
 * random, so the server and the client lay the graph out identically.
 */
function place(i: number, n: number) {
  const leftCount = Math.ceil(n / 2);
  const onLeft = i < leftCount;
  const column = onLeft ? i : i - leftCount;
  const count = onLeft ? leftCount : n - leftCount;
  const y = count === 1 ? 50 : 10 + (column * 80) / (count - 1);
  // ±3.2% of lateral drift, so the column reads as a graph rather than a list.
  const jitter = (((i * 7) % 5) - 2) * 1.6;
  const x = onLeft ? 19 + jitter : 81 + jitter;
  return { x, y };
}

/**
 * DESIGN.md §4, "Skill graph". The lane's skills as nodes joined to the
 * portrait, drifting a few pixels with a pulse running out along each edge
 * (§7.14). It is decoration over a list: the same skills are in the markup as
 * plain text beside it, which is what a screen reader and a phone get.
 *
 * Edges are drawn in a box of 0-100 in both axes and stretched to whatever
 * size the panel has, so an edge always meets its node; `non-scaling-stroke`
 * keeps the hairline a hairline under that stretch, and `pathLength` makes
 * every pulse the same length however long its edge is.
 */
export function SkillGraph({
  skills,
  lane,
  photo,
}: {
  skills: string[];
  lane: LaneId;
  photo?: Asset;
}) {
  const nodes = skills.map((skill, i) => ({ skill, ...place(i, skills.length) }));

  return (
    <div
      aria-hidden="true"
      className="relative hidden h-[22rem] w-full md:block lg:h-[26rem]"
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 size-full"
      >
        {nodes.map((node, i) => (
          <g key={node.skill} stroke={laneStroke[lane]}>
            <line
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              strokeWidth="1"
              strokeOpacity="0.3"
              vectorEffect="non-scaling-stroke"
            />
            <line
              className="graph-pulse"
              x1="50"
              y1="50"
              x2={node.x}
              y2={node.y}
              pathLength="100"
              strokeWidth="1.5"
              strokeDasharray="8 92"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ "--delay": `${(i % 6) * 520}ms` } as CSSProperties}
            />
          </g>
        ))}
      </svg>

      {photo ? (
        <span className="graph-centre absolute left-1/2 top-1/2 inline-block rounded-[20px] border-[3px] border-white bg-tile shadow-tile">
          <Picture
            asset={photo}
            className="size-20 rounded-[17px] object-cover object-top lg:size-24"
          />
        </span>
      ) : null}

      {nodes.map((node, i) => (
        <span
          key={node.skill}
          className={`graph-node absolute rounded-full px-2.5 py-1 font-mono text-[0.75rem] leading-5 whitespace-nowrap ${laneNode[lane]}`}
          style={
            {
              left: `${node.x}%`,
              top: `${node.y}%`,
              "--dx": `${(((i * 5) % 7) - 3)}px`,
              "--dy": `${(((i * 3) % 5) - 2)}px`,
              "--dur": `${5200 + (i % 5) * 900}ms`,
              "--delay": `${(i % 7) * 340}ms`,
            } as CSSProperties
          }
        >
          {node.skill}
        </span>
      ))}
    </div>
  );
}

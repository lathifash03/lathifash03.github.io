import type { SVGProps } from "react";
import { lineHeight } from "./layout";

/** A wrapped SVG label: one `<tspan>` per line, stacked from the baseline `y`. */
export function Lines({
  lines,
  x,
  y,
  fontSize,
  ...rest
}: { lines: string[]; x: number; y: number; fontSize: number } & SVGProps<SVGTextElement>) {
  return (
    <text x={x} y={y} fontSize={fontSize} {...rest}>
      {lines.map((line, i) => (
        <tspan key={line} x={x} dy={i === 0 ? 0 : lineHeight(fontSize)}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

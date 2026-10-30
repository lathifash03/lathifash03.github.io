/**
 * Shared geometry for the drawn figures.
 *
 * Both diagrams are vertical flows. The phone variant is not the wide one
 * scaled down: it has its own narrower viewBox and larger type, so that once
 * the SVG is fitted to a 390px screen the smallest label still renders at
 * 13px or more.
 */
export type DiagramVariant = "wide" | "phone";

export type Metrics = {
  /** viewBox width */
  w: number;
  /** margin left and right of a full-width box */
  inset: number;
  /** padding inside a box */
  pad: number;
  /** title size */
  fs: number;
  /** detail and mono size */
  fsSm: number;
  /** vertical space taken by an arrow between two boxes */
  gap: number;
};

export const metrics: Record<DiagramVariant, Metrics> = {
  wide: { w: 360, inset: 28, pad: 14, fs: 14, fsSm: 12.5, gap: 24 },
  phone: { w: 276, inset: 16, pad: 12, fs: 15, fsSm: 14, gap: 20 },
};

export const lineHeight = (fontSize: number) => Math.round(fontSize * 1.4);

/**
 * Greedy word wrap. SVG `<text>` does not wrap, and the labels come from
 * content, so their length is not ours to choose: measuring them by average
 * glyph width is close enough to keep every line inside its box.
 */
export function wrap(
  text: string,
  fontSize: number,
  maxWidth: number,
  mono = false,
): string[] {
  const perChar = fontSize * (mono ? 0.6 : 0.53);
  const maxChars = Math.max(8, Math.floor(maxWidth / perChar));

  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/)) {
    const candidate = line ? `${line} ${word}` : word;
    if (candidate.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}
